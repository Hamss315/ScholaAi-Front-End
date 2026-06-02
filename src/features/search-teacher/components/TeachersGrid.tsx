import TeacherCard from "./TeacherCard";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import type { Teacher } from "../types/teacher.types";

interface Props {
  teachers: Teacher[];
  searchQuery: string;
  clearFilters: () => void;
}

export default function TeachersGrid({
  teachers,
  searchQuery,
  clearFilters,
}: Props) {
  return (
    <>
      {/* RESULTS HEADER (Figma exact) */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing{" "}
          <span className="font-semibold">{teachers.length}</span>{" "}
          teacher{teachers.length !== 1 ? "s" : ""}
          {searchQuery && (
            <span> matching "{searchQuery}"</span>
          )}
        </p>
      </div>

      {/* EMPTY STATE */}
      {teachers.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>

          <h3 className="text-2xl mb-2" style={{ color: "#1E3A8A" }}>
            No teachers found
          </h3>

          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or filters
          </p>

          <Button onClick={clearFilters}>
            Clear Filters
          </Button>
        </Card>
      ) : (
        /* GRID */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <TeacherCard
              key={teacher.userName}
              teacher={teacher}
            />
          ))}
        </div>
      )}
    </>
  );
}