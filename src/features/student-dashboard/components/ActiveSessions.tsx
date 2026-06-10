// import { Card } from "../../../components/ui/card";
// import { Button } from "../../../components/ui/button";
// import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
// import { Badge } from "../../../components/ui/badge";
// import { Video } from "lucide-react";
// import type { ActiveSession } from "../types/dashboard.types";
// import { useNavigate } from "react-router-dom";

// export default function StudentActiveSessions({
//   sessions,
// }: {
//   sessions: ActiveSession[];
// }) {
//   const navigate = useNavigate();

//   if (sessions.length === 0) return null;

//   const handleJoin = (session: ActiveSession) => {
//     const studentId = localStorage.getItem("userId");
//     const token = localStorage.getItem("token") ?? "test";
//     navigate(
//       `/session/${session.id}/stream?role=guest&peerId=${studentId}&token=${token}`
//     );
//   };

//   return (
//     <Card className="p-6 border-2 border-green-300 bg-green-50/50">
//       <div className="flex items-center gap-3 mb-6">
//         <h2 className="text-2xl text-[#1E3A8A]">Active Sessions</h2>
//         <Badge className="bg-green-100 text-green-700 animate-pulse">
//           <Video className="w-3 h-3 mr-1" />
//           Live
//         </Badge>
//       </div>

//       <div className="space-y-4">
//         {sessions.map((s) => (
//           <div
//             key={s.id}
//             className="flex items-center justify-between p-4 bg-white border border-green-200 rounded-lg shadow-sm"
//           >
//             {/* LEFT */}
//             <div className="flex items-center gap-4">
//               <Avatar>
//                 <AvatarFallback className="bg-[#22C55E] text-white">
//                   {s.teacherName
//                     .split(" ")
//                     .map((n) => n[0])
//                     .join("")
//                     .toUpperCase()}
//                 </AvatarFallback>
//               </Avatar>
//               <div>
//                 <div className="text-[#1E3A8A] font-medium">{s.teacherName}</div>
//                 <div className="text-sm text-gray-600">{s.subjectName}</div>
//                 {s.focusScore !== undefined && (
//                   <div className="text-xs text-gray-500 mt-0.5">
//                     Focus:{" "}
//                     <span
//                       className={
//                         s.focusScore >= 80 ? "text-green-600 font-medium" : "text-yellow-600 font-medium"
//                       }
//                     >
//                       {s.focusScore}%
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* RIGHT */}
//             <Button
//               size="sm"
//               className="bg-[#22C55E] hover:bg-[#22C55E]/90 font-semibold shadow"
//               onClick={() => handleJoin(s)}
//             >
//               <Video className="w-4 h-4 mr-1" />
//               Join Now
//             </Button>
//           </div>
//         ))}
//       </div>
//     </Card>
//   );
// }
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";
import { Video } from "lucide-react";
import type { ActiveSession } from "../types/dashboard.types";
import { useNavigate } from "react-router-dom";

export default function StudentActiveSessions({
  sessions,
}: {
  sessions: ActiveSession[];
}) {
  const navigate = useNavigate();

  if (sessions.length === 0) return null;

  const handleJoin = (session: ActiveSession) => {
    console.log("session object:", session);
    console.log("session.id:", session.id);

    const studentId = localStorage.getItem("userId");
    const token = localStorage.getItem("token") ?? "test";

    navigate(
      `/session/${session.id}/stream?role=guest&peerId=${studentId}&token=${token}`
    );
  };

  return (
    // ── Same width as UpcomingSessions / RecentSessions (col-span-2 column) ──
    <Card className="p-6 border-2 border-green-300 bg-green-50/50">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-2xl text-[#1E3A8A]">Active Sessions</h2>
        <Badge className="bg-green-100 text-green-700 animate-pulse">
          <Video className="w-3 h-3 mr-1" />
          Live
        </Badge>
      </div>

      <div className="space-y-3">
        {sessions.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between p-4 bg-white border border-green-200 rounded-lg shadow-sm"
          >
            {/* LEFT */}
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-[#22C55E] text-white">
                  {s.teacherName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-[#1E3A8A] font-medium">{s.teacherName}</div>
                <div className="text-sm text-gray-600">{s.subjectName}</div>
                {s.focusScore !== undefined && (
                  <div className="text-xs text-gray-500 mt-0.5">
                    Focus:{" "}
                    <span
                      className={
                        s.focusScore >= 80
                          ? "text-green-600 font-medium"
                          : "text-yellow-600 font-medium"
                      }
                    >
                      {s.focusScore}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT — Join only */}
            <Button
              size="sm"
              className="bg-[#22C55E] hover:bg-[#22C55E]/90 font-semibold"
              onClick={() => handleJoin(s)}
            >
              <Video className="w-4 h-4 mr-1" />
              Join
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}