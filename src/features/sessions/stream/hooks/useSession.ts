import { useEffect, useCallback, useRef } from 'react';
import { getSocket, disconnectSocket } from '../lib/socketClient';
import { useMediasoup } from './useMediasoup';

interface UseSessionOptions {
    sessionId: string;
    peerId: string;
    role: 'host' | 'viewer';
    token: string;
}

export function useSession({ sessionId, peerId, role, token }: UseSessionOptions) {
    // Single mediasoup instance — used everywhere
    const mediasoup = useMediasoup();
    const socket = getSocket();

    // Use a ref to the consume function to avoid stale closures
    const consumeProducerRef = useRef(mediasoup.consumeProducer);
    consumeProducerRef.current = mediasoup.consumeProducer;

    const loadDeviceRef = useRef(mediasoup.loadDevice);
    loadDeviceRef.current = mediasoup.loadDevice;

    const createSendTransportRef = useRef(mediasoup.createSendTransport);
    createSendTransportRef.current = mediasoup.createSendTransport;

    const createRecvTransportRef = useRef(mediasoup.createRecvTransport);
    createRecvTransportRef.current = mediasoup.createRecvTransport;

    const produceMediaRef = useRef(mediasoup.produceMedia);
    produceMediaRef.current = mediasoup.produceMedia;

    const cleanupRef = useRef(mediasoup.cleanup);
    cleanupRef.current = mediasoup.cleanup;

    const joinSession = useCallback(async () => {
        socket.connect();

        await new Promise<void>((resolve) => {
            socket.once('connect', resolve);
        });

        socket.emit('joinSession', { sessionId, peerId, role, token });

        await loadDeviceRef.current(socket);
        await createSendTransportRef.current(socket);
        await createRecvTransportRef.current(socket);

        // CRITICAL: set up newProducer listener BEFORE producing
        socket.off('newProducer'); // remove any old listeners
        socket.on('newProducer', async ({ producerId, appData, peerId: remotePeerId, role: remoteRole }) => {
            console.log('🆕 New producer, consuming:', producerId, 'from role:', remoteRole);
            await consumeProducerRef.current(socket, producerId, {
                source: appData?.source ?? 'camera',
                peerId: remotePeerId,
                role: remoteRole,
            });
        });

        // Produce own media
        try {
            await produceMediaRef.current();
        } catch (err) {
            console.warn('Camera not available:', err);
        }

        // Get existing producers
        const { producers } = await new Promise<any>((resolve) => {
            socket.emit('getProducers', resolve);
        });

        console.log('📋 Existing producers:', producers);

        for (const producer of producers) {
            await consumeProducerRef.current(socket, producer.producerId, {
                source: producer.appData?.source ?? 'camera',
                peerId: producer.peerId,
                role: producer.role,
            });
        }

    }, [sessionId, peerId, role, token]);

    const leaveSession = useCallback(() => {
        socket.off('newProducer');
        cleanupRef.current();
        disconnectSocket();
    }, []);

    useEffect(() => {
        return () => { leaveSession(); };
    }, []);

    // Return mediasoup state directly — same instance SessionRoom reads from
    return {
        joinSession,
        leaveSession,
        socket,
        localStream: mediasoup.localStream,
        remoteStreams: mediasoup.remoteStreams,
        produceMedia: mediasoup.produceMedia,
        produceScreen: mediasoup.produceScreen,
        stopScreen: mediasoup.stopScreen,
    };
}