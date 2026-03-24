// interface ControlBarProps {
//     isMuted: boolean;
//     isVideoOff: boolean;
//     onToggleMute: () => void;
//     onToggleVideo: () => void;
//     onShareScreen: () => void;
//     onLeave: () => void;
//     isHost: boolean;
// }

// export function ControlBar({
//     isMuted,
//     isVideoOff,
//     onToggleMute,
//     onToggleVideo,
//     onShareScreen,
//     onLeave,
//     isHost,
// }: ControlBarProps) {
//     return (
//         <div className="flex items-center justify-center gap-3">

//             {/* Mute Button */}
//             <ControlButton
//                 onClick={onToggleMute}
//                 active={!isMuted}
//                 activeClass="bg-[#2a2d3e] hover:bg-[#3a3d4e]"
//                 inactiveClass="bg-red-500/20 hover:bg-red-500/30 border border-red-500/40"
//                 label={isMuted ? 'Unmute' : 'Mute'}
//             >
//                 {isMuted ? (
//                     <MicOffIcon />
//                 ) : (
//                     <MicIcon />
//                 )}
//             </ControlButton>

//             {/* Video Button */}
//             {isHost && (
//                 <ControlButton
//                     onClick={onToggleVideo}
//                     active={!isVideoOff}
//                     activeClass="bg-[#2a2d3e] hover:bg-[#3a3d4e]"
//                     inactiveClass="bg-red-500/20 hover:bg-red-500/30 border border-red-500/40"
//                     label={isVideoOff ? 'Start Video' : 'Stop Video'}
//                 >
//                     {isVideoOff ? <VideoOffIcon /> : <VideoIcon />}
//                 </ControlButton>
//             )}

//             {/* Share Screen — host only */}
//             {isHost && (
//                 <ControlButton
//                     onClick={onShareScreen}
//                     active={true}
//                     activeClass="bg-[#2a2d3e] hover:bg-[#3a3d4e]"
//                     inactiveClass=""
//                     label="Share Screen"
//                 >
//                     <ScreenShareIcon />
//                 </ControlButton>
//             )}

//             {/* Leave Button */}
//             <ControlButton
//                 onClick={onLeave}
//                 active={false}
//                 activeClass=""
//                 inactiveClass="bg-red-500 hover:bg-red-600"
//                 label="Leave"
//             >
//                 <PhoneOffIcon />
//             </ControlButton>
//         </div>
//     );
// }

// // ─── Reusable Control Button ──────────────────────────────────────────────────

// interface ControlButtonProps {
//     onClick: () => void;
//     active: boolean;
//     activeClass: string;
//     inactiveClass: string;
//     label: string;
//     children: React.ReactNode;
// }

// function ControlButton({ onClick, active, activeClass, inactiveClass, label, children }: ControlButtonProps) {
//     return (
//         <div className="flex flex-col items-center gap-1.5">
//             <button
//                 onClick={onClick}
//                 className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer
//                     ${active ? activeClass : inactiveClass}`}
//             >
//                 {children}
//             </button>
//             <span className="text-[#6b7280] text-[10px] font-medium">{label}</span>
//         </div>
//     );
// }

// // ─── Icons ────────────────────────────────────────────────────────────────────

// function MicIcon() {
//     return (
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
//             <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
//             <line x1="12" y1="19" x2="12" y2="22"/>
//             <line x1="8" y1="22" x2="16" y2="22"/>
//         </svg>
//     );
// }

// function MicOffIcon() {
//     return (
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <line x1="1" y1="1" x2="23" y2="23"/>
//             <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V5a3 3 0 0 0-5.94-.6"/>
//             <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/>
//             <line x1="12" y1="19" x2="12" y2="22"/>
//             <line x1="8" y1="22" x2="16" y2="22"/>
//         </svg>
//     );
// }

// function VideoIcon() {
//     return (
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <polygon points="23 7 16 12 23 17 23 7"/>
//             <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
//         </svg>
//     );
// }

// function VideoOffIcon() {
//     return (
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"/>
//             <line x1="1" y1="1" x2="23" y2="23"/>
//         </svg>
//     );
// }

// function ScreenShareIcon() {
//     return (
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
//             <line x1="8" y1="21" x2="16" y2="21"/>
//             <line x1="12" y1="17" x2="12" y2="21"/>
//         </svg>
//     );
// }

// function PhoneOffIcon() {
//     return (
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07"/>
//             <path d="M14.5 9.5 9 4 4 9.5"/>
//             <line x1="1" y1="1" x2="23" y2="23"/>
//         </svg>
//     );
// }

interface ControlBarProps {
    isMuted: boolean;
    isVideoOff: boolean;
    isSharing?: boolean;
    onToggleMute: () => void;
    onToggleVideo: () => void;
    onShareScreen?: () => void;
    onLeave: () => void;
    isHost: boolean;
}

export function ControlBar({
    isMuted,
    isVideoOff,
    isSharing = false,
    onToggleMute,
    onToggleVideo,
    onShareScreen,
    onLeave,
}: ControlBarProps) {
    return (
        <div className="flex items-center justify-center gap-3">

            {/* Mute */}
            <ControlButton
                onClick={onToggleMute}
                active={!isMuted}
                activeClass="bg-[#2a2d3e] hover:bg-[#3a3d4e]"
                inactiveClass="bg-red-500/20 hover:bg-red-500/30 border border-red-500/40"
                label={isMuted ? 'Unmute' : 'Mute'}
            >
                {isMuted ? <MicOffIcon /> : <MicIcon />}
            </ControlButton>

            {/* Video — both host and viewer */}
            <ControlButton
                onClick={onToggleVideo}
                active={!isVideoOff}
                activeClass="bg-[#2a2d3e] hover:bg-[#3a3d4e]"
                inactiveClass="bg-red-500/20 hover:bg-red-500/30 border border-red-500/40"
                label={isVideoOff ? 'Start Video' : 'Stop Video'}
            >
                {isVideoOff ? <VideoOffIcon /> : <VideoIcon />}
            </ControlButton>

            {/* Share Screen — host only */}
            {onShareScreen && (
                <ControlButton
                    onClick={onShareScreen}
                    active={!isSharing}
                    activeClass="bg-[#2a2d3e] hover:bg-[#3a3d4e]"
                    inactiveClass="bg-green-500/20 hover:bg-green-500/30 border border-green-500/40"
                    label={isSharing ? 'Stop Share' : 'Share Screen'}
                >
                    <ScreenShareIcon active={isSharing} />
                </ControlButton>
            )}

            {/* Leave */}
            <ControlButton
                onClick={onLeave}
                active={false}
                activeClass=""
                inactiveClass="bg-red-500 hover:bg-red-600"
                label="Leave"
            >
                <PhoneOffIcon />
            </ControlButton>
        </div>
    );
}

// ─── Reusable Control Button ──────────────────────────────────────────────────

interface ControlButtonProps {
    onClick: () => void;
    active: boolean;
    activeClass: string;
    inactiveClass: string;
    label: string;
    children: React.ReactNode;
}

function ControlButton({ onClick, active, activeClass, inactiveClass, label, children }: ControlButtonProps) {
    return (
        <div className="flex flex-col items-center gap-1.5">
            <button
                onClick={onClick}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer
                    ${active ? activeClass : inactiveClass}`}
            >
                {children}
            </button>
            <span className="text-[#6b7280] text-[10px] font-medium">{label}</span>
        </div>
    );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function MicIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="22"/>
            <line x1="8" y1="22" x2="16" y2="22"/>
        </svg>
    );
}

function MicOffIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="1" y1="1" x2="23" y2="23"/>
            <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V5a3 3 0 0 0-5.94-.6"/>
            <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/>
            <line x1="12" y1="19" x2="12" y2="22"/>
            <line x1="8" y1="22" x2="16" y2="22"/>
        </svg>
    );
}

function VideoIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="23 7 16 12 23 17 23 7"/>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
        </svg>
    );
}

function VideoOffIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>
    );
}

function ScreenShareIcon({ active }: { active?: boolean }) {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#4ade80' : '#e2e8f0'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
    );
}

function PhoneOffIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07"/>
            <path d="M14.5 9.5 9 4 4 9.5"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>
    );
}