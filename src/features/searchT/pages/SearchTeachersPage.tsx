import { useState, useMemo, useEffect } from "react";

import SearchHeader from "../components/SearchHeader";
import SearchPageHeader from "../components/SearchPageHeader";
import SearchBar from "../components/SearchBar";
import FiltersPanel from "../components/FiltersPanel";
import TeachersGrid from "../components/TeachersGrid";

import { getTeachers } from "../services/teacher.service";
import type { Teacher } from "../types/teacher.types";

export default function SearchTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [minRating, setMinRating] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const [availabilityFilters, setAvailabilityFilters] = useState({
    morning: false,
    afternoon: false,
    evening: false,
    night: false,
  });

  useEffect(() => {
    (async () => {
      const data = await getTeachers();
      setTeachers(data);
      setLoading(false);
    })();
  }, []);

  const allSubjects = useMemo(() => {
    return Array.from(new Set(teachers.flatMap(t => t.subjects))).sort();
  }, [teachers]);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        t.bio.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedSubject !== "all" && !t.subjects.includes(selectedSubject)) return false;

      if (priceRange === "low" && t.hourlyRate > 40) return false;
      if (priceRange === "medium" && (t.hourlyRate < 41 || t.hourlyRate > 50)) return false;
      if (priceRange === "high" && t.hourlyRate < 51) return false;

      if (minRating === "4.5" && t.rating < 4.5) return false;
      if (minRating === "4.7" && t.rating < 4.7) return false;
      if (minRating === "4.9" && t.rating < 4.9) return false;

      const hasFilter = Object.values(availabilityFilters).some(Boolean);

      if (hasFilter) {
        return (
          (availabilityFilters.morning && t.availability.includes("Morning")) ||
          (availabilityFilters.afternoon && t.availability.includes("Afternoon")) ||
          (availabilityFilters.evening && t.availability.includes("Evening")) ||
          (availabilityFilters.night && t.availability.includes("Night"))
        );
      }

      return true;
    });
  }, [teachers, searchQuery, selectedSubject, priceRange, minRating, availabilityFilters]);

  const clearFilters = () => {
    setSelectedSubject("all");
    setPriceRange("all");
    setMinRating("all");
    setAvailabilityFilters({
      morning: false,
      afternoon: false,
      evening: false,
      night: false,
    });
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

        {showFilters && (
          <FiltersPanel
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            minRating={minRating}
            setMinRating={setMinRating}
            availabilityFilters={availabilityFilters}
            setAvailabilityFilters={setAvailabilityFilters}
            allSubjects={allSubjects}
            clearFilters={clearFilters}
          />
        )}

        <TeachersGrid
          teachers={filteredTeachers}
          searchQuery={searchQuery}
          clearFilters={clearFilters}
        />
      </div>
    </div>
  );
}