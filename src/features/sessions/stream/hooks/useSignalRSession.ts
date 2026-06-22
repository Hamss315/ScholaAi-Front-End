import * as signalR from '@microsoft/signalr';
import { useEffect, useRef, useState, useCallback } from 'react';

export interface SignalRPeer {
    socketId: string;
    role: string;
}

export function useSignalRSession(
    roomId: string,
    role: 'host' | 'viewer',
    onDistractionAlert?: (reason: string) => void,
) {
    const hubRef = useRef<signalR.HubConnection | null>(null);
    const [peers, setPeers] = useState<SignalRPeer[]>([]);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const connect = useCallback(async () => {
        const hub = new signalR.HubConnectionBuilder()
            .withUrl(`http://${window.location.hostname}:5254/hub/session`, {  // match .NET port
                withCredentials: true,
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Warning)
            .build();

        hub.on('RoomJoined', (payload) => {
            console.log('[SignalR] RoomJoined:', payload);
            // payload.existingUsers is a list of connectionIds already in the room
            setPeers(payload.existingUsers.map((id: string) => ({ socketId: id, role: 'unknown' })));
            setConnected(true);
        });

        hub.on('PeerJoined', (data: { socketId: string; role: string }) => {
            console.log('[SignalR] PeerJoined:', data);
            setPeers(prev => [...prev, data]);
        });

        hub.on('PeerLeft', (socketId: string) => {
            console.log('[SignalR] PeerLeft:', socketId);
            setPeers(prev => prev.filter(p => p.socketId !== socketId));
        });

        hub.on('Error', (msg: string) => {
            console.error('[SignalR] Hub error:', msg);
            setError(msg);
        });

        // Real-time distraction alert from focus_server.py (routed via .NET backend)
        hub.on('DistractionAlert', (reason: string) => {
            console.warn('[SignalR] ⚠️ DistractionAlert:', reason);
            onDistractionAlert?.(reason);
        });

        try {
            await hub.start();
            await hub.invoke('JoinRoom', roomId, role);
            hubRef.current = hub;
        } catch (err) {
            console.error('[SignalR] Connection failed:', err);
            setError('Failed to connect to session hub');
        }
    }, [roomId, role]);

    const disconnect = useCallback(async () => {
        if (hubRef.current) {
            await hubRef.current.stop();
            hubRef.current = null;
            setConnected(false);
            setPeers([]);
        }
    }, []);

    // Expose method to send distraction alerts later (Step 3 / AI integration)
    const notifyDistraction = useCallback(async (reason: string) => {
        if (hubRef.current?.state === signalR.HubConnectionState.Connected) {
            await hubRef.current.invoke('StudentDistracted', roomId, reason);
        }
    }, [roomId]);

    useEffect(() => {
        return () => { disconnect(); };
    }, []);

    return { connect, disconnect, notifyDistraction, peers, connected, error, hub: hubRef };
}