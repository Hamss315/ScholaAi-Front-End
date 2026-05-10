import { useState, useMemo, useEffect } from "react";

import SearchHeader from "../components/SearchHeader";
import SearchPageHeader from "../components/SearchPageHeader";
import SearchBar from "../components/SearchBar";
import TeachersGrid from "../components/TeachersGrid";

import { searchTeachers } from "../../../services/api/searchTeachers";
import type { Teacher } from "../types/teacher.types";

export default function SearchTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch from backend whenever search query changes
  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await searchTeachers(searchQuery || undefined, undefined, undefined);
      setTeachers(Array.isArray(data) ? data : []);
      setLoading(false);
    })();
  }, [searchQuery]);

  // Client-side filter on top of what the server returned
  const filteredTeachers = useMemo(() => {
    if (!searchQuery) return teachers;
    const q = searchQuery.toLowerCase();
    return teachers.filter(
      (t) =>
        t.userName?.toLowerCase().includes(q) ||
        t.subject?.toLowerCase().includes(q) ||
        t.college?.toLowerCase().includes(q) ||
        t.teachingExperience?.toLowerCase().includes(q)
    );
  }, [teachers, searchQuery]);

  const clearFilters = () => {
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <SearchHeader />

      <div className="container mx-auto px-4 py-8 max-w-7xl">

        <SearchPageHeader teachersCount={teachers.length} />

        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        {loading ? (
          <div className="text-center py-12 text-gray-500">Searching teachers...</div>
        ) : (
          <TeachersGrid
            teachers={filteredTeachers}
            searchQuery={searchQuery}
            clearFilters={clearFilters}
          />
        )}
      </div>
    </div>
  );
}