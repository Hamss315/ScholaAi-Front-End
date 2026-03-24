// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { VideoTile } from './VideoTile';
// import { ControlBar } from './ControlBar';
// import { useSession } from '../hooks/useSession';

// interface SessionRoomProps {
//     sessionId: string;
//     peerId: string;
//     role: 'host' | 'viewer';
//     token: string;
// }

// export function SessionRoom({ sessionId, peerId, role, token }: SessionRoomProps) {
//     const navigate = useNavigate();
//     const [joined, setJoined] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [isMuted, setIsMuted] = useState(false);
//     const [isVideoOff, setIsVideoOff] = useState(false);
//     const [sessionDuration, setSessionDuration] = useState(0);

//     const {
//         joinSession,
//         leaveSession,
//         produceScreen,
//         localStream,
//         remoteStreams,
//     } = useSession({ sessionId, peerId, role, token });

//     // Timer
//     useState(() => {
//         if (!joined) return;
//         const interval = setInterval(() => setSessionDuration(d => d + 1), 1000);
//         return () => clearInterval(interval);
//     });

//     async function handleJoin() {
//         setLoading(true);
//         try {
//             await joinSession();
//             setJoined(true);
//         } catch (err) {
//             console.error('Failed to join:', err);
//         } finally {
//             setLoading(false);
//         }
//     }

//     function handleLeave() {
//         leaveSession();
//         navigate(-1);
//     }

//     function handleToggleMute() {
//         if (localStream) {
//             const audioTracks = localStream.getAudioTracks();
//             audioTracks.forEach(track => {
//                 track.enabled = isMuted;
//             });
//             setIsMuted(!isMuted);
//         }
//     }

//     function handleToggleVideo() {
//         if (localStream) {
//             const videoTracks = localStream.getVideoTracks();
//             videoTracks.forEach(track => {
//                 track.enabled = isVideoOff;
//             });
//             setIsVideoOff(!isVideoOff);
//         }
//     }

//     function formatDuration(seconds: number) {
//         const m = Math.floor(seconds / 60).toString().padStart(2, '0');
//         const s = (seconds % 60).toString().padStart(2, '0');
//         return `${m}:${s}`;
//     }

//     // ─── Lobby (before joining) ──────────────────────────────────────────────

//     if (!joined) {
//         return (
//             <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
//                 <div className="bg-[#1a1d2e] rounded-3xl p-10 flex flex-col items-center gap-6 w-full max-w-sm shadow-2xl border border-[#2a2d3e]">
//                     {/* Session icon */}
//                     <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
//                         <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                             <polygon points="23 7 16 12 23 17 23 7"/>
//                             <rect x="1" y="5" width="15" height="14" rx="2"/>
//                         </svg>
//                     </div>

//                     <div className="text-center">
//                         <h2 className="text-white text-xl font-semibold mb-1">
//                             {role === 'host' ? 'Start Session' : 'Join Session'}
//                         </h2>
//                         <p className="text-[#6b7280] text-sm">
//                             Session ID: <span className="text-[#9ca3af] font-mono">{sessionId}</span>
//                         </p>
//                         <p className="text-[#6b7280] text-sm mt-1">
//                             Joining as <span className="text-blue-400 capitalize">{role}</span>
//                         </p>
//                     </div>

//                     <button
//                         onClick={handleJoin}
//                         disabled={loading}
//                         className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed
//                             text-white font-medium py-3 rounded-xl transition-all duration-200 cursor-pointer"
//                     >
//                         {loading ? (
//                             <span className="flex items-center justify-center gap-2">
//                                 <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
//                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
//                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
//                                 </svg>
//                                 Connecting...
//                             </span>
//                         ) : role === 'host' ? 'Start Session' : 'Join Session'}
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     // ─── Active Session ──────────────────────────────────────────────────────

//     const remoteStreamList = Array.from(remoteStreams.entries());
//     const mainStream = remoteStreamList.length > 0 ? remoteStreamList[0][1] : null;

//     return (
//         <div className="min-h-screen bg-[#0f1117] flex flex-col overflow-hidden font-sans">

//             {/* ── Top Bar ───────────────────────────────────────────────── */}
//             <div className="flex items-center justify-between px-6 py-4">
//                 <div className="flex items-center gap-3">
//                     {/* Live indicator */}
//                     <div className="flex items-center gap-2 bg-[#1a1d2e] border border-[#2a2d3e] rounded-xl px-3 py-1.5">
//                         <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/>
//                         <span className="text-white text-xs font-medium">LIVE</span>
//                     </div>
//                     {/* Timer */}
//                     <div className="bg-[#1a1d2e] border border-[#2a2d3e] rounded-xl px-3 py-1.5">
//                         <span className="text-[#9ca3af] text-xs font-mono">{formatDuration(sessionDuration)}</span>
//                     </div>
//                 </div>

//                 {/* Role badge */}
//                 <div className="bg-[#1a1d2e] border border-[#2a2d3e] rounded-xl px-3 py-1.5">
//                     <span className="text-blue-400 text-xs font-medium capitalize">{role}</span>
//                 </div>
//             </div>

//             {/* ── Main Video Area ───────────────────────────────────────── */}
//             <div className="flex-1 relative px-4 pb-2">

//                 {/* Remote / Main video */}
//                 {mainStream ? (
//                     <VideoTile
//                         stream={mainStream}
//                         label="Remote"
//                         className="w-full h-full rounded-2xl"
//                     />
//                 ) : (
//                     <div className="w-full h-full rounded-2xl bg-[#1a1d2e] border border-[#2a2d3e] flex flex-col items-center justify-center gap-4">
//                         <div className="w-16 h-16 rounded-full border-4 border-[#2a2d3e] border-t-blue-500 animate-spin"/>
//                         <p className="text-[#6b7280] text-sm">
//                             {role === 'host' ? 'Waiting for participants...' : 'Waiting for the other participant...'}
//                         </p>
//                     </div>
//                 )}

//                 {/* Local video — picture-in-picture bottom right */}
//                 {localStream && (
//                     <div className="absolute bottom-4 right-6 w-44 h-28 shadow-2xl rounded-2xl overflow-hidden border-2 border-[#2a2d3e]">
//                         <VideoTile
//                             stream={localStream}
//                             muted
//                             isLocal
//                             className="w-full h-full"
//                         />
//                     </div>
//                 )}
//             </div>

//             {/* ── Controls Bar ─────────────────────────────────────────── */}
//             <div className="px-4 py-5">
//                 <div className="bg-[#1a1d2e] border border-[#2a2d3e] rounded-2xl px-8 py-4 flex items-center justify-center">
//                     <ControlBar
//                         isMuted={isMuted}
//                         isVideoOff={isVideoOff}
//                         onToggleMute={handleToggleMute}
//                         onToggleVideo={handleToggleVideo}
//                         onShareScreen={produceScreen}
//                         onLeave={handleLeave}
//                         isHost={role === 'host'}
//                     />
//                 </div>
//             </div>

//         </div>
//     );
// }
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { VideoTile } from './VideoTile';
import { ControlBar } from './ControlBar';
import { useSession } from '../hooks/useSession';

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

    const { joinSession, leaveSession, produceScreen, stopScreen, produceMedia, localStream, remoteStreams } =
        useSession({ sessionId, peerId, role, token });

    useEffect(() => {
        if (joined) {
            timerRef.current = setInterval(() => setSessionDuration(d => d + 1), 1000);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [joined]);

    async function handleJoin() {
        setLoading(true);
        try {
            await joinSession();
            setJoined(true);
        } catch (err) {
            console.error('Failed to join:', err);
        } finally {
            setLoading(false);
        }
    }

    function handleLeave() {
        leaveSession();
        navigate(-1);
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
            await produceScreen(() => setIsSharing(false));  // ← callback for browser stop button
            setIsSharing(true);
        }
    }

    function formatDuration(seconds: number) {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    // Identify remote streams by source
    const remoteCamera = remoteStreams.find(s => s.source === 'camera')?.stream ?? null;
    const remoteScreen = remoteStreams.find(s => s.source === 'screen')?.stream ?? null;

    // HOST: main = viewer camera, PiP = own camera
    // VIEWER: main = screen share OR host camera (constrained size), PiP = own camera
    const viewerMainStream = remoteScreen ?? remoteCamera;
    const viewerPipStream = remoteScreen ? remoteCamera : null;

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
                        {remoteCamera ? (
                            <VideoTile
                                stream={remoteCamera}
                                label="Student"
                                className="w-full h-full rounded-2xl"
                            />
                        ) : (
                            <div className="w-full h-full rounded-2xl bg-[#1a1d2e] border border-[#2a2d3e] flex flex-col items-center justify-center gap-4">
                                <div className="w-16 h-16 rounded-full border-4 border-[#2a2d3e] border-t-blue-500 animate-spin" />
                                <p className="text-[#6b7280] text-sm">Waiting for participant...</p>
                                <p className="text-[#4b5563] text-xs">Ask the viewer to turn on their camera</p>
                            </div>
                        )}
                        {/* PiP: host's own camera — fixed to screen corner */}
                        {localStream && (
                            <div className="fixed bottom-28 right-6 w-48 h-32 shadow-2xl rounded-2xl overflow-hidden border-2 border-[#2a2d3e] z-50">
                                <VideoTile stream={localStream} muted isLocal label="You" className="w-full h-full" />
                            </div>
                        )}
                    </div>
                )}

                {/* ══ VIEWER VIEW ══ */}
                {role === 'viewer' && (
                    <div className="relative flex items-center justify-center w-full h-full">
                        {/* Main: host stream — constrained size, centered */}
                        <div className="relative w-full max-w-6xl mx-auto" style={{ aspectRatio: '21/9' }}>
                            {viewerMainStream ? (
                                <VideoTile
                                    stream={viewerMainStream}
                                    label={remoteScreen ? 'Screen Share' : 'Host'}
                                    className="w-full h-full rounded-2xl"
                                />
                            ) : (
                                <div className="w-full h-full rounded-2xl bg-[#1a1d2e] border border-[#2a2d3e] flex flex-col items-center justify-center gap-4">
                                    <div className="w-16 h-16 rounded-full border-4 border-[#2a2d3e] border-t-blue-500 animate-spin" />
                                    <p className="text-[#6b7280] text-sm">Waiting for host...</p>
                                </div>
                            )}

                            {/* PiP: host camera when screen sharing — fixed to screen corner */}
                            {viewerPipStream && (
                                <div className="fixed bottom-28 right-6 w-48 h-32 shadow-2xl rounded-2xl overflow-hidden border-2 border-[#2a2d3e] z-50">
                                    <VideoTile stream={viewerPipStream} label="Host" className="w-full h-full" />
                                </div>
                            )}
                            {/* PiP: viewer's own camera — fixed to screen corner */}
                            {!viewerPipStream && localStream && (
                                <div className="fixed bottom-28 right-6 w-48 h-32 shadow-2xl rounded-2xl overflow-hidden border-2 border-[#2a2d3e] z-50">
                                    <VideoTile stream={localStream} muted isLocal label="You" className="w-full h-full" />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Controls Bar ────────────────────────────────────────── */}
            <div className="px-4 py-1">
                <div className="bg-[#1a1d2e] border border-[#2a2d3e] rounded-2xl px-8 py-1 flex items-center justify-center">
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