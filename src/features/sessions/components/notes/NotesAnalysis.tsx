import { Brain, BookOpen, Calendar, Lightbulb, SmilePlus, Meh, Frown, GraduationCap, TrendingUp, FileText } from "lucide-react";
import { Card } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../../components/ui/avatar";
import { Progress } from "../../../../components/ui/progress";
import { sessionData } from "../../data/notesData";

export default function NotesAnalysis() {
  return (
    <>
      {/* ── SECTION 1: SESSION ANALYSIS ─────────────────────────── */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5" style={{ color: '#3B82F6' }} />
          <h2 className="text-2xl" style={{ color: '#1E3A8A' }}>Session Analysis</h2>
        </div>
      </div>

      {/* Session Info */}
      <Card className="p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-600 mb-1">Lesson Title</div>
            <div className="text-xl mb-4" style={{ color: '#1E3A8A' }}>{sessionData.lessonTitle}</div>
            <div className="text-sm text-gray-600 mb-1">Lesson Description</div>
            <div className="text-gray-700">{sessionData.lessonDescription}</div>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Subject</div>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                  <BookOpen className="w-3 h-3 mr-1" />{sessionData.subject}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Student Level</div>
                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                  <GraduationCap className="w-3 h-3 mr-1" />{sessionData.studentLevel}
                </Badge>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Teacher</div>
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-[#8B5CF6] text-white">SJ</AvatarFallback>
                </Avatar>
                <span className="text-gray-700">{sessionData.teacherName}</span>
              </div>
            </div>
            <div className="flex gap-4 text-sm text-gray-600">
              <span><Calendar className="w-4 h-4 inline mr-1" />{sessionData.sessionDate}</span>
              <span className="font-medium">{sessionData.sessionDuration}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mx-auto mb-3">
            <Lightbulb className="w-6 h-6" style={{ color: '#22C55E' }} />
          </div>
          <div className="text-3xl mb-1" style={{ color: '#1E3A8A' }}>{sessionData.stats.explainedTopics}</div>
          <div className="text-sm text-gray-600">Topics Explained</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mx-auto mb-3">
            <SmilePlus className="w-6 h-6" style={{ color: '#3B82F6' }} />
          </div>
          <div className="text-3xl mb-1" style={{ color: '#22C55E' }}>{sessionData.expressions.positive}%</div>
          <div className="text-sm text-gray-600">Positive Expression</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mx-auto mb-3">
            <TrendingUp className="w-6 h-6" style={{ color: '#8B5CF6' }} />
          </div>
          <div className="text-3xl mb-1" style={{ color: '#22C55E' }}>{sessionData.focusScore}%</div>
          <div className="text-sm text-gray-600">Focus Score</div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Emotional Expressions */}
        <Card className="p-6">
          <h3 className="text-xl mb-4" style={{ color: '#1E3A8A' }}>Emotional Expressions</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2"><SmilePlus className="w-5 h-5 text-green-600" /><span>Positive</span></div>
                <span style={{ color: '#22C55E' }}>{sessionData.expressions.positive}%</span>
              </div>
              <Progress value={sessionData.expressions.positive} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2"><Meh className="w-5 h-5 text-gray-500" /><span>Neutral</span></div>
                <span className="text-gray-500">{sessionData.expressions.neutral}%</span>
              </div>
              <Progress value={sessionData.expressions.neutral} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2"><Frown className="w-5 h-5 text-red-500" /><span>Negative</span></div>
                <span className="text-red-500">{sessionData.expressions.negative}%</span>
              </div>
              <Progress value={sessionData.expressions.negative} className="h-2" />
            </div>
          </div>
        </Card>

        {/* Talking Time */}
        <Card className="p-6">
          <h3 className="text-xl mb-4" style={{ color: '#1E3A8A' }}>Talking Time Distribution</h3>
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#3B82F6]" />
                  <span>Student</span>
                </div>
                <span className="text-2xl" style={{ color: '#3B82F6' }}>{sessionData.talkingTime.student}%</span>
              </div>
              <Progress value={sessionData.talkingTime.student} className="h-3" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#8B5CF6]" />
                  <span>Teacher</span>
                </div>
                <span className="text-2xl" style={{ color: '#8B5CF6' }}>{sessionData.talkingTime.teacher}%</span>
              </div>
              <Progress value={sessionData.talkingTime.teacher} className="h-3" />
            </div>
          </div>
        </Card>
      </div>

      {/* AI Session Summary */}
      <Card className="p-6 mb-10">
        <h3 className="text-xl mb-4" style={{ color: '#1E3A8A' }}>
          <Brain className="w-5 h-5 inline mr-2" style={{ color: '#8B5CF6' }} />
          AI-Generated Session Summary
        </h3>
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg">
          <p className="text-gray-700 leading-relaxed">{sessionData.summary}</p>
        </div>
      </Card>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-gray-200" />
        <div className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] rounded-full">
          <FileText className="w-4 h-4 text-white" />
          <span className="text-white text-sm">AI-Generated Notes</span>
        </div>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
    </>
  );
}
