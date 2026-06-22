export interface TeacherProfile {
  id: string;
  fullName: string;
  role: "teacher" | "student" | "admin";
  availability?: Record<string, string[]>;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: "student" | "teacher" | "admin";
  joinedDate?: string;
  status?: "Active" | "Suspended";
  sessionsCompleted?: number;
  walletBalance?: number;
  sessionsTaught?: number;
  rating?: number;
  suspensionDuration?: string;
  suspensionReason?: string;
  location?: string;
  bio?: string;
  subjects?: string[];
  phone?: string;
}

const STORAGE_KEY = "scholaai_mock_users";

const defaultUsers: UserProfile[] = [
  {
    id: "u-1",
    fullName: "John Smith",
    email: "john@example.com",
    role: "student",
    joinedDate: "Oct 25, 2025",
    status: "Active",
    sessionsCompleted: 5,
    walletBalance: 100,
    location: "New York, USA",
    bio: "Passionate high school student focusing on math and science.",
    subjects: ["Mathematics", "Physics"],
    phone: "+1 (555) 123-4567"
  },
  {
    id: "u-2",
    fullName: "Emily Parker",
    email: "emily@example.com",
    role: "student",
    joinedDate: "Oct 27, 2025",
    status: "Active",
    sessionsCompleted: 10,
    walletBalance: 200,
    location: "London, UK",
    bio: "Undergraduate student looking for chemistry and biology tutors.",
    subjects: ["Chemistry", "Biology"],
    phone: "+44 20 7946 0958"
  },
  {
    id: "u-3",
    fullName: "David Lee",
    email: "david@example.com",
    role: "student",
    joinedDate: "Oct 28, 2025",
    status: "Active",
    sessionsCompleted: 7,
    walletBalance: 150,
    location: "Toronto, Canada",
    bio: "High school senior preparing for university algebra.",
    subjects: ["Mathematics"],
    phone: "+1 (416) 555-0198"
  },
  {
    id: "u-4",
    fullName: "Lisa Anderson",
    email: "lisa@example.com",
    role: "student",
    joinedDate: "Oct 29, 2025",
    status: "Active",
    sessionsCompleted: 2,
    walletBalance: 50,
    location: "Sydney, Australia",
    bio: "Looking for general physics homework assistance.",
    subjects: ["Physics"],
    phone: "+61 2 9382 0482"
  },
  {
    id: "u-5",
    fullName: "Dr. Sarah Johnson",
    email: "sarah@example.com",
    role: "teacher",
    joinedDate: "Oct 20, 2025",
    status: "Active",
    sessionsTaught: 15,
    rating: 4.9,
    location: "Boston, USA",
    bio: "PhD in Mathematics with 8+ years of teaching experience. I specialize in making complex algebra and calculus topics easy to grasp.",
    subjects: ["Mathematics", "Calculus"],
    phone: "+1 (617) 555-0143"
  },
  {
    id: "u-6",
    fullName: "Prof. Michael Chen",
    email: "michael@example.com",
    role: "teacher",
    joinedDate: "Oct 22, 2025",
    status: "Active",
    sessionsTaught: 22,
    rating: 4.8,
    location: "San Francisco, USA",
    bio: "Former university physics professor. Specialized in electromagnetism and mechanical dynamics.",
    subjects: ["Physics", "Mechanics"],
    phone: "+1 (415) 555-0122"
  },
  {
    id: "u-7",
    fullName: "Admin User",
    email: "admin@scholaai.com",
    role: "admin",
    joinedDate: "Oct 01, 2025",
    status: "Active",
    location: "HQ Office",
    bio: "System administrator.",
    subjects: []
  }
];

export const getAllUsers = (): UserProfile[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(data);
};

export const getUserByEmail = (email: string): UserProfile | null => {
  const users = getAllUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
};

export const updateUserProfile = (email: string, updatedData: Partial<UserProfile>): void => {
  const users = getAllUsers();
  const index = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
  if (index !== -1) {
    users[index] = { ...users[index], ...updatedData };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }
};

export const createUserProfile = (newUser: Omit<UserProfile, "id" | "joinedDate" | "status">): void => {
  const users = getAllUsers();
  const fullUser: UserProfile = {
    ...newUser,
    id: `u-${Date.now()}`,
    joinedDate: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    }),
    status: "Active"
  };
  users.push(fullUser);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const deleteUserByEmail = (email: string): void => {
  const users = getAllUsers();
  const filtered = users.filter((u) => u.email.toLowerCase() !== email.toLowerCase());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const getCurrentUserProfile = (): TeacherProfile | null => {
  return {
    id: "1",
    fullName: "Dr. Roberts",
    role: "teacher",
    availability: {
      "Mon": ["09:00 AM", "10:00 AM"],
      "Tue": ["11:00 AM", "01:00 PM"],
      "Wed": ["10:00 AM"],
      "Thu": ["02:00 PM"],
      "Fri": ["09:00 AM", "03:00 PM"]
    }
  };
};

