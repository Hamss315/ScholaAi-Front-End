// import { useEffect, useCallback } from 'react';
// import { getSocket, disconnectSocket } from '../lib/socketClient';
// import { useMediasoup } from './useMediasoup';

// interface UseSessionOptions {
//     sessionId: string;
//     peerId: string;
//     role: 'host' | 'viewer';
//     token: string;
// }

// export function useSession({ sessionId, peerId, role, token }: UseSessionOptions) {
//     const mediasoup = useMediasoup();
//     const socket = getSocket();

//     const joinSession = useCallback(async () => {
//         socket.connect();

//         await new Promise<void>((resolve) => {
//             socket.once('connect', resolve);
//         });

//         socket.emit('joinSession', { sessionId, peerId, role, token });
//         await mediasoup.loadDevice(socket);

//         if (role === 'host') {
//             await mediasoup.createSendTransport(socket);
//             await mediasoup.createRecvTransport(socket);
//             await mediasoup.produceMedia();
//         } else {
//             await mediasoup.createRecvTransport(socket);

//             const { producers } = await new Promise<any>((resolve) => {
//                 socket.emit('getProducers', resolve);
//             });

//             for (const { producerId } of producers) {
//                 await mediasoup.consumeProducer(socket, producerId);
//             }

//             socket.on('newProducer', async ({ producerId }) => {
//                 await mediasoup.consumeProducer(socket, producerId);
//             });
//         }
//     }, [sessionId, peerId, role, token]);

//     const leaveSession = useCallback(() => {
//         mediasoup.cleanup();
//         disconnectSocket();
//     }, []);

//     useEffect(() => {
//         return () => { leaveSession(); };
//     }, []);

//     return {
//         ...mediasoup,
//         joinSession,
//         leaveSession,
//         socket,
//     };
// }

import { useEffect, useCallback } from 'react';
import { getSocket, disconnectSocket } from '../lib/socketClient';
import { useMediasoup } from './useMediasoup';

interface UseSessionOptions {
    sessionId: string;
    peerId: string;
    role: 'host' | 'viewer';
    token: string;
}

export function useSession({ sessionId, peerId, role, token }: UseSessionOptions) {
    const mediasoup = useMediasoup();
    const socket = getSocket();

    const joinSession = useCallback(async () => {
        socket.connect();

        await new Promise<void>((resolve) => {
            socket.once('connect', resolve);
        });

        socket.emit('joinSession', { sessionId, peerId, role, token });
        await mediasoup.loadDevice(socket);

        // Both host and viewer create send + recv transports
        await mediasoup.createSendTransport(socket);
        await mediasoup.createRecvTransport(socket);

        // Both host and viewer produce media immediately on join
        await mediasoup.produceMedia();

        // Both host and viewer consume existing producers
        const { producers } = await new Promise<any>((resolve) => {
            socket.emit('getProducers', resolve);
        });

        for (const producer of producers) {
            await mediasoup.consumeProducer(socket, producer.producerId, {
                source: producer.appData?.source ?? 'camera',
                peerId: producer.peerId,
            });
        }

        // Both listen for new producers
        socket.on('newProducer', async ({ producerId, appData, peerId: remotePeerId }) => {
            await mediasoup.consumeProducer(socket, producerId, {
                source: appData?.source ?? 'camera',
                peerId: remotePeerId,
            });
        });

    }, [sessionId, peerId, role, token]);

    const leaveSession = useCallback(() => {
        mediasoup.cleanup();
        disconnectSocket();
    }, []);

    useEffect(() => {
        return () => { leaveSession(); };
    }, []);

    return {
        ...mediasoup,
        joinSession,
        leaveSession,
        socket,
    };
}