import { useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from "lucide-react";
import { Card } from "../../../../components/ui/card";
import { Avatar, AvatarFallback } from "../../../../components/ui/avatar";
import { Slider } from "../../../../components/ui/slider";
import { sessionData, formatTime } from "../../data/recordData";

export default function RecordVideo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(14); // % through the video
  const [volume, setVolume] = useState(80);

  const currentSeconds = Math.round((progress / 100) * sessionData.totalSeconds);

  const handleProgressChange = (val: number[]) => setProgress(val[0]);
  const handleVolumeChange = (val: number[]) => {
    setVolume(val[0]);
    setIsMuted(val[0] === 0);
  };
  const skip = (delta: number) => {
    setProgress((p) => Math.min(100, Math.max(0, p + (delta / sessionData.totalSeconds) * 100)));
  };

  return (
    <Card className="overflow-hidden mb-6">
      {/* Video area */}
      <div
        className="relative bg-gray-900 flex items-center justify-center"
        style={{ aspectRatio: "16/9" }}
      >
        {/* Split-view mock: student left, teacher right */}
        <div className="absolute inset-0 flex">
          {/* Student feed */}
          <div className="flex-1 flex flex-col items-center justify-center border-r border-gray-700 bg-gray-800">
            <Avatar className="w-20 h-20 mb-3">
              <AvatarFallback className="bg-[#3B82F6] text-white text-2xl">
                {sessionData.studentInitials}
              </AvatarFallback>
            </Avatar>
            <span className="text-white text-sm opacity-75">{sessionData.studentName}</span>
            <span className="text-gray-400 text-xs mt-1">Student</span>
          </div>
          {/* Teacher feed */}
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-800">
            <Avatar className="w-20 h-20 mb-3">
              <AvatarFallback className="bg-[#8B5CF6] text-white text-2xl">
                {sessionData.teacherInitials}
              </AvatarFallback>
            </Avatar>
            <span className="text-white text-sm opacity-75">{sessionData.teacherName}</span>
            <span className="text-gray-400 text-xs mt-1">Teacher</span>
          </div>
        </div>

        {/* Paused overlay */}
        {!isPlaying && (
          <button
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
            onClick={() => setIsPlaying(true)}
          >
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Play className="w-7 h-7 ml-1" style={{ color: '#1E3A8A' }} />
            </div>
          </button>
        )}

        {/* Playing overlay — click to pause */}
        {isPlaying && (
          <button
            className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/20 transition-opacity"
            onClick={() => setIsPlaying(false)}
          >
            <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center shadow-lg">
              <Pause className="w-7 h-7" style={{ color: '#1E3A8A' }} />
            </div>
          </button>
        )}

        {/* Timestamp badge */}
        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {formatTime(currentSeconds)} / {formatTime(sessionData.totalSeconds)}
        </div>
      </div>

      {/* Controls bar */}
      <div className="bg-gray-900 px-4 py-3 space-y-2">
        {/* Progress slider */}
        <Slider
          value={[progress]}
          onValueChange={handleProgressChange}
          max={100}
          step={0.1}
          className="w-full [&_[data-slot=slider-track]]:bg-gray-600 [&_[data-slot=slider-range]]:bg-[#3B82F6]"
        />

        {/* Bottom controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              className="text-gray-300 hover:text-white transition-colors p-1"
              onClick={() => skip(-10)}
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              className="w-9 h-9 rounded-full bg-[#3B82F6] hover:bg-[#3B82F6]/80 flex items-center justify-center transition-colors"
              onClick={() => setIsPlaying((p) => !p)}
            >
              {isPlaying
                ? <Pause className="w-4 h-4 text-white" />
                : <Play className="w-4 h-4 text-white ml-0.5" />}
            </button>
            <button
              className="text-gray-300 hover:text-white transition-colors p-1"
              onClick={() => skip(10)}
            >
              <SkipForward className="w-4 h-4" />
            </button>
            <span className="text-gray-400 text-xs ml-2">
              {formatTime(currentSeconds)} / {formatTime(sessionData.totalSeconds)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Volume */}
            <div className="flex items-center gap-2">
              <button
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMuted((m) => !m)}
              >
                {isMuted || volume === 0
                  ? <VolumeX className="w-4 h-4" />
                  : <Volume2 className="w-4 h-4" />}
              </button>
              <Slider
                value={[isMuted ? 0 : volume]}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className="w-20 [&_[data-slot=slider-track]]:bg-gray-600 [&_[data-slot=slider-range]]:bg-gray-300"
              />
            </div>
            <button className="text-gray-300 hover:text-white transition-colors p-1">
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
