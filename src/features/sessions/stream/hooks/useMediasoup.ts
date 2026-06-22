import { useRef, useState } from 'react';
import * as mediasoupClient from 'mediasoup-client';
import { Socket } from 'socket.io-client';

export interface RemoteStream {
    consumerId: string;
    producerId: string;
    stream: MediaStream;
    kind: string;
    source: string;   // 'camera' | 'screen' | 'mic'
    peerId: string;
    role: string;     // 'host' | 'viewer'
}

export function useMediasoup() {
    const deviceRef = useRef<mediasoupClient.Device | null>(null);
    const sendTransportRef = useRef<mediasoupClient.types.Transport | null>(null);
    const recvTransportRef = useRef<mediasoupClient.types.Transport | null>(null);
    const screenProducerRef = useRef<mediasoupClient.types.Producer | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const consumedProducerIds = useRef<Set<string>>(new Set());

    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);

    async function loadDevice(socket: Socket): Promise<void> {
        socketRef.current = socket;
        const { rtpCapabilities } = await new Promise<any>((resolve) => {
            socket.once('routerRtpCapabilities', resolve);
        });
        const device = new mediasoupClient.Device();
        await device.load({ routerRtpCapabilities: rtpCapabilities });
        deviceRef.current = device;
    }

    async function createSendTransport(socket: Socket): Promise<void> {
        const transportOptions = await new Promise<any>((resolve) => {
            socket.emit('createTransport', { direction: 'send' }, resolve);
        });
        if (transportOptions.error) throw new Error(transportOptions.error);

        const transport = deviceRef.current!.createSendTransport(transportOptions);

        transport.on('connect', ({ dtlsParameters }, callback, errback) => {
            socket.emit('connectTransport', { transportId: transport.id, dtlsParameters },
                (res: any) => res.error ? errback(new Error(res.error)) : callback());
        });

        transport.on('produce', ({ kind, rtpParameters, appData }, callback, errback) => {
            socket.emit('produce', { kind, rtpParameters, appData },
                (res: any) => res.error ? errback(new Error(res.error)) : callback({ id: res.id }));
        });

        // ── DEBUG: log ICE/DTLS state transitions ──────────────────────────────
        transport.on('connectionstatechange', (state) => {
            console.log('[SEND transport] connectionstatechange:', state);
        });

        sendTransportRef.current = transport;
    }

    async function createRecvTransport(socket: Socket): Promise<void> {
        const transportOptions = await new Promise<any>((resolve) => {
            socket.emit('createTransport', { direction: 'recv' }, resolve);
        });
        if (transportOptions.error) throw new Error(transportOptions.error);

        const transport = deviceRef.current!.createRecvTransport(transportOptions);

        transport.on('connect', ({ dtlsParameters }, callback, errback) => {
            socket.emit('connectTransport', { transportId: transport.id, dtlsParameters },
                (res: any) => res.error ? errback(new Error(res.error)) : callback());
        });

        // ── DEBUG: log ICE/DTLS state transitions ──────────────────────────────
        transport.on('connectionstatechange', (state) => {
            console.log('[RECV transport] connectionstatechange:', state);
        });
        transport.on('connectionstatechange', (state) => {
            console.log('[SEND transport] connectionstatechange:', state);
        });
        transport.on('connectionstatechange', (state) => {
            console.log('[RECV transport] connectionstatechange:', state);
        });

        recvTransportRef.current = transport;

        socket.on('producerClosed', ({ producerId }: { producerId: string }) => {
            setRemoteStreams(prev => prev.filter(s => s.producerId !== producerId));
        });

        socket.on('consumerClosed', ({ consumerId }: { consumerId: string }) => {
            setRemoteStreams(prev => prev.filter(s => s.consumerId !== consumerId));
        });
        // // Listen for producerClosed — remove stream by producerId
        // socketRef.current?.on('producerClosed', ({ producerId }: { producerId: string }) => {
        //     setRemoteStreams(prev => prev.filter(s => s.producerId !== producerId));
        // });

        // // Listen for consumerClosed
        // socketRef.current?.on('consumerClosed', ({ consumerId }: { consumerId: string }) => {
        //     setRemoteStreams(prev => prev.filter(s => s.consumerId !== consumerId));
        // });
    }

    async function produceMedia(): Promise<void> {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        const transport = sendTransportRef.current!;
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) await transport.produce({ track: videoTrack, appData: { source: 'camera' } });
        const audioTrack = stream.getAudioTracks()[0];
        if (audioTrack) await transport.produce({ track: audioTrack, appData: { source: 'mic' } });
    }

    async function produceMediaAudioOnly(): Promise<void> {
        const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
        const transport = sendTransportRef.current!;
        const audioTrack = stream.getAudioTracks()[0];
        if (audioTrack) await transport.produce({ track: audioTrack, appData: { source: 'mic' } });
    }

    async function produceScreen(onStopped?: () => void, existingStream?: MediaStream): Promise<MediaStream> {
        const stream = existingStream || await navigator.mediaDevices.getDisplayMedia({ video: true });
        const transport = sendTransportRef.current!;
        const videoTrack = stream.getVideoTracks()[0];
        const producer = await transport.produce({ track: videoTrack, appData: { source: 'screen' } });
        screenProducerRef.current = producer;

        videoTrack.onended = () => {
            stopScreen();
            onStopped?.();
        };
        return stream;
    }

    function stopScreen(): void {
        if (screenProducerRef.current) {
            const producerId = screenProducerRef.current.id;
            screenProducerRef.current.track?.stop();
            screenProducerRef.current.close();
            screenProducerRef.current = null;
            socketRef.current?.emit('closeProducer', { producerId }, () => { });
        }
    }

    async function consumeProducer(
        socket: Socket,
        producerId: string,
        appData?: any
    ): Promise<void> {
        // Dedup: skip if we already consumed this producer
        if (consumedProducerIds.current.has(producerId)) {
            console.log('⏭️ Already consumed, skipping:', producerId);
            return;
        }
        consumedProducerIds.current.add(producerId);

        console.log('🎯 consumeProducer START', producerId, appData);
        const device = deviceRef.current!;
        const transport = recvTransportRef.current!;

        console.log('device:', !!device, 'transport:', !!transport);

        const consumerOptions = await new Promise<any>((resolve) => {
            socket.emit('consume', { producerId, rtpCapabilities: device.rtpCapabilities }, resolve);
        });
        console.log('📦 consumerOptions:', consumerOptions);
        if (consumerOptions.error) {
            console.error('consume error:', consumerOptions.error);
            return;
        }

        const consumer = await transport.consume(consumerOptions);
        console.log('✅ consumer created:', consumer.id, 'kind:', consumer.kind);

        await new Promise<void>((resolve) => {
            socket.emit('resumeConsumer', { consumerId: consumer.id }, () => resolve());
        });

        const stream = new MediaStream([consumer.track]);
        const source = appData?.source ?? (consumer.kind === 'video' ? 'camera' : 'mic');
        const role = appData?.role ?? 'unknown';

        console.log('📡 Adding to remoteStreams:', { source, role, kind: consumer.kind });

        if (consumer.kind === 'video') {
            setRemoteStreams(prev => {
                const next = [...prev, {
                    consumerId: consumer.id,
                    producerId,
                    stream,
                    kind: consumer.kind,
                    source,
                    peerId: appData?.peerId ?? '',
                    role,
                }];
                console.log('🔄 setRemoteStreams called, new length:', next.length);
                return next;
            });
        }

        consumer.on('transportclose', () => {
            setRemoteStreams(prev => prev.filter(s => s.consumerId !== consumer.id));
        });

        consumer.on('trackended', () => {
            setRemoteStreams(prev => prev.filter(s => s.consumerId !== consumer.id));
        });
    }



    function cleanup() {
        localStream?.getTracks().forEach(t => t.stop());
        stopScreen();
        sendTransportRef.current?.close();
        recvTransportRef.current?.close();
        consumedProducerIds.current.clear();
        setLocalStream(null);
        setRemoteStreams([]);
    }

    return {
        loadDevice,
        createSendTransport,
        createRecvTransport,
        produceMedia,
        produceMediaAudioOnly,
        produceScreen,
        stopScreen,
        consumeProducer,
        cleanup,
        localStream,
        remoteStreams,
    };
}