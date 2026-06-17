import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { VideoTile } from './VideoTile';
import { ControlBar } from './ControlBar';
import { useSession } from '../hooks/useSession';
import { useSignalRSession } from '../hooks/useSignalRSession';

interface SessionRoomProps {
    sessionId: string;
    peerId: string;
    role: 'host' | 'viewer';
    token: string;
}

export function SessionRoom({ sessionId, peerId, role, token }: SessionRoomProps) {
    const navigate = useNavigate();
    const [joined, setJoined] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [sessionDuration, setSessionDuration] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const signalR = useSignalRSession(sessionId, role);

    const {
        joinSession,
        leaveSession,
        produceScreen,
        stopScreen,
        produceMedia,
        localStream,
        remoteStreams,
    } = useSession({ sessionId, peerId, role, token });

    useEffect(() => {
        if (joined) {
            timerRef.current = setInterval(() => setSessionDuration(d => d + 1), 1000);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [joined]);

    async function handleJoin() {
        setLoading(true);
        try {
            await Promise.all([
                joinSession(),           // mediasoup (already works)
                signalR.connect(),       // SignalR .NET hub (new)
            ]);
            setJoined(true);
        } catch (err) {
            console.error('Failed to join:', err);
        } finally {
            setLoading(false);
        }
    }

    function handleLeave() {
        leaveSession();
        signalR.disconnect();    // SignalR cleanup 
        if (role === 'viewer') {
            navigate('/session/rating');
        } else {
            navigate(-1);
        }
    }

    function handleToggleMute() {
        if (localStream) {
            localStream.getAudioTracks().forEach(t => { t.enabled = isMuted; });
            setIsMuted(!isMuted);
        }
    }

    function handleToggleVideo() {
        if (localStream) {
            localStream.getVideoTracks().forEach(t => { t.enabled = isVideoOff; });
            setIsVideoOff(!isVideoOff);
        } else {
            produceMedia();
            setIsVideoOff(false);
        }
    }

    async function handleShareScreen() {
        if (isSharing) {
            stopScreen();
            setIsSharing(false);
        } else {
            await produceScreen(() => setIsSharing(false));
            setIsSharing(true);
        }
    }

    function formatDuration(seconds: number) {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    // ─── Identify streams by role + source ───────────────────────────────────
    // HOST sees: viewer's camera as main, own camera as PiP
    // VIEWER sees: host's camera OR screen share as main, own camera as PiP

    const hostCameraStream = remoteStreams.find(
        s => s.role === 'host' && s.source === 'camera'
    )?.stream ?? null;

    const hostScreenStream = remoteStreams.find(
        s => s.source === 'screen'
    )?.stream ?? null;

    const viewerCameraStream = remoteStreams.find(
        s => s.role === 'viewer' && s.source === 'camera'
    )?.stream ?? null;

    console.log('Remote streams:', remoteStreams.map(s => ({
        role: s.role,
        source: s.source,
        peerId: s.peerId,
        consumerId: s.consumerId,
    })));
    console.log('hostCameraStream:', !!hostCameraStream);
    console.log('viewerCameraStream:', !!viewerCameraStream);

    // What viewer sees in main area
    const viewerMainStream = hostScreenStream ?? hostCameraStream;
    // What viewer sees in PiP when screen sharing
    const viewerPipHostStream = hostScreenStream ? hostCameraStream : null;

    // ─── Lobby ───────────────────────────────────────────────────────────────
    if (!joined) {
        return (
            <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
                <div className="bg-[#1a1d2e] rounded-3xl p-10 flex flex-col items-center gap-6 w-full max-w-sm shadow-2xl border border-[#2a2d3e]">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="23 7 16 12 23 17 23 7" />
                            <rect x="1" y="5" width="15" height="14" rx="2" />
                        </svg>
                    </div>
                    <div className="text-center">
                        <h2 className="text-white text-xl font-semibold mb-1">
                            {role === 'host' ? 'Start Session' : 'Join Session'}
                        </h2>
                        <p className="text-[#6b7280] text-sm">
                            Session ID: <span className="text-[#9ca3af] font-mono">{sessionId}</span>
                        </p>
                        <p className="text-[#6b7280] text-sm mt-1">
                            Joining as <span className="text-blue-400 capitalize">{role}</span>
                        </p>
                    </div>
                    <button
                        onClick={handleJoin}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-all duration-200 cursor-pointer"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Connecting...
                            </span>
                        ) : role === 'host' ? 'Start Session' : 'Join Session'}
                    </button>
                </div>
            </div>
        );
    }

    // ─── Active Session ───────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#0f1117] flex flex-col overflow-hidden">

            {/* ── Top Bar ─────────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-[#1a1d2e] border border-[#2a2d3e] rounded-xl px-3 py-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-white text-xs font-medium">LIVE</span>
                    </div>
                    <div className="bg-[#1a1d2e] border border-[#2a2d3e] rounded-xl px-3 py-1.5">
                        <span className="text-[#9ca3af] text-xs font-mono">{formatDuration(sessionDuration)}</span>
                    </div>

                    {signalR.connected && (
                        <div className="bg-[#1a1d2e] border border-[#2a2d3e] rounded-xl px-3 py-1.5">
                            <span className="text-[#9ca3af] text-xs">
                                {signalR.peers.length + 1} in session
                            </span>
                        </div>
                    )}

                    {isSharing && (
                        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-xl px-3 py-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-green-400 text-xs font-medium">Sharing Screen</span>
                        </div>
                    )}
                </div>
                <div className="bg-[#1a1d2e] border border-[#2a2d3e] rounded-xl px-3 py-1.5">
                    <span className="text-blue-400 text-xs font-medium capitalize">{role}</span>
                </div>
            </div>

            {/* ── Main Video Area ──────────────────────────────────────── */}
            <div className="flex-1 relative px-4 pb-2 flex items-center justify-center">

                {/* ══ HOST VIEW ══ */}
                {role === 'host' && (
                    <div className="relative w-full max-w-6xl mx-auto" style={{ aspectRatio: '21/9' }}>

                        {/* Main: viewer's camera */}
                        {viewerCameraStream ? (
                            <VideoTile
                                stream={viewerCameraStream}
                                label="Student"
                                className="w-full h-full rounded-2xl"
                            />
                        ) : (
                            <div className="w-full h-full rounded-2xl bg-[#1a1d2e] border border-[#2a2d3e] flex flex-col items-center justify-center gap-4">
                                <div className="w-16 h-16 rounded-full border-4 border-[#2a2d3e] border-t-blue-500 animate-spin" />
                                <p className="text-[#6b7280] text-sm">Waiting for participant...</p>
                                <p className="text-[#4b5563] text-xs">Student will appear when they join</p>
                            </div>
                        )}

                        {/* PiP: host's own camera — fixed bottom right */}
                        {localStream && (
                            <div className="fixed bottom-16 right-6 w-48 h-32 shadow-2xl rounded-2xl overflow-hidden border-2 border-[#2a2d3e] z-50">
                                <VideoTile stream={localStream} muted isLocal label="You" className="w-full h-full" />
                            </div>
                        )}
                    </div>
                )}

                {/* ══ VIEWER VIEW ══ */}
                {role === 'viewer' && (
                    <div className="relative w-full max-w-6xl mx-auto" style={{ aspectRatio: '21/9' }}>

                        {/* Main: host camera or screen share */}
                        {viewerMainStream ? (
                            <VideoTile
                                stream={viewerMainStream}
                                label={hostScreenStream ? 'Screen Share' : 'Host'}
                                className="w-full h-full rounded-2xl"
                            />
                        ) : (
                            <div className="w-full h-full rounded-2xl bg-[#1a1d2e] border border-[#2a2d3e] flex flex-col items-center justify-center gap-4">
                                <div className="w-16 h-16 rounded-full border-4 border-[#2a2d3e] border-t-blue-500 animate-spin" />
                                <p className="text-[#6b7280] text-sm">Waiting for host...</p>
                            </div>
                        )}

                        {/* PiP: host camera when screen sharing — fixed bottom right */}
                        {viewerPipHostStream && (
                            <div className="fixed bottom-16 right-6 w-48 h-32 shadow-2xl rounded-2xl overflow-hidden border-2 border-[#2a2d3e] z-50">
                                <VideoTile stream={viewerPipHostStream} label="Host" className="w-full h-full" />
                            </div>
                        )}

                        {/* PiP: viewer's own camera — fixed bottom right */}
                        {!viewerPipHostStream && localStream && (
                            <div className="fixed bottom-16 right-6 w-48 h-32 shadow-2xl rounded-2xl overflow-hidden border-2 border-[#2a2d3e] z-50">
                                <VideoTile stream={localStream} muted isLocal label="You" className="w-full h-full" />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── Controls Bar ────────────────────────────────────────── */}
            <div className="px-4 py-2">
                <div className="bg-[#1a1d2e] border border-[#2a2d3e] rounded-2xl px-8 py-2 flex items-center justify-center">
                    <ControlBar
                        isMuted={isMuted}
                        isVideoOff={isVideoOff}
                        isSharing={isSharing}
                        onToggleMute={handleToggleMute}
                        onToggleVideo={handleToggleVideo}
                        onShareScreen={handleShareScreen}
                        onLeave={handleLeave}
                        isHost={role === 'host'}
                    />
                </div>
            </div>
        </div>
    );
}