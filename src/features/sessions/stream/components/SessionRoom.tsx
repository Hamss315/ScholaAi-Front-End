import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { VideoTile } from './VideoTile';
import { ControlBar } from './ControlBar';
import { useSession } from '../hooks/useSession';
import { useSignalRSession } from '../hooks/useSignalRSession';
import { useRecording } from '../hooks/useRecording';
import { pendingRecordingStore } from '../lib/pendingRecordingStore';
import { endSession, uploadRecording } from '../../../../services/api/teacherSessions';

interface SessionRoomProps {
    sessionId: string;
    sessionDbId: number;
    peerId: string;
    role: 'host' | 'viewer';
    token: string;
}

export function SessionRoom({ sessionId, sessionDbId, peerId, role, token }: SessionRoomProps) {
    const navigate = useNavigate();
    const [joined, setJoined] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [sessionDuration, setSessionDuration] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [savingMessage, setSavingMessage] = useState('Saving local recording…');
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const recordingStartedRef = useRef(false);

    const signalR = useSignalRSession(sessionId, role);
    const { startRecording, stopRecording } = useRecording({ sessionDbId });

    const {
        joinSession,
        leaveSession,
        produceScreen,
        stopScreen,
        produceMedia,
        localStream,
        remoteStreams,
    } = useSession({ sessionId, peerId, role, token });

    // ── Session timer ─────────────────────────────────────────────────────────
    useEffect(() => {
        if (joined) {
            timerRef.current = setInterval(() => setSessionDuration(d => d + 1), 1000);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [joined]);

    // ── DEBUG Log state ───────────────────────────────────────────────────────
    useEffect(() => {
        console.log('[DEBUG] SessionRoom State:', {
            role,
            joined,
            hasLocalStream: !!localStream,
            recordingStarted: recordingStartedRef.current,
            sessionDbId
        });
    }, [role, joined, localStream, sessionDbId]);

    // ── Auto-start recording (host only) when localStream becomes available ───
    useEffect(() => {
        if (role !== 'host') return;
        if (!joined || !localStream) return;
        if (recordingStartedRef.current) return;

        recordingStartedRef.current = true;
        console.log(`[SessionRoom] 🎞 Starting recording for sessionDbId=${sessionDbId}`);
        startRecording(localStream);
    }, [role, joined, localStream, startRecording, sessionDbId]);

    // ── Join ──────────────────────────────────────────────────────────────────
    async function handleJoin() {
        setLoading(true);
        try {
            await Promise.all([
                joinSession(),
                signalR.connect(),
            ]);
            setJoined(true);
        } catch (err) {
            console.error('Failed to join:', err);
        } finally {
            setLoading(false);
        }
    }

    // ── Leave — just disconnect, keep session active in DB ───────────────────
    const handleLeave = useCallback(async () => {
        if (role === 'host') {
            setIsSaving(true);
            setSavingMessage('Saving local recording…');
            try {
                console.log(`[SessionRoom] ⏹ Stopping recording for sessionDbId=${sessionDbId}`);
                await stopRecording();
                console.log('[SessionRoom] ✅ Recording saved to pendingRecordingStore');
            } catch (err) {
                console.error('[SessionRoom] Error stopping recording:', err);
            } finally {
                setIsSaving(false);
            }
        }

        leaveSession();
        signalR.disconnect();
        navigate(-1);
    }, [role, sessionDbId, stopRecording, leaveSession, signalR, navigate]);

    // ── End Session — stop recording, upload it, and end the session in DB ────
    const handleEndSession = useCallback(async () => {
        if (role !== 'host') return;
        setIsSaving(true);
        setSavingMessage('Ending Session & Uploading recording...');
        try {
            console.log(`[SessionRoom] ⏹ Stopping recording for end of sessionDbId=${sessionDbId}`);
            await stopRecording();

            const pending = pendingRecordingStore.get();
            if (pending && pending.sessionDbId === sessionDbId) {
                console.log(`[SessionRoom] ⬆️ Uploading recording...`);
                await uploadRecording(sessionDbId, pending.blob, pending.durationSeconds);
                pendingRecordingStore.clear();
                console.log('[SessionRoom] ✅ Recording uploaded successfully');
            } else {
                console.warn('[SessionRoom] ⚠️ No active recording found to upload (it might be empty or not started)');
            }
        } catch (err) {
            console.error('[SessionRoom] Error during recording stop/upload:', err);
        }

        try {
            console.log(`[SessionRoom] 🏁 Marking session as ended in DB`);
            await endSession(sessionDbId);
            console.log('[SessionRoom] ✅ Session ended successfully');
        } catch (err) {
            console.error('[SessionRoom] Error ending session:', err);
        } finally {
            setIsSaving(false);
            leaveSession();
            signalR.disconnect();
            navigate('/teacher/dashboard', { replace: true });
        }
    }, [role, sessionDbId, stopRecording, leaveSession, signalR, navigate]);

    // ── Media controls ────────────────────────────────────────────────────────
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

    // ── Stream identification ─────────────────────────────────────────────────
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
        role: s.role, source: s.source, peerId: s.peerId, consumerId: s.consumerId,
    })));

    const viewerMainStream = hostScreenStream ?? hostCameraStream;
    const viewerPipHostStream = hostScreenStream ? hostCameraStream : null;

    // ── Saving overlay (brief — only while MediaRecorder finalises) ───────────
    if (isSaving) {
        return (
            <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
                <div className="bg-[#1a1d2e] rounded-3xl p-10 flex flex-col items-center gap-6 w-full max-w-sm shadow-2xl border border-[#2a2d3e]">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <svg className="animate-spin w-8 h-8 text-blue-400" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    </div>
                    <div className="text-center">
                        <h2 className="text-white text-xl font-semibold mb-1">Processing</h2>
                        <p className="text-[#6b7280] text-sm">{savingMessage}</p>
                    </div>
                </div>
            </div>
        );
    }

    // ── Lobby ─────────────────────────────────────────────────────────────────
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

    // ── Active Session ────────────────────────────────────────────────────────
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

                    {/* Recording badge — host only */}
                    {role === 'host' && (
                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-1.5">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-red-400 text-xs font-medium">REC</span>
                        </div>
                    )}

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
                        {viewerCameraStream ? (
                            <VideoTile stream={viewerCameraStream} label="Student" className="w-full h-full rounded-2xl" />
                        ) : (
                            <div className="w-full h-full rounded-2xl bg-[#1a1d2e] border border-[#2a2d3e] flex flex-col items-center justify-center gap-4">
                                <div className="w-16 h-16 rounded-full border-4 border-[#2a2d3e] border-t-blue-500 animate-spin" />
                                <p className="text-[#6b7280] text-sm">Waiting for participant...</p>
                                <p className="text-[#4b5563] text-xs">Student will appear when they join</p>
                            </div>
                        )}
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
                        {viewerMainStream ? (
                            <VideoTile stream={viewerMainStream} label={hostScreenStream ? 'Screen Share' : 'Host'} className="w-full h-full rounded-2xl" />
                        ) : (
                            <div className="w-full h-full rounded-2xl bg-[#1a1d2e] border border-[#2a2d3e] flex flex-col items-center justify-center gap-4">
                                <div className="w-16 h-16 rounded-full border-4 border-[#2a2d3e] border-t-blue-500 animate-spin" />
                                <p className="text-[#6b7280] text-sm">Waiting for host...</p>
                            </div>
                        )}
                        {viewerPipHostStream && (
                            <div className="fixed bottom-16 right-6 w-48 h-32 shadow-2xl rounded-2xl overflow-hidden border-2 border-[#2a2d3e] z-50">
                                <VideoTile stream={viewerPipHostStream} label="Host" className="w-full h-full" />
                            </div>
                        )}
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
                        onEnd={handleEndSession}
                        isHost={role === 'host'}
                    />
                </div>
            </div>
        </div>
    );
}