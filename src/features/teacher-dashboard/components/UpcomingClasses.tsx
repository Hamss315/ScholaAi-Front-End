// import { useState, useCallback } from "react";
// import { Card } from "../../../components/ui/card";
// import { Button } from "../../../components/ui/button";
// import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
// import { Clock, Loader2 } from "lucide-react";
// import type { UpcomingClass } from "../types/dashboard.types";
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";

// interface Props {
//   upcoming: UpcomingClass[];
//   onSessionStarted?: (session: UpcomingClass) => void;
// }

// export default function UpcomingClasses({ upcoming, onSessionStarted }: Props) {
//   const navigate = useNavigate();
//   const [starting, setStarting] = useState<number | null>(null);

//   const isStartable = (scheduledAt: string) => {
//     try {
//       const sessionDate = new Date(scheduledAt);
//       const diffMinutes = (sessionDate.getTime() - Date.now()) / (1000 * 60);
//       // Enable 15 min before the session time — stays enabled with no upper limit
//       // until the teacher explicitly starts it
//       return diffMinutes <= 15;
//     } catch {
//       return false;
//     }
//   };

//   const handleStart = useCallback(async (session: UpcomingClass) => {
//     setStarting(session.id);
//     try {
//       // Notify parent to move this session from upcoming → active in state
//       onSessionStarted?.(session);

//       const teacherId = localStorage.getItem("userId");
//       const token = localStorage.getItem("token") ?? "test";
//       navigate(
//         `/session/${session.id}/stream?role=host&peerId=${teacherId}&token=${token}`
//       );
//     } finally {
//       setStarting(null);
//     }
//   }, [navigate, onSessionStarted]);

//   const formatTime = (scheduledAt: string) => {
//     try {
//       return new Date(scheduledAt).toLocaleString("en-US", {
//         month: "short",
//         day: "numeric",
//         hour: "numeric",
//         minute: "2-digit",
//         hour12: true,
//       });
//     } catch {
//       return "TBD";
//     }
//   };

//   const getCountdown = (scheduledAt: string) => {
//     try {
//       const diff = new Date(scheduledAt).getTime() - Date.now();
//       if (diff <= 0) {
//         // Session time has passed — show how late but keep button active
//         const minsPast = Math.abs(Math.floor(diff / 60000));
//         if (minsPast < 2) return "Starting now";
//         if (minsPast < 60) return `${minsPast}m overdue`;
//         const hrs = Math.floor(minsPast / 60);
//         return `${hrs}h overdue`;
//       }
//       const mins = Math.floor(diff / 60000);
//       if (mins < 60) return `in ${mins}m`;
//       const hrs = Math.floor(mins / 60);
//       const rem = mins % 60;
//       return rem > 0 ? `in ${hrs}h ${rem}m` : `in ${hrs}h`;
//     } catch {
//       return "";
//     }
//   };

//   return (
//     <Card className="p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl" style={{ color: "#1E3A8A" }}>
//           Upcoming Classes
//         </h2>
//         <Button variant="outline" asChild>
//           <Link to="/teacher/calendar">
//             <Clock className="w-4 h-4 mr-2" />
//             Set Availability
//           </Link>
//         </Button>
//       </div>

//       {upcoming.length === 0 ? (
//         <div className="text-center py-10 text-gray-400">
//           <Clock className="w-10 h-10 mx-auto mb-3 opacity-40" />
//           <p>No upcoming classes</p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {upcoming.map((session) => {
//             const startable = isStartable(session.scheduledAt);
//             const isStarting = starting === session.id;
//             return (
//               <div
//                 key={session.id}
//                 className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
//               >
//                 {/* LEFT */}
//                 <div className="flex items-center gap-4">
//                   <Avatar>
//                     <AvatarFallback className="bg-[#3B82F6] text-white">
//                       {session.studentName
//                         .split(" ")
//                         .map((n: string) => n[0])
//                         .join("")
//                         .toUpperCase()}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <div style={{ color: "#1E3A8A" }} className="font-medium">
//                       {session.studentName}
//                     </div>
//                     <div className="text-sm text-gray-600">{session.subjectName}</div>
//                   </div>
//                 </div>

//                 {/* RIGHT */}
//                 <div className="flex items-center gap-4">
//                   <div className="text-right">
//                     <div className="text-sm" style={{ color: "#3B82F6" }}>
//                       {formatTime(session.scheduledAt)}
//                     </div>
//                     <div className="flex items-center gap-1 text-xs text-gray-500 justify-end mt-0.5">
//                       <Clock className="w-3 h-3" />
//                       {getCountdown(session.scheduledAt)}
//                     </div>
//                   </div>
//                   <Button
//                     size="sm"
//                     className={
//                       startable
//                         ? "bg-[#22C55E] hover:bg-[#22C55E]/90 min-w-[70px]"
//                         : "bg-gray-200 text-gray-400 cursor-not-allowed min-w-[70px]"
//                     }
//                     disabled={!startable || isStarting}
//                     onClick={() => startable && handleStart(session)}
//                   >
//                     {isStarting ? (
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                     ) : (
//                       "Start"
//                     )}
//                   </Button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </Card>
//   );
// }
import { useState, useCallback } from "react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Clock, Loader2 } from "lucide-react";
import type { UpcomingClass } from "../types/dashboard.types";
import { Link } from "react-router-dom";
import api from "../../../services/api";
import { parseUTCDate } from "../../../utils/utils";

interface Props {
  upcoming: UpcomingClass[];
  onSessionStarted?: (session: UpcomingClass) => void;
}

export default function UpcomingClasses({ upcoming, onSessionStarted }: Props) {
  const [starting, setStarting] = useState<number | null>(null);

  const isStartable = (scheduledAt: string) => {
    try {
      const diffMinutes =
        (parseUTCDate(scheduledAt).getTime() - Date.now()) / (1000 * 60);
      // Clickable 15 min before and any time after
      return diffMinutes <= 15;
    } catch {
      return false;
    }
  };

  // ── Start: call backend, then move to active list ─────────────────────────
  const handleStart = useCallback(
    async (session: UpcomingClass) => {
      setStarting(session.id);
      try {
        const res = await api.post(`/teacherSessions/${session.requestId}/start`);
        const data = res.data;
        // Backend returns { sessionId, roomId, peerId, role }
        const realSessionId: number = data.sessionId ?? session.id;

        // Notify parent with the real sessionId so active card uses correct ID
        onSessionStarted?.({ ...session, id: realSessionId });
      } catch (err: any) {
        const errorMsg = err?.response?.data?.message || err?.message || "An unexpected error occurred.";
        alert(`Failed to start session: ${errorMsg}`);
        console.error("Start session error:", errorMsg);
      } finally {
        setStarting(null);
      }
    },
    [onSessionStarted]
  );

  const formatTime = (scheduledAt: string) => {
    try {
      return parseUTCDate(scheduledAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "TBD";
    }
  };

  const getCountdown = (scheduledAt: string) => {
    try {
      const diff = parseUTCDate(scheduledAt).getTime() - Date.now();
      if (diff <= 0) {
        const minsPast = Math.abs(Math.floor(diff / 60000));
        if (minsPast < 2) return "Starting now";
        if (minsPast < 60) return `${minsPast}m overdue`;
        return `${Math.floor(minsPast / 60)}h overdue`;
      }
      const mins = Math.floor(diff / 60000);
      if (mins < 60) return `in ${mins}m`;
      const hrs = Math.floor(mins / 60);
      const rem = mins % 60;
      return rem > 0 ? `in ${hrs}h ${rem}m` : `in ${hrs}h`;
    } catch {
      return "";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl" style={{ color: "#1E3A8A" }}>
          Upcoming Classes
        </h2>
        <Button variant="outline" asChild>
          <Link to="/teacher/calendar">
            <Clock className="w-4 h-4 mr-2" />
            Set Availability
          </Link>
        </Button>
      </div>

      {upcoming.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <Clock className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No upcoming classes</p>
        </div>
      ) : (
        <div className="space-y-4">
          {upcoming.map((session) => {
            const startable = isStartable(session.scheduledAt);
            const isStarting = starting === session.id;
            return (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {/* LEFT */}
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-[#3B82F6] text-white">
                      {session.studentName
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div style={{ color: "#1E3A8A" }} className="font-medium">
                      {session.studentName}
                    </div>
                    <div className="text-sm text-gray-600">
                      {session.subjectName}
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm" style={{ color: "#3B82F6" }}>
                      {formatTime(session.scheduledAt)}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 justify-end mt-0.5">
                      <Clock className="w-3 h-3" />
                      {getCountdown(session.scheduledAt)}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className={
                      startable
                        ? "bg-[#22C55E] hover:bg-[#22C55E]/90 min-w-[70px]"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed min-w-[70px]"
                    }
                    disabled={!startable || isStarting}
                    onClick={() => startable && handleStart(session)}
                  >
                    {isStarting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Start"
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}