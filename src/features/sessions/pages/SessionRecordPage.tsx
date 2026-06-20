import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  Calendar,
  Clock,
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
  FileText,
} from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Slider } from "../../../components/ui/slider";
import { getSessionById } from "../../../services/api/studentSessions";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function SessionRecordPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Video controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getSessionById(Number(sessionId));
        setSession(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load session");
      } finally {
        setLoading(false);
      }
    }
    if (sessionId) load();
  }, [sessionId]);

  // Sync video element with state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.duration > 0) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };
    const onLoadedMetadata = () => setDuration(video.duration);
    const onEnded = () => setIsPlaying(false);

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("ended", onEnded);
    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("ended", onEnded);
    };
  }, [session]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (val: number[]) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    const newTime = (val[0] / 100) * duration;
    video.currentTime = newTime;
    setProgress(val[0]);
  };

  const handleVolumeChange = (val: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    setVolume(val[0]);
    video.volume = val[0] / 100;
    setIsMuted(val[0] === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    video.muted = newMuted;
  };

  const skip = (delta: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(duration, Math.max(0, video.currentTime + delta));
  };

  const handleFullscreen = () => {
    videoRef.current?.requestFullscreen();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-[#3B82F6] animate-spin" />
          <p className="text-gray-500 text-sm">Loading recording...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <p className="text-red-500 mb-4">{error || "Session not found"}</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </Card>
      </div>
    );
  }

  const sessionDate = session.startedAt
    ? new Date(session.startedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";

  const durationMin = session.recordingDuration > 0
    ? `${Math.floor(session.recordingDuration / 3600)}h ${Math.floor((session.recordingDuration % 3600) / 60)}m`
    : "";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 max-w-5xl flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold" style={{ color: "#1E3A8A" }}>
            Session Recording
          </h2>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-3xl" style={{ color: "#1E3A8A" }}>
              {session.lessonTitle || "Session Recording"}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
            {session.subject && (
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                <BookOpen className="w-3 h-3 mr-1" />{session.subject}
              </Badge>
            )}
            {sessionDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />{sessionDate}
              </span>
            )}
            {durationMin && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />{durationMin}
              </span>
            )}
          </div>
        </div>

        {/* Video Player */}
        <Card className="overflow-hidden mb-6">
          <div className="relative bg-gray-900" style={{ aspectRatio: "16/9" }}>
            {session.recordedSession ? (
              <>
                <video
                  ref={videoRef}
                  src={session.recordedSession}
                  className="w-full h-full object-contain"
                  onClick={togglePlay}
                />
                {/* Play overlay when paused */}
                {!isPlaying && (
                  <button
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
                    onClick={togglePlay}
                  >
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                      <Play className="w-7 h-7 ml-1" style={{ color: "#1E3A8A" }} />
                    </div>
                  </button>
                )}
                {/* Timestamp badge */}
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                <Play className="w-16 h-16 mb-3 opacity-30" />
                <p>No recording available</p>
              </div>
            )}
          </div>

          {/* Controls bar */}
          {session.recordedSession && (
            <div className="bg-gray-900 px-4 py-3 space-y-2">
              <Slider
                value={[progress]}
                onValueChange={handleProgressChange}
                max={100}
                step={0.1}
                className="w-full [&_[data-slot=slider-track]]:bg-gray-600 [&_[data-slot=slider-range]]:bg-[#3B82F6]"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="text-gray-300 hover:text-white transition-colors p-1" onClick={() => skip(-10)}>
                    <SkipBack className="w-4 h-4" />
                  </button>
                  <button
                    className="w-9 h-9 rounded-full bg-[#3B82F6] hover:bg-[#3B82F6]/80 flex items-center justify-center transition-colors"
                    onClick={togglePlay}
                  >
                    {isPlaying
                      ? <Pause className="w-4 h-4 text-white" />
                      : <Play className="w-4 h-4 text-white ml-0.5" />}
                  </button>
                  <button className="text-gray-300 hover:text-white transition-colors p-1" onClick={() => skip(10)}>
                    <SkipForward className="w-4 h-4" />
                  </button>
                  <span className="text-gray-400 text-xs ml-2">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <button className="text-gray-300 hover:text-white transition-colors" onClick={toggleMute}>
                      {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      onValueChange={handleVolumeChange}
                      max={100}
                      step={1}
                      className="w-20 [&_[data-slot=slider-track]]:bg-gray-600 [&_[data-slot=slider-range]]:bg-gray-300"
                    />
                  </div>
                  <button className="text-gray-300 hover:text-white transition-colors p-1" onClick={handleFullscreen}>
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Participants */}
        <Card className="p-5 mb-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">PARTICIPANTS</h3>
          <div className="flex gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center text-white font-semibold text-sm">
                {session.studentName?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "S"}
              </div>
              <div>
                <div style={{ color: "#1E3A8A" }}>{session.studentName || "Student"}</div>
                <div className="text-xs text-gray-400">Student</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white font-semibold text-sm">
                {session.teacherName?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "T"}
              </div>
              <div>
                <div style={{ color: "#1E3A8A" }}>{session.teacherName || "Teacher"}</div>
                <div className="text-xs text-gray-400">Teacher</div>
              </div>
            </div>
          </div>
        </Card>

        {/* CTA */}
        {session.summary && (
          <Card className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold" style={{ color: "#1E3A8A" }}>AI-Generated Notes Available</h3>
              <p className="text-sm text-gray-500">View the AI summary for this session.</p>
            </div>
            <Button
              className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white flex items-center gap-2"
              onClick={() => navigate(`/session/${sessionId}/notes`)}
            >
              <FileText className="w-4 h-4" />
              View Notes
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
