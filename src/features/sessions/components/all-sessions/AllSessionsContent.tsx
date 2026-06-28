import { useState, useEffect } from "react";
import {
  Video,
  Search,
  Calendar,
  Clock,
  FileText,
  Star,
  Pencil,
  Trash2,
  Check,
  X,
  Filter,
} from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../../components/ui/avatar";
import { Progress } from "../../../../components/ui/progress";
import { Input } from "../../../../components/ui/input";
import { getInitials } from "../../../../utils/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { useNavigate } from "react-router-dom";
import { focusColor, subjectColor } from "../../data/allSessionsData";
import { getStudentSessions } from "../../../../services/api/studentSessions";
import {
  createRating,
  updateRating,
  deleteRating as deleteRatingApi,
} from "../../../../services/api/rating";


// ─── Star display (read-only) ─────────────────────────────────────────────────
function StarDisplay({ stars }: { stars: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className="w-3.5 h-3.5"
          style={{
            fill: s <= stars ? "#FACC15" : "transparent",
            color: s <= stars ? "#FACC15" : "#D1D5DB",
          }}
        />
      ))}
    </div>
  );
}

// ─── Inline rating editor ─────────────────────────────────────────────────────
function InlineRatingEditor({
  currentValue,
  saving,
  onSave,
  onCancel,
}: {
  currentValue: number | null;
  saving: boolean;
  onSave: (stars: number) => void;
  onCancel: () => void;
}) {
  const [hovered, setHovered] = useState(0);
  const [stars, setStars] = useState(currentValue ?? 0);
  const displayed = hovered || stars;

  return (
    <div className="mt-3 pt-3 border-t flex flex-wrap items-center gap-4">
      <span className="text-sm text-gray-500 font-medium">Your rating:</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            className="transition-transform hover:scale-110"
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setStars(s)}
          >
            <Star
              className="w-7 h-7 transition-colors"
              style={{
                fill: s <= displayed ? "#FACC15" : "transparent",
                color: s <= displayed ? "#FACC15" : "#D1D5DB",
              }}
            />
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          disabled={stars === 0 || saving}
          className="bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white flex items-center gap-1"
          onClick={() => onSave(stars)}
        >
          <Check className="w-3.5 h-3.5" />
          {saving ? "Saving..." : "Save"}
        </Button>
        <Button
          size="sm"
          className="bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-600 flex items-center gap-1"
          onClick={onCancel}
        >
          <X className="w-3.5 h-3.5" />
          Cancel
        </Button>
      </div>
    </div>
  );
}

// ─── Main content ─────────────────────────────────────────────────────────────
interface Props {
  subjects: string[];
  onSessionsLoaded: (sessions: any[]) => void;
}

export default function AllSessionsContent({ subjects, onSessionsLoaded }: Props) {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [savingRating, setSavingRating] = useState(false);

  // Load all sessions from backend on mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getStudentSessions();
        setSessions(data);
        onSessionsLoaded(data);
      } catch (err) {
        console.error("Failed to load sessions:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Save or update a rating via the backend API
  const handleSaveRating = async (sessionId: number, ratingId: number | null, stars: number) => {
    try {
      setSavingRating(true);
      if (ratingId) {
        // Update existing rating
        await updateRating(ratingId, stars);
        setSessions((prev) =>
          prev.map((s) => (s.id === sessionId ? { ...s, ratingValue: stars } : s))
        );
      } else {
        // Create new rating
        const result = await createRating(sessionId, stars);
        const newRatingId = result?.data?.ratingId ?? result?.ratingId;
        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId ? { ...s, ratingId: newRatingId, ratingValue: stars } : s
          )
        );
      }
      setEditingId(null);
    } catch (err) {
      console.error("Failed to save rating:", err);
    } finally {
      setSavingRating(false);
    }
  };

  // Delete a rating via the backend API
  const handleDeleteRating = async (sessionId: number, ratingId: number) => {
    try {
      await deleteRatingApi(ratingId);
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId ? { ...s, ratingId: null, ratingValue: null } : s
        )
      );
      setEditingId(null);
    } catch (err) {
      console.error("Failed to delete rating:", err);
    }
  };

  const filtered = sessions.filter((s) => {
    const matchSubject =
      selectedSubject === "All Subjects" || s.subject === selectedSubject;
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
          <SelectTrigger className="w-full sm:w-[200px] bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500 animate-pulse" />
              <SelectValue placeholder="Select Subject" />
            </div>
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
      {loading ? (
        <Card className="p-12 text-center flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-[#3B82F6] animate-spin" />
          <p className="text-gray-500 text-sm">Loading sessions...</p>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <Video className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <div className="text-gray-500">No sessions match your search.</div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((session) => {
            const hasRating = session.ratingId != null && session.ratingValue != null;
            const isEditing = editingId === session.id;

            return (
              <Card key={session.id} className="p-5 hover:shadow-md transition-shadow">
                {/* Top row: avatar + info + focus */}
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12 shrink-0 mt-0.5">
                    <AvatarFallback className="bg-[#3B82F6] text-white">
                      {getInitials(session.teacher) || session.teacherInitials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="truncate text-lg" style={{ color: "#1E3A8A" }}>
                        {session.lessonTitle}
                      </span>
                      <Badge
                        className={`shrink-0 ${subjectColor(session.subject)} hover:${subjectColor(session.subject)}`}
                      >
                        {session.subject}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Avatar className="w-4 h-4">
                          <AvatarFallback className="text-[10px] bg-gray-200">
                            {getInitials(session.teacher) || session.teacherInitials}
                          </AvatarFallback>
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

                    {/* Rating row (shown when NOT editing) */}
                    {!isEditing && (
                      <div className="flex items-center gap-3">
                        {hasRating ? (
                          <>
                            <StarDisplay stars={session.ratingValue} />
                            <button
                              className="text-gray-400 hover:text-blue-500 transition-colors"
                              title="Edit rating"
                              onClick={() => setEditingId(session.id)}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              className="text-gray-400 hover:text-red-500 transition-colors"
                              title="Delete rating"
                              onClick={() => handleDeleteRating(session.id, session.ratingId)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : session.status === "ended" ? (
                          <button
                            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-yellow-500 transition-colors"
                            onClick={() => setEditingId(session.id)}
                          >
                            <Star className="w-3.5 h-3.5" />
                            Rate this session
                          </button>
                        ) : null}
                      </div>
                    )}
                  </div>

                  {/* Focus Score */}
                  {session.focusScore != null && (
                    <div className="hidden sm:flex flex-col items-center gap-1 shrink-0 w-24">
                      <div className="text-sm text-gray-500">Focus</div>
                      <div
                        className="text-xl font-medium"
                        style={{ color: focusColor(session.focusScore) }}
                      >
                        {session.focusScore}%
                      </div>
                      <Progress value={session.focusScore} className="h-1.5 w-full" />
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 mt-4 pt-3 border-t">
                  <Button
                    className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-[#3B82F6] text-[#3B82F6] hover:bg-blue-50 hover:text-[#3B82F6]"
                    disabled={!session.recordedSession}
                    onClick={() => navigate(`/session/${session.id}/record`)}
                  >
                    <Video className="w-4 h-4" />
                    Session Record
                  </Button>
                  <Button
                    className="flex-1 flex items-center justify-center gap-2 bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white"
                    disabled={!session.summary}
                    onClick={() => navigate(`/session/${session.id}/notes`)}
                  >
                    <FileText className="w-4 h-4" />
                    View Notes
                  </Button>
                </div>

                {/* Inline editor (shown when editing) */}
                {isEditing && (
                  <InlineRatingEditor
                    currentValue={session.ratingValue}
                    saving={savingRating}
                    onSave={(stars) => handleSaveRating(session.id, session.ratingId, stars)}
                    onCancel={() => setEditingId(null)}
                  />
                )}
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
