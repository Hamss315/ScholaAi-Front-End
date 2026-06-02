import { useState } from "react";
import { Video, Search, Calendar, Clock, FileText } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../../components/ui/avatar";
import { Progress } from "../../../../components/ui/progress";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { useNavigate } from "react-router-dom";
import { allSessions, subjects, focusColor, subjectColor } from "../../data/allSessionsData";

export default function AllSessionsContent() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");

  const filtered = allSessions.filter((s) => {
    const matchSubject = selectedSubject === "All Subjects" || s.subject === selectedSubject;
    const matchSearch =
      s.lessonTitle.toLowerCase().includes(search.toLowerCase()) ||
      s.teacher.toLowerCase().includes(search.toLowerCase()) ||
      s.subject.toLowerCase().includes(search.toLowerCase());
    return matchSubject && matchSearch;
  });

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search sessions, teachers, or subjects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by Subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sessions List */}
      {filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <Video className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <div className="text-gray-500">No sessions match your search.</div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((session) => (
            <Card key={session.id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                {/* Teacher Avatar */}
                <Avatar className="w-12 h-12 shrink-0">
                  <AvatarFallback className="bg-[#3B82F6] text-white">
                    {session.teacherInitials}
                  </AvatarFallback>
                </Avatar>

                {/* Session Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="truncate text-lg" style={{ color: '#1E3A8A' }}>
                      {session.lessonTitle}
                    </span>
                    <Badge className={`shrink-0 ${subjectColor(session.subject)} hover:${subjectColor(session.subject)}`}>
                      {session.subject}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Avatar className="w-4 h-4">
                        <AvatarFallback className="text-[10px] bg-gray-200">{session.teacherInitials}</AvatarFallback>
                      </Avatar>
                      {session.teacher}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {session.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {session.duration}
                    </span>
                  </div>
                </div>

                {/* Focus Score */}
                <div className="hidden sm:flex flex-col items-center gap-1 shrink-0 w-24">
                  <div className="text-sm text-gray-500">Focus</div>
                  <div className="text-xl font-medium" style={{ color: focusColor(session.focusScore) }}>
                    {session.focusScore}%
                  </div>
                  <Progress value={session.focusScore} className="h-1.5 w-full" />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                  <Button
                    size="sm"
                    className="flex items-center gap-1.5 bg-white border border-[#3B82F6] text-[#3B82F6] hover:bg-blue-50 hover:text-[#3B82F6]"
                    onClick={() => navigate("/session/record")}
                  >
                    <Video className="w-3.5 h-3.5" />
                    Session Record
                  </Button>
                  <Button
                    size="sm"
                    className="flex items-center gap-1.5 bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white"
                    onClick={() => navigate("/session/notes")}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    View Notes
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
