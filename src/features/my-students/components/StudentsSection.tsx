import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import StudentCard from "./StudentCard";
import type { Student } from "../types/students.types";

interface Props {
  title: string;
  students: Student[];
  variant: "active" | "inactive";
  onNavigate: (path: string) => void;
}

export default function StudentsSection({ title, students, variant, onNavigate }: Props) {
  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl text-[#1E3A8A]">{title}</h2>
        <Badge className="bg-gray-100 text-gray-700">
          {students.length} Students
        </Badge>
      </div>

      <div className="space-y-4">
        {students.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            variant={variant}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </Card>
  );
}