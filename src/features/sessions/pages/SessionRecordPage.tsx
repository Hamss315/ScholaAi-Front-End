import { BookOpen, GraduationCap, Calendar, Clock } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { sessionData } from "../data/recordData";
import RecordHeader from "../components/record/RecordHeader";
import RecordVideo from "../components/record/RecordVideo";
import RecordParticipants from "../components/record/RecordParticipants";
import RecordCTA from "../components/record/RecordCTA";

export default function SessionRecordPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <RecordHeader />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-3xl" style={{ color: '#1E3A8A' }}>{sessionData.lessonTitle}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
              <BookOpen className="w-3 h-3 mr-1" />{sessionData.subject}
            </Badge>
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
              <GraduationCap className="w-3 h-3 mr-1" />{sessionData.studentLevel}
            </Badge>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />{sessionData.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />{sessionData.duration}
            </span>
          </div>
        </div>

        <RecordVideo />
        <RecordParticipants />
        <RecordCTA />
      </div>
    </div>
  );
}
