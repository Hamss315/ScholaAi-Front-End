import { useState } from "react";
import { Brain, Star, LogOut, MessageSquare, ChevronRight } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { setRating } from "../../../utils/ratingService";
import { useNavigate } from "react-router-dom";

// Mock: session that just ended
const SESSION_ID = 1;
const TEACHER = { name: "Dr. Sarah Johnson", initials: "SJ", subject: "Mathematics" };
const SESSION_DATE = "Nov 5, 2025";

const PROMPTS: Record<number, string> = {
  1: "What went wrong?",
  2: "What could be improved?",
  3: "How was the session?",
  4: "What did you enjoy?",
  5: "What made it great?",
};

export default function SessionRatingPage() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const displayed = hovered || selected;

  const handleSubmit = () => {
    if (selected === 0) return;
    setRating({
      sessionId: SESSION_ID,
      teacherName: TEACHER.name,
      stars: selected,
      comment: "",
      date: SESSION_DATE,
      studentName: "John Smith",
      studentInitials: "JS",
    });
    setSubmitted(true);
    setTimeout(() => navigate("/session-analysis"), 900);
  };

  const handleSkip = () => {
    navigate("/session-analysis");
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
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
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
              <p className="text-gray-500">Taking you to the session analysis…</p>
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
                    {TEACHER.initials}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold mb-1" style={{ color: '#1E3A8A' }}>{TEACHER.name}</h2>
                <p className="text-gray-500">{TEACHER.subject} · {SESSION_DATE}</p>
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
              <p className="text-center text-sm font-medium mb-8" style={{ color: displayed ? '#3B82F6' : '#9CA3AF', minHeight: '1.25rem' }}>
                {displayed ? PROMPTS[displayed] : "Tap a star to rate"}
              </p>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <Button
                  className="w-full flex items-center justify-center gap-2 cursor-pointer py-6 rounded-2xl font-semibold shadow-md transition-all duration-200"
                  style={{ backgroundColor: selected ? '#3B82F6' : undefined }}
                  disabled={selected === 0}
                  onClick={handleSubmit}
                >
                  Submit Rating
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
