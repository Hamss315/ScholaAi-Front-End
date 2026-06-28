import { useState, useEffect } from "react";
import { Calendar, Clock, BookOpen, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";

import { createSessionRequest } from "../services/session.service";
import { getPublicSubjects, type SubjectDto } from "../../../services/api/admin";

export default function RequestSessionForm() {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState<SubjectDto[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);

  const [subjectId, setSubjectId] = useState<number | "">("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch subjects from backend on mount
  useEffect(() => {
    getPublicSubjects()
      .then((res) => setSubjects(res.data ?? []))
      .catch(() => setSubjects([]))
      .finally(() => setSubjectsLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!subjectId || !date || !time) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setIsLoading(true);

      const preferredDate = new Date(`${date}T${time}`).toISOString();

      await createSessionRequest({
        subjectId: subjectId as number,
        preferredDate,
        description: notes,
      });

      setSuccess("Session request sent successfully!");

      setTimeout(() => {
        navigate("/student/profile");
      }, 1500);
    } catch (err: any) {
      console.error("API Error:", err?.response?.data || err?.message);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create session request."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-8">
      {error && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <span>✕</span> {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <span>✓</span> {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Subject */}
        <div>
          <Label>Subject *</Label>
          <div className="relative mt-1">
            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={subjectId}
              onChange={(e) =>
                setSubjectId(e.target.value ? Number(e.target.value) : "")
              }
              className="w-full pl-10 pr-3 py-2 border rounded-lg"
              required
              disabled={subjectsLoading}
            >
              <option value="">
                {subjectsLoading ? "Loading subjects..." : "Select subject"}
              </option>
              {subjects.map((s) => (
                <option key={s.subjectId} value={s.subjectId}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date */}
        <div>
          <Label>Date *</Label>
          <div className="relative mt-1">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="date"
              className="pl-10"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Time */}
        <div>
          <Label>Time *</Label>
          <div className="relative mt-1">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="time"
              className="pl-10"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <Label>Additional Notes</Label>
          <Textarea
            className="mt-1"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any details you want the teacher to know..."
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/student/profile")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[#1E3A8A]"
            disabled={isLoading || subjectsLoading}
          >
            <Send className="w-4 h-4 mr-2" />
            {isLoading ? "Sending..." : "Send Request"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
