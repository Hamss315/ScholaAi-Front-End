import { useState, useEffect } from "react";

import SearchHeader from "../components/SearchHeader";
import SearchPageHeader from "../components/SearchPageHeader";
import SearchBar from "../components/SearchBar";
import FiltersPanel from "../components/FiltersPanel";
import TeachersGrid from "../components/TeachersGrid";

import { searchTeachers } from "../../../services/api/searchTeachers";
import { useSubjects } from "../../../hooks/useSubjects";
import type { Teacher } from "../types/teacher.types";

export default function SearchTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [subject, setSubject] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { subjectNames } = useSubjects();

  // Fetch from backend whenever name, subject, or keyword changes
  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const data = await searchTeachers(
        name || undefined,
        subject === "all" || !subject ? undefined : subject,
        keyword || undefined
      );
      if (active) {
        setTeachers(Array.isArray(data) ? data : []);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [name, subject, keyword]);

  const clearFilters = () => {
    setName("");
    setSubject("all");
    setKeyword("");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      <SearchHeader />

      <div className="container mx-auto px-4 py-8 max-w-7xl">

        <SearchPageHeader teachersCount={teachers.length} />

        <SearchBar
          searchQuery={name}
          setSearchQuery={setName}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        {showFilters && (
          <FiltersPanel
            name={name}
            setName={setName}
            selectedSubject={subject}
            setSelectedSubject={setSubject}
            keyword={keyword}
            setKeyword={setKeyword}
            clearFilters={clearFilters}
            subjects={subjectNames}
          />
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Searching teachers...</div>
        ) : (
          <TeachersGrid
            teachers={teachers}
            searchQuery={name}
            clearFilters={clearFilters}
          />
        )}
      </div>
    </div>
  );
}