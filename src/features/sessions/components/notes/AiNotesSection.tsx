import { useState } from "react";
import { BookOpen, CheckCircle, Star, Lightbulb, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../../components/ui/avatar";
import { aiNotes } from "../../data/notesData";

export default function AiNotesSection() {
  const [expandedTopics, setExpandedTopics] = useState<Record<number, boolean>>({});
  const [expandedProblems, setExpandedProblems] = useState<Record<number, boolean>>({});

  const toggleTopic = (i: number) => setExpandedTopics((prev) => ({ ...prev, [i]: !prev[i] }));
  const toggleProblem = (i: number) => setExpandedProblems((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="space-y-6">
      {/* Key Topics */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <BookOpen className="w-5 h-5" style={{ color: '#3B82F6' }} />
          <h3 className="text-xl" style={{ color: '#1E3A8A' }}>Key Topics Covered</h3>
        </div>
        <div className="space-y-3">
          {aiNotes.keyTopics.map((topic, i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                onClick={() => toggleTopic(i)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm text-white" style={{ backgroundColor: '#3B82F6' }}>
                    {i + 1}
                  </div>
                  <span style={{ color: '#1E3A8A' }}>{topic.title}</span>
                </div>
                {expandedTopics[i] ? (
                  <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                )}
              </button>
              {expandedTopics[i] && (
                <div className="px-4 pb-4 bg-blue-50 border-t">
                  <p className="text-gray-700 leading-relaxed pt-3">{topic.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Key Takeaways */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <Star className="w-5 h-5" style={{ color: '#F59E0B' }} />
          <h3 className="text-xl" style={{ color: '#1E3A8A' }}>Key Takeaways</h3>
        </div>
        <ul className="space-y-3">
          {aiNotes.keyTakeaways.map((point, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: '#22C55E' }} />
              <span className="text-gray-700">{point}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Practice Problems */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <Lightbulb className="w-5 h-5" style={{ color: '#8B5CF6' }} />
          <h3 className="text-xl" style={{ color: '#1E3A8A' }}>Practice Problems</h3>
        </div>
        <div className="space-y-3">
          {aiNotes.practiceProblems.map((p, i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                onClick={() => toggleProblem(i)}
              >
                <div className="flex items-center gap-3">
                  <Badge className={p.solved ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-amber-100 text-amber-700 hover:bg-amber-100"}>
                    {p.solved ? "Solved" : "Needs Work"}
                  </Badge>
                  <span className="text-gray-800">{p.problem}</span>
                </div>
                {expandedProblems[i] ? (
                  <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                )}
              </button>
              {expandedProblems[i] && (
                <div className="px-4 pb-4 bg-purple-50 border-t">
                  <div className="pt-3 text-sm text-gray-500 mb-1">Solution</div>
                  <p className="text-gray-700">{p.solution}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Areas for Improvement */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <AlertCircle className="w-5 h-5" style={{ color: '#F59E0B' }} />
          <h3 className="text-xl" style={{ color: '#1E3A8A' }}>Areas for Improvement</h3>
        </div>
        <ul className="space-y-3">
          {aiNotes.areasForImprovement.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ backgroundColor: '#F59E0B' }} />
              <span className="text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Teacher Recommendations */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex items-center gap-2 mb-4">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-[#8B5CF6] text-white text-xs">SJ</AvatarFallback>
          </Avatar>
          <h3 className="text-xl" style={{ color: '#1E3A8A' }}>Teacher's Recommendations</h3>
        </div>
        <p className="text-gray-700 leading-relaxed">{aiNotes.teacherRecommendations}</p>
      </Card>
    </div>
  );
}
