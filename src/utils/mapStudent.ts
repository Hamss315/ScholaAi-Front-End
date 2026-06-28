import type { StudentCardDto } from "../services/api/teacherProfile";
import type { Student } from "../features/my-students/types/students.types";
import { getInitials } from "./utils";


function formatNextSession(dto: StudentCardDto): string {
    if (!dto.nextSessionDate) return "Not scheduled";
    const dateStr = new Date(dto.nextSessionDate).toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
    });
    return dto.nextSessionTime ? `${dateStr}, ${dto.nextSessionTime}` : dateStr;
}

export function mapStudentCard(dto: StudentCardDto): Student {
    return {
        id: dto.studentId,
        name: dto.studentName,
        initials: getInitials(dto.studentName),
        subject: dto.subjectName,
        totalSessions: dto.totalSessions,
        totalHours: dto.totalHours,
        avgFocusScore: dto.averageFocusScore ?? null,
        lastSession: dto.lastSessionAgo,
        nextSession: formatNextSession(dto),
        profilePhotoURL: dto.profilePhotoURL,
        status: dto.isActive ? "active" : "inactive",
    };
}