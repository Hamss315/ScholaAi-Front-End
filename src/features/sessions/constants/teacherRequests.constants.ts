import type { SessionRequest } from "../types/session.types";

export const TEACHER_DEMO_REQUESTS: SessionRequest[] = [
  {
    id: 1,
    studentName: "Emily Parker",
    studentInitials: "EP",
    subject: "Mathematics",
    preferredDate: "Nov 8, 2025",
    preferredTime: "2:00 PM",
    duration: "1 hour",
    notes:
      "I need help with quadratic equations and solving word problems. Would love to review chapter 5.",
    requestedDate: "Nov 1, 2025",
    status: "pending",
  },
  {
    id: 2,
    studentName: "James Wilson",
    studentInitials: "JW",
    subject: "Mathematics",
    preferredDate: "Nov 10, 2025",
    preferredTime: "10:00 AM",
    duration: "1.5 hours",
    notes:
      "Preparing for upcoming exam. Need comprehensive review of algebra and trigonometry.",
    requestedDate: "Nov 2, 2025",
    status: "pending",
  },
  {
    id: 3,
    studentName: "Sarah Martinez",
    studentInitials: "SM",
    subject: "Mathematics",
    preferredDate: "Nov 6, 2025",
    preferredTime: "3:30 PM",
    duration: "1 hour",
    notes: "Working on calculus derivatives. Having trouble with chain rule applications.",
    requestedDate: "Oct 30, 2025",
    status: "accepted",
  },
  {
    id: 4,
    studentName: "David Lee",
    studentInitials: "DL",
    subject: "Mathematics",
    preferredDate: "Nov 5, 2025",
    preferredTime: "11:00 AM",
    duration: "2 hours",
    notes: "Need help with statistics and probability. Preparing for a project.",
    requestedDate: "Oct 28, 2025",
    status: "declined",
  },
];
