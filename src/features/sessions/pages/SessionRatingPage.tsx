import { useState, useEffect } from "react";
import { Brain, Star, LogOut, MessageSquare, ChevronRight } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { createRating } from "../../../services/api/rating";
import { getSessionById } from "../../../services/api/studentSessions";
import { getInitials } from "../../../utils/utils";
import { useNavigate, useParams } from "react-router-dom";

const PROMPTS: Record<number, string> = {
  1: "What went wrong?",
  2: "What could be improved?",
  3: "How was the session?",
  4: "What did you enjoy?",
  5: "What made it great?",
};

export default function SessionRatingPage() {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const sessionDbId = parseInt(sessionId ?? "0", 10);

  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [comment, setComment] = useState("");

  const [sessionInfo, setSessionInfo] = useState<{
    teacherName: string;
    subject: string;
    date: string;
  }>({
    teacherName: "Your Teacher",
    subject: "Session",
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  });

  // Load real session info
  useEffect(() => {
    if (!sessionDbId) return;
    (async () => {
      try {
        const res = await getSessionById(sessionDbId);
        // Support both { data: {...} } and direct object shapes
        const s = res?.data ?? res;
        if (!s) return;
        const teacherName = s.teacherName ?? s.teacher ?? "Your Teacher";
        const subject = s.subject ?? "Session";
        const rawDate = s.startedAt ?? s.scheduledAt ?? s.date;
        const date = rawDate
          ? new Date(rawDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
          : new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

        setSessionInfo({ teacherName, subject, date });
      } catch {
        // non-fatal — use defaults
      }
    })();
  }, [sessionDbId]);

  const displayed = hovered || selected;

  const handleSubmit = async () => {
    if (selected === 0 || submitting) return;
    setSubmitting(true);
    try {
      if (sessionDbId) {
        await createRating(sessionDbId, selected, comment);
      }
      setSubmitted(true);
      setTimeout(() => navigate("/student/sessions"), 1200);
    } catch {
      // Still mark as submitted locally even if API fails
      setSubmitted(true);
      setTimeout(() => navigate("/student/sessions"), 1200);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    navigate("/student/sessions");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8" style={{ color: '#8B5CF6' }} />
              <span className="text-2xl font-bold" style={{ color: '#1E3A8A' }}>ScholaAi</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => navigate("/student/sessions")}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Centered card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {submitted ? (
            /* Success state */
            <Card className="p-10 text-center shadow-xl border border-gray-100 rounded-3xl bg-white">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#1E3A8A' }}>Thanks for your feedback!</h2>
              <p className="text-gray-500">Taking you to your sessions…</p>
            </Card>
          ) : (
            <Card className="p-8 shadow-xl border border-gray-100 rounded-3xl bg-white">
              {/* Session ended badge */}
              <div className="flex justify-center mb-6">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                  Session Ended
                </span>
              </div>

              {/* Teacher info */}
              <div className="flex flex-col items-center mb-8">
                <Avatar className="w-20 h-20 mb-3 shadow-md">
                  <AvatarFallback className="bg-[#8B5CF6] text-white text-2xl font-bold">
                    {getInitials(sessionInfo.teacherName)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold mb-1" style={{ color: '#1E3A8A' }}>{sessionInfo.teacherName}</h2>
                <p className="text-gray-500">{sessionInfo.subject} · {sessionInfo.date}</p>
              </div>

              {/* Question */}
              <h3 className="text-center text-lg font-semibold mb-6" style={{ color: '#1E3A8A' }}>
                How would you rate this session?
              </h3>

              {/* Stars */}
              <div className="flex justify-center gap-3 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className="transition-transform hover:scale-110 focus:outline-none"
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setSelected(star)}
                  >
                    <Star
                      className="w-10 h-10 transition-colors duration-150"
                      style={{
                        fill: star <= displayed ? '#FACC15' : 'transparent',
                        color: star <= displayed ? '#FACC15' : '#D1D5DB',
                      }}
                    />
                  </button>
                ))}
              </div>

              {/* Dynamic label */}
              <p className="text-center text-sm font-medium mb-4" style={{ color: displayed ? '#3B82F6' : '#9CA3AF', minHeight: '1.25rem' }}>
                {displayed ? PROMPTS[displayed] : "Tap a star to rate"}
              </p>

              {/* Optional comment */}
              {selected > 0 && (
                <textarea
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  rows={3}
                  placeholder="Leave a comment (optional)…"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              )}

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <Button
                  className="w-full flex items-center justify-center gap-2 cursor-pointer py-6 rounded-2xl font-semibold shadow-md transition-all duration-200"
                  style={{ backgroundColor: selected ? '#3B82F6' : undefined }}
                  disabled={selected === 0 || submitting}
                  onClick={handleSubmit}
                >
                  {submitting ? "Submitting…" : "Submit Rating"}
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-gray-400 hover:text-gray-600 flex items-center justify-center gap-2 py-6 rounded-2xl cursor-pointer"
                  onClick={handleSkip}
                >
                  Skip for now
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
