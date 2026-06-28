import type { StudentProfileDto } from "./studentProfile.service";
import type {
  ProfileData,
  SessionStats,
  SubscriptionData,
  PaymentItem,
} from "../types/profile";

export function mapStudentProfileDto(dto: StudentProfileDto): {
  profileData: ProfileData;
  sessionStats: SessionStats;
  subscriptionData: SubscriptionData;
  paymentHistory: PaymentItem[];
} {
  return {
    profileData: {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      grade: dto.grade ? `Grade ${dto.grade}` : "",
      bio: dto.description ?? "",

      // fields that don't exist yet in backend
      gender: "",
      country: "",
      city: "",
      subjects: [],
      sessionDuration: "",
    },

    sessionStats: {
      totalSessions: dto.totalSessions,
      totalHours: dto.totalHours,
      averageFocus: dto.averageFocusScore,
      completedThisMonth: dto.sessionsThisMonth,
    },

    subscriptionData: {
      balance: dto.walletBalance ?? 0,
      lastTopUp: dto.lastTopUp ? new Date(dto.lastTopUp) : new Date(),
      status: "Active",
      currency: "EGP",
    },

    paymentHistory: (dto.paymentHistory ?? []).map((p, index) => ({
      id: p.id ?? index,
      date: p.date ?? "-",
      amount: p.amount ? `${p.amount} EGP` : "-",
      plan: "Session Package",
      status: p.status ?? "Completed",
    })),
  };
}