import { useState } from "react";
import { Calendar, Clock, BookOpen, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";

const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "History",
  "Computer Science",
  "Economics",
];

export default function RequestSessionForm() {
  const navigate = useNavigate();

  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("1");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    alert(
      `Session request sent!\n\nSubject: ${subject}\nDate: ${date}\nTime: ${time}`
    );

    navigate("/student/profile");
  };

  return (
    <Card className="p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Subject */}
        <div>
          <Label>Subject *</Label>
          <div className="relative mt-1">
            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border rounded-lg"
              required
            >
              <option value="">Select subject</option>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
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

        {/* Duration */}
        <div>
          <Label>Duration *</Label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-lg"
          >
            <option value="0.5">30 minutes</option>
            <option value="1">1 hour</option>
            <option value="1.5">1.5 hours</option>
            <option value="2">2 hours</option>
          </select>
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
          <Button type="button" variant="outline" onClick={() => navigate("/student/profile")}>
            Cancel
          </Button>
          <Button type="submit" className="bg-[#1E3A8A]">
            <Send className="w-4 h-4 mr-2" />
            Send Request
          </Button>
        </div>
      </form>
    </Card>
  );
}
