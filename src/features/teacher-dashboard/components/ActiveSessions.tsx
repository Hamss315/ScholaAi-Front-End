// import { useState } from "react";
// import { Video, Square } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { Card } from "../../../components/ui/card";
// import { Button } from "../../../components/ui/button";
// import { Badge } from "../../../components/ui/badge";
// import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
// import type { ActiveSession } from "../types/dashboard.types";
// import { endSession } from "../../../services/api/teacherDashboard";

// export default function ActiveSessions({
//   sessions,
//   onSessionEnded,
// }: {
//   sessions: ActiveSession[];
//   onSessionEnded?: (sessionId: number) => void;
// }) {
//   const navigate = useNavigate();
//   const [ending, setEnding] = useState<number | null>(null);

//   if (sessions.length === 0) return null;

//   const handleJoin = (session: ActiveSession) => {
//     const teacherId = localStorage.getItem("userId");
//     const token = localStorage.getItem("token") ?? "test";
//     navigate(
//       `/session/${session.id}/stream?role=host&peerId=${teacherId}&token=${token}`
//     );
//   };

//   const handleEnd = async (session: ActiveSession) => {
//     setEnding(session.id);
//     try {
//       await endSession(session.id);
//       onSessionEnded?.(session.id);
//     } catch {
//       // error already logged in service
//     } finally {
//       setEnding(null);
//     }
//   };

//   return (
//     <Card className="p-6 border-2 border-green-300 bg-green-50/50">
//       <div className="flex items-center gap-3 mb-6">
//         <h2 className="text-2xl" style={{ color: "#1E3A8A" }}>
//           Active Sessions
//         </h2>
//         <Badge className="bg-green-100 text-green-700 animate-pulse">
//           <Video className="w-3 h-3 mr-1" />
//           Live
//         </Badge>
//       </div>

//       <div className="space-y-4">
//         {sessions.map((session) => (
//           <div
//             key={session.id}
//             className="p-4 bg-white border border-green-200 rounded-lg shadow-sm"
//           >
//             <div className="flex items-center justify-between">
//               {/* LEFT — student info */}
//               <div className="flex items-center gap-4">
//                 <Avatar>
//                   <AvatarFallback className="bg-[#22C55E] text-white">
//                     {session.studentName
//                       .split(" ")
//                       .map((n) => n[0])
//                       .join("")
//                       .toUpperCase()}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <div className="font-medium" style={{ color: "#1E3A8A" }}>
//                     {session.studentName}
//                   </div>
//                   <div className="text-sm text-gray-600">{session.subjectName}</div>
//                   {session.studentFocusScore !== undefined && (
//                     <div className="text-xs text-gray-500 mt-0.5">
//                       Student Focus:{" "}
//                       <span
//                         className={
//                           session.studentFocusScore >= 80
//                             ? "text-green-600 font-medium"
//                             : "text-yellow-600 font-medium"
//                         }
//                       >
//                         {session.studentFocusScore}%
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* RIGHT — action buttons */}
//               <div className="flex items-center gap-2">
//                 <Button
//                   size="sm"
//                   className="bg-[#22C55E] hover:bg-[#22C55E]/90 font-semibold"
//                   onClick={() => handleJoin(session)}
//                 >
//                   <Video className="w-4 h-4 mr-1" />
//                   Join
//                 </Button>
//                 <Button
//                   size="sm"
//                   variant="destructive"
//                   className="font-semibold"
//                   disabled={ending === session.id}
//                   onClick={() => handleEnd(session)}
//                 >
//                   <Square className="w-4 h-4 mr-1" />
//                   {ending === session.id ? "Ending…" : "End"}
//                 </Button>
//               </div>
//             </div>

//             {/* Focus score bar */}
//             {session.studentFocusScore !== undefined && (
//               <div className="mt-3">
//                 <div className="flex justify-between text-xs text-gray-500 mb-1">
//                   <span>AI Focus Score</span>
//                   <span
//                     style={{
//                       color:
//                         session.studentFocusScore >= 80 ? "#22C55E" : "#FACC15",
//                     }}
//                   >
//                     {session.studentFocusScore}%
//                   </span>
//                 </div>
//                 <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
//                   <div
//                     className="h-full transition-all"
//                     style={{
//                       width: `${session.studentFocusScore}%`,
//                       backgroundColor:
//                         session.studentFocusScore >= 80 ? "#22C55E" : "#FACC15",
//                     }}
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </Card>
//   );
// }
import { useState } from "react";
import { Video, Square } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import type { ActiveSession } from "../types/dashboard.types";
import api from "../../../services/api";

async function endSessionApi(sessionId: number) {
  await api.post(`/teacherSessions/${sessionId}/end`, { focusScore: 0 });
}

export default function ActiveSessions({
  sessions,
  onSessionEnded,
}: {
  sessions: ActiveSession[];
  onSessionEnded?: (sessionId: number) => void;
}) {
  const navigate = useNavigate();
  const [ending, setEnding] = useState<number | null>(null);

  if (sessions.length === 0) return null;

  // ── Join: navigate to stream, do NOT end the session ──────────────────────
  const handleJoin = (session: ActiveSession) => {
    const teacherId = localStorage.getItem("userId");
    const token = localStorage.getItem("token") ?? "test";
    navigate(
      `/session/${session.id}/stream?role=host&peerId=${teacherId}&token=${token}`
    );
  };

  // ── End: call API, then remove from dashboard ──────────────────────────────
  const handleEnd = async (session: ActiveSession) => {
    setEnding(session.id);
    try {
      await endSessionApi(session.id);
      onSessionEnded?.(session.id);
    } catch {
      // optionally show a toast here
    } finally {
      setEnding(null);
    }
  };

  return (
    <Card className="p-6 border-2 border-green-300 bg-green-50/50">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-2xl" style={{ color: "#1E3A8A" }}>
          Active Sessions
        </h2>
        <Badge className="bg-green-100 text-green-700 animate-pulse">
          <Video className="w-3 h-3 mr-1" />
          Live
        </Badge>
      </div>

      <div className="space-y-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="p-4 bg-white border border-green-200 rounded-lg shadow-sm"
          >
            <div className="flex items-center justify-between">
              {/* LEFT — student info */}
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-[#22C55E] text-white">
                    {session.studentName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium" style={{ color: "#1E3A8A" }}>
                    {session.studentName}
                  </div>
                  <div className="text-sm text-gray-600">{session.subjectName}</div>
                  {session.studentFocusScore !== undefined && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      Focus:{" "}
                      <span
                        className={
                          session.studentFocusScore >= 80
                            ? "text-green-600 font-medium"
                            : "text-yellow-600 font-medium"
                        }
                      >
                        {session.studentFocusScore}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT — Join + End */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="bg-[#22C55E] hover:bg-[#22C55E]/90 font-semibold"
                  onClick={() => handleJoin(session)}
                >
                  <Video className="w-4 h-4 mr-1" />
                  Join
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="font-semibold"
                  disabled={ending === session.id}
                  onClick={() => handleEnd(session)}
                >
                  <Square className="w-4 h-4 mr-1" />
                  {ending === session.id ? "Ending…" : "End"}
                </Button>
              </div>
            </div>

            {/* Focus bar */}
            {session.studentFocusScore !== undefined && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>AI Focus Score</span>
                  <span
                    style={{
                      color:
                        session.studentFocusScore >= 80 ? "#22C55E" : "#FACC15",
                    }}
                  >
                    {session.studentFocusScore}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${session.studentFocusScore}%`,
                      backgroundColor:
                        session.studentFocusScore >= 80 ? "#22C55E" : "#FACC15",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}