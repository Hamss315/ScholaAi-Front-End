import { useEffect, useRef } from 'react';

interface VideoTileProps {
    stream: MediaStream | null;
    muted?: boolean;
    label?: string;
    className?: string;
    isLocal?: boolean;
}

export function VideoTile({ stream, muted = false, label, className = '', isLocal = false }: VideoTileProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (video && stream) {
            // Only reassign if different to avoid re-triggering buffering
            if (video.srcObject !== stream) {
                video.srcObject = stream;
            }
            video.play().catch(() => {/* autoplay blocked - user gesture required */});
        }
    }, [stream]);

    return (
        <div className={`relative rounded-2xl overflow-hidden bg-[#1a1d2e] ${className}`}>
            {stream ? (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted={muted}
                    className={`w-full h-full object-cover ${isLocal ? 'scale-x-[-1]' : ''}`}
                />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-[#2a2d3e] flex items-center justify-center">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#4a5568" strokeWidth="2" strokeLinecap="round"/>
                            <circle cx="12" cy="7" r="4" stroke="#4a5568" strokeWidth="2"/>
                        </svg>
                    </div>
                    {label && <span className="text-[#4a5568] text-sm">{label}</span>}
                </div>
            )}

            {/* Label badge */}
            {label && stream && (
                <div className="absolute bottom-3 left-3">
                    <span className="bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-lg">
                        {label}
                    </span>
                </div>
            )}

            {/* Local indicator */}
            {isLocal && (
                <div className="absolute top-3 right-3">
                    <span className="bg-blue-500/80 backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded-md">
                        You
                    </span>
                </div>
            )}
        </div>
    );
}