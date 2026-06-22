import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
    if (!socket) {
        socket = io(`http://${window.location.hostname}:4443`, {
            transports: ['websocket'],
            autoConnect: false,
        });
    }
    return socket;
}

export function disconnectSocket(): void {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}