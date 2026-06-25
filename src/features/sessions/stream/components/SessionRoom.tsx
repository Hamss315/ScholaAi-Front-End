import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { VideoTile } from './VideoTile';
import { ControlBar } from './ControlBar';
import { useSession } from '../hooks/useSession';
import { useSignalRSession } from '../hooks/useSignalRSession';
import { useRecording } from '../hooks/useRecording';
import { pendingRecordingStore } from '../lib/pendingRecordingStore';
import { endSession, uploadRecording } from '../../../../services/api/teacherSessions';
import { getSocket } from '../lib/socketClient';

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
    // Distraction alert received by teacher via SignalR
    const [distractionAlert, setDistractionAlert] = useState<string | null>(null);
    // Live focus score received from student via socket (teacher view only)
    const [studentFocusScore, setStudentFocusScore] = useState<number | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const recordingStartedRef = useRef(false);
    // Focus alert sound tracking
    const lastAlertTimeRef = useRef<number>(0);
    const prevFocusScoreRef = useRef<number | null>(null);
    // AudioContext must be created during a user gesture (Join click) to bypass browser autoplay policy
    const audioCtxRef = useRef<AudioContext | null>(null);

    const preCapturedScreenStreamRef = useRef<MediaStream | null>(null);

    const signalR = useSignalRSession(
        sessionId,
        role,
        // Only show distraction alerts to the teacher (host)
        role === 'host' ? (reason) => setDistractionAlert(reason) : undefined,
    );
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

    // ── Focus frame capture loop (student only) ────────────────────────────────
    useEffect(() => {
        if (role !== 'viewer' || !joined || !localStream) return;

        // Create hidden video element to feed the stream
        const video = document.createElement('video');
        video.srcObject = localStream;
        video.muted = true;
        video.playsInline = true;

        // Hidden canvas to extract frames
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        let isPlaying = false;
        video.play()
            .then(() => { isPlaying = true; })
            .catch(err => console.error('[Focus] Hidden video play failed:', err));

        const focusServerUrl = `http://${window.location.hostname}:8000`;

        const interval = setInterval(() => {
            if (!isPlaying || video.videoWidth === 0 || video.videoHeight === 0) return;

            // Resize to 640x480 for lightweight network payloads
            const width = 640;
            const height = 480;
            canvas.width = width;
            canvas.height = height;

            if (ctx) {
                ctx.drawImage(video, 0, 0, width, height);
                const base64Image = canvas.toDataURL('image/jpeg', 0.6); // 60% quality is perfect balance

                fetch(`${focusServerUrl}/focus/frame`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: base64Image }),
                }).catch(() => {
                    // Ignore silent local network errors
                });
            }
        }, 333); // ~3 FPS: lightweight, low CPU, perfect for Mediapipe

        return () => {
            clearInterval(interval);
            video.pause();
            video.srcObject = null;
        };
    }, [role, joined, localStream]);

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

    // ── Student: poll focus score every 5s and relay to teacher via socket ─────
    useEffect(() => {
        if (role !== 'viewer' || !joined) return;
        const socket = getSocket();
        const focusServerUrl = `http://${window.location.hostname}:8000`;

        const interval = setInterval(async () => {
            try {
                const res = await fetch(`${focusServerUrl}/focus/live`);
                if (res.ok) {
                    const data = await res.json();
                    socket.emit('focusUpdate', { score: data.focus_score ?? 0 });
                }
            } catch {
                // Focus server not reachable — silently ignore
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [role, joined]);

    // ── Teacher: listen for student focus score updates from socket ────────────
    useEffect(() => {
        if (role !== 'host') return;
        const socket = getSocket();

        const handleFocusUpdate = ({ score }: { score: number }) => {
            setStudentFocusScore(score);
        };

        socket.on('focusUpdate', handleFocusUpdate);
        return () => { socket.off('focusUpdate', handleFocusUpdate); };
    }, [role]);

    // ── Teacher: play beep alert when focus first drops below 50% ─────────────
    useEffect(() => {
        if (role !== 'host' || studentFocusScore === null) return;

        const prev = prevFocusScoreRef.current;
        const now = Date.now();
        const cooldownMs = 30_000; // don't beep more than once per 30 seconds

        // Only alert when crossing the threshold downward (≥50 → <50)
        if (
            studentFocusScore < 50 &&
            (prev === null || prev >= 50) &&
            now - lastAlertTimeRef.current > cooldownMs
        ) {
            lastAlertTimeRef.current = now;
            // Play alert using the pre-created AudioContext (created during Join click)
            try {
                const ctx = audioCtxRef.current;
                if (ctx) {
                    // Resume if browser suspended it (tab switch etc.) — fire and forget
                    if (ctx.state === 'suspended') void ctx.resume();
                    // Three rising beeps: 880Hz → 1100Hz → 880Hz
                    const freqs = [880, 1100, 880];
                    freqs.forEach((freq, i) => {
                        const delay = i * 0.28;
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.type = 'sine';
                        osc.frequency.value = freq;
                        gain.gain.setValueAtTime(0.4, ctx.currentTime + delay);
                        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.22);
                        osc.start(ctx.currentTime + delay);
                        osc.stop(ctx.currentTime + delay + 0.22);
                    });
                }
            } catch {
                // Audio playback failed — silently ignore
            }
        }

        prevFocusScoreRef.current = studentFocusScore;
    }, [role, studentFocusScore]);

    // ── Prevent accidental page leaves for host ────────────────────────────────
    useEffect(() => {
        if (role !== 'host' || !joined) return;

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = 'A recording is in progress. Leaving this page will discard the recording. Are you sure?';
            return e.returnValue;
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [role, joined]);

    // ── Auto-start recording (host only) when localStream becomes available ───
    useEffect(() => {
        if (role !== 'host') return;
        if (!joined || !localStream) return;
        if (recordingStartedRef.current) return;

        const activeStream = localStream; // capture to satisfy TS compiler

        async function initScreenRecording() {
            try {
                recordingStartedRef.current = true;
                let screenStream = preCapturedScreenStreamRef.current;
                
                if (screenStream) {
                    console.log(`[SessionRoom] 🖥 Publishing pre-captured screen share`);
                    await produceScreen(() => setIsSharing(false), screenStream);
                    setIsSharing(true);
                } else {
                    console.log(`[SessionRoom] 🖥 No pre-captured screen found, prompting host`);
                    screenStream = await produceScreen(() => setIsSharing(false));
                    setIsSharing(true);
                }

                // Combine screen video with microphone audio track
                const micTrack = activeStream.getAudioTracks()[0];
                const tracks = [...screenStream.getVideoTracks()];
                if (micTrack) {
                    tracks.push(micTrack);
                }

                const combinedStream = new MediaStream(tracks);
                console.log(`[SessionRoom] 🎞 Starting screen recording for sessionDbId=${sessionDbId}`);
                startRecording(combinedStream);
            } catch (err) {
                console.error('[SessionRoom] Failed to initialize screen recording:', err);
                // Fallback to camera stream if screen sharing is canceled
                console.log(`[SessionRoom] 🎞 Falling back to camera recording for sessionDbId=${sessionDbId}`);
                startRecording(activeStream);
            }
        }

        initScreenRecording();
    }, [role, joined, localStream, produceScreen, startRecording, sessionDbId]);

    // ── Join ──────────────────────────────────────────────────────────────────
    async function handleJoin() {
        setLoading(true);
        // ⚠️  Create AudioContext here — inside a real user gesture (button click).
        // Browsers block AudioContext created in async effects from socket events.
        if (role === 'host' && !audioCtxRef.current) {
            try { audioCtxRef.current = new AudioContext(); } catch { /* unsupported */ }
        }
        if (role === 'host') {
            try {
                console.log('[SessionRoom] 🖥 Prompting host for screen share (User Gesture)');
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                preCapturedScreenStreamRef.current = screenStream;
            } catch (err) {
                console.warn('[SessionRoom] Host declined screen share prompt or it failed:', err);
            }
        }

        try {
            await Promise.all([
                joinSession(),
                signalR.connect(),
            ]);
            setJoined(true);

            // Student: start focus agent — use the server's LAN IP (same host serving the app)
            if (role === 'viewer') {
                const token = localStorage.getItem('token') ?? '';
                const focusServerUrl = `http://${window.location.hostname}:8000`;
                // Pass backend_url so the Python agent reports to the correct host (LAN-safe)
                const backendUrl = `http://${window.location.hostname}:5254`;
                fetch(`${focusServerUrl}/focus/start`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        session_id: sessionDbId,
                        room_id: sessionId,   // mediasoup room ID string
                        token,
                        backend_url: backendUrl,
                    }),
                }).catch(() => {
                    // Agent not running — non-fatal, session continues without focus tracking
                    console.warn('[SessionRoom] Focus agent not available on localhost:8000');
                });
            }
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

            if (preCapturedScreenStreamRef.current) {
                preCapturedScreenStreamRef.current.getTracks().forEach(t => t.stop());
                preCapturedScreenStreamRef.current = null;
            }
        }

        // Student: stop focus agent gracefully
        if (role === 'viewer') {
            fetch(`http://${window.location.hostname}:8000/focus/stop`, { method: 'POST' }).catch(() => {});
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

        // ── Step 1: Stop recording & upload ───────────────────────────────────
        try {
            console.log(`[SessionRoom] ⏹ Stopping recording for end of sessionDbId=${sessionDbId}`);
            await stopRecording();

            const pending = pendingRecordingStore.get();
            console.log('[SessionRoom] 📦 Pending store state:', {
                hasPending: !!pending,
                pendingSessionDbId: pending?.sessionDbId,
                currentSessionDbId: sessionDbId,
                blobSize: pending?.blob?.size,
                duration: pending?.durationSeconds,
            });

            // Upload if ANY non-empty blob exists (removed sessionDbId guard that was silently skipping)
            if (pending && pending.blob && pending.blob.size > 0) {
                console.log(`[SessionRoom] ⬆️ Uploading recording (${pending.blob.size} bytes, ${pending.durationSeconds}s)...`);
                await uploadRecording(sessionDbId, pending.blob, pending.durationSeconds);
                pendingRecordingStore.clear();
                console.log('[SessionRoom] ✅ Recording uploaded successfully');
            } else {
                console.warn('[SessionRoom] ⚠️ No recording blob found — was recording started?');
            }
        } catch (err) {
            console.error('[SessionRoom] Error during recording stop/upload:', err);
        }

        // ── Step 2: Fetch real focus score from agent, then end session ────────
        let finalFocusScore = 0;
        try {
            const focusServerUrl = `http://${window.location.hostname}:8000`;
            const res = await fetch(`${focusServerUrl}/focus/stop`, { method: 'POST' });
            if (res.ok) {
                const data = await res.json();
                finalFocusScore = data.focus_score ?? 0;
                console.log(`[SessionRoom] 🧠 Final focus score from agent: ${finalFocusScore}%`);
            }
        } catch {
            console.warn('[SessionRoom] Focus agent unreachable — using score 0');
        }

        try {
            console.log(`[SessionRoom] 🏁 Marking session as ended with focusScore=${finalFocusScore}`);
            await endSession(sessionDbId, finalFocusScore);
            console.log('[SessionRoom] ✅ Session ended successfully');
        } catch (err) {
            console.error('[SessionRoom] Error ending session:', err);
        } finally {
            setIsSaving(false);
            if (preCapturedScreenStreamRef.current) {
                preCapturedScreenStreamRef.current.getTracks().forEach(t => t.stop());
                preCapturedScreenStreamRef.current = null;
            }
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

            {/* ── Distraction Alert Toast (teacher only) ───────────────── */}
            {distractionAlert && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3
                                bg-red-500/90 backdrop-blur-sm border border-red-400/50
                                text-white rounded-2xl px-5 py-3 shadow-2xl
                                animate-[slideDown_0.3s_ease-out]">
                    <span className="text-xl">⚠️</span>
                    <div>
                        <p className="font-semibold text-sm">Student is not focused</p>
                        <p className="text-red-100 text-xs opacity-90">{distractionAlert}</p>
                    </div>
                    <button
                        onClick={() => setDistractionAlert(null)}
                        className="ml-2 text-red-100 hover:text-white transition-colors text-lg leading-none"
                        aria-label="Dismiss alert"
                    >
                        ✕
                    </button>
                </div>
            )}

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

                    {/* Live focus score badge — host only, shows once student sends data */}
                    {role === 'host' && studentFocusScore !== null && (
                        <div className={`flex items-center gap-2 rounded-xl px-3 py-1.5 border transition-all ${
                            studentFocusScore < 50
                                ? 'bg-red-500/20 border-red-500/50 animate-pulse'
                                : 'bg-green-500/10 border-green-500/30'
                        }`}>
                            <span className={`text-xs font-semibold ${
                                studentFocusScore < 50 ? 'text-red-400' : 'text-green-400'
                            }`}>
                                🧠 Focus: {studentFocusScore}%
                            </span>
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

                        {/* Low focus warning overlay on student video */}
                        {studentFocusScore !== null && studentFocusScore < 50 && (
                            <div className="absolute inset-0 rounded-2xl border-4 border-red-500 pointer-events-none">
                                <div className="absolute top-3 left-1/2 -translate-x-1/2
                                                bg-red-600/90 backdrop-blur-sm text-white
                                                rounded-xl px-4 py-2 flex items-center gap-2 shadow-2xl">
                                    <span className="text-lg animate-bounce">⚠️</span>
                                    <div>
                                        <p className="font-bold text-sm">Low Focus Detected</p>
                                        <p className="text-red-200 text-xs">Student focus: {studentFocusScore}% — below 50%</p>
                                    </div>
                                </div>
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