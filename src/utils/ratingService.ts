export interface SessionRating {
  sessionId: number;
  teacherName: string;
  stars: number;
  comment: string;
  date: string;
  studentName: string;
  studentInitials: string;
}

const STORAGE_KEY = "schola_session_ratings";

const defaultRatings: SessionRating[] = [
  { sessionId: 1, teacherName: "Dr. Sarah Johnson", stars: 5, comment: "", date: "Nov 5, 2025", studentName: "John Smith", studentInitials: "JS" },
  { sessionId: 2, teacherName: "Prof. Michael Chen", stars: 4, comment: "", date: "Oct 30, 2025", studentName: "John Smith", studentInitials: "JS" },
  { sessionId: 3, teacherName: "Ms. Emily Brown", stars: 5, comment: "", date: "Oct 25, 2025", studentName: "John Smith", studentInitials: "JS" },
  { sessionId: 4, teacherName: "Dr. Sarah Johnson", stars: 4, comment: "", date: "Oct 20, 2025", studentName: "John Smith", studentInitials: "JS" },
  { sessionId: 5, teacherName: "Dr. Aisha Patel", stars: 5, comment: "", date: "Oct 15, 2025", studentName: "John Smith", studentInitials: "JS" },
  { sessionId: 6, teacherName: "Prof. Michael Chen", stars: 4, comment: "", date: "Oct 10, 2025", studentName: "John Smith", studentInitials: "JS" },
  { sessionId: 7, teacherName: "Dr. Laura Nguyen", stars: 5, comment: "", date: "Oct 5, 2025", studentName: "John Smith", studentInitials: "JS" },
  { sessionId: 8, teacherName: "Ms. Emily Brown", stars: 5, comment: "", date: "Sep 28, 2025", studentName: "John Smith", studentInitials: "JS" },
  { sessionId: 9, teacherName: "Dr. Aisha Patel", stars: 4, comment: "", date: "Sep 22, 2025", studentName: "John Smith", studentInitials: "JS" },
  { sessionId: 10, teacherName: "Dr. Sarah Johnson", stars: 5, comment: "", date: "Sep 15, 2025", studentName: "John Smith", studentInitials: "JS" },
];

function loadAll(): SessionRating[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed default ratings so sessions appear "already rated" right after the session ended
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultRatings));
      return defaultRatings;
    }
    return JSON.parse(raw) as SessionRating[];
  } catch {
    return [];
  }
}

function saveAll(ratings: SessionRating[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
}

/** Get the rating for a single session, or null if not rated. */
export function getRating(sessionId: number): SessionRating | null {
  return loadAll().find((r) => r.sessionId === sessionId) ?? null;
}

/** Get ALL ratings left for a specific teacher (used on the teacher side). */
export function getRatingsByTeacher(teacherName: string): SessionRating[] {
  return loadAll().filter((r) => r.teacherName === teacherName);
}

/** Get all ratings (for computing aggregates). */
export function getAllRatings(): SessionRating[] {
  return loadAll();
}

/** Upsert (insert or replace) a rating for a session. */
export function setRating(rating: SessionRating): void {
  const all = loadAll().filter((r) => r.sessionId !== rating.sessionId);
  saveAll([...all, rating]);
}

/** Delete the rating for a session. */
export function deleteRating(sessionId: number): void {
  saveAll(loadAll().filter((r) => r.sessionId !== sessionId));
}

/** Compute aggregate stats for a teacher. */
export function getTeacherRatingStats(teacherName: string): {
  average: number;
  total: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
} {
  const ratings = getRatingsByTeacher(teacherName);
  const total = ratings.length;
  const distribution: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  if (total === 0) {
    return { average: 0, total: 0, distribution };
  }

  let sum = 0;
  for (const r of ratings) {
    sum += r.stars;
    const key = Math.min(5, Math.max(1, r.stars)) as 1 | 2 | 3 | 4 | 5;
    distribution[key]++;
  }

  return {
    average: Math.round((sum / total) * 10) / 10,
    total,
    distribution,
  };
}
