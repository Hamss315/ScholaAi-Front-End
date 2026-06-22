import { Card } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { TEACHER_SUBJECTS } from "../../onboarding/constants/onboarding.constants";
import { BookOpen, Tag, User } from "lucide-react";

interface FiltersPanelProps {
  name: string;
  setName: (name: string) => void;
  selectedSubject: string;
  setSelectedSubject: (subject: string) => void;
  keyword: string;
  setKeyword: (keyword: string) => void;
  clearFilters: () => void;
}

export default function FiltersPanel({
  name,
  setName,
  selectedSubject,
  setSelectedSubject,
  keyword,
  setKeyword,
  clearFilters,
}: FiltersPanelProps) {
  return (
    <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-200">
      {/* GRID ROW */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* TEACHER NAME */}
        <Card className="p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-5 h-5 text-blue-500" />
            <Label className="text-sm font-semibold text-gray-700">
              Teacher Name
            </Label>
          </div>

          <Input
            placeholder="Enter teacher's name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white border-gray-200 hover:border-gray-300 focus:border-blue-500 transition-colors"
          />
        </Card>

        {/* SUBJECT */}
        <Card className="p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-green-500" />
            <Label className="text-sm font-semibold text-gray-700">
              Subject
            </Label>
          </div>

          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-full bg-white border-gray-200 hover:border-gray-300 transition-colors">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>

            <SelectContent className="max-h-[250px] overflow-y-auto">
              <SelectItem value="all">All Subjects</SelectItem>
              {TEACHER_SUBJECTS.map((s: string) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>

        {/* KEYWORD */}
        <Card className="p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-5 h-5 text-purple-500" />
            <Label className="text-sm font-semibold text-gray-700">
              Keyword
            </Label>
          </div>

          <Input
            placeholder="Search by bio, college, or experience..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full bg-white border-gray-200 hover:border-gray-300 focus:border-blue-500 transition-colors"
          />
        </Card>

      </div>

      {/* CLEAR BUTTON */}
      <div className="mt-4">
        <Button
          variant="outline"
          className="w-full border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>

    </div>
  );
}