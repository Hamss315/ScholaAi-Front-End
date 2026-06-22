import { useState, useEffect } from "react";
import { getSubjects } from "../services/api/admin";
import type { SubjectDto } from "../services/api/admin";

// Module-level cache so we only fetch once per page session
let cachedSubjects: SubjectDto[] | null = null;

interface UseSubjectsResult {
  subjects: SubjectDto[];
  subjectNames: string[];
  /** Map from subject name → subjectId, for onboarding submission */
  subjectIdMap: Record<string, number>;
  loading: boolean;
  error: string | null;
}

export function useSubjects(): UseSubjectsResult {
  const [subjects, setSubjects] = useState<SubjectDto[]>(cachedSubjects ?? []);
  const [loading, setLoading] = useState<boolean>(cachedSubjects === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedSubjects !== null) {
      setSubjects(cachedSubjects);
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await getSubjects();
        if (!cancelled) {
          cachedSubjects = res.data ?? [];
          setSubjects(cachedSubjects);
          setLoading(false);
        }
      } catch (err: any) {
        if (!cancelled) {
          console.error("Failed to load subjects:", err);
          setError("Failed to load subjects");
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const subjectNames = subjects.map((s) => s.name);
  const subjectIdMap = subjects.reduce<Record<string, number>>((acc, s) => {
    acc[s.name] = s.subjectId;
    return acc;
  }, {});

  return { subjects, subjectNames, subjectIdMap, loading, error };
}
