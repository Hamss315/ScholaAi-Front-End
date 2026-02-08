import type { LucideIcon } from "lucide-react";
import { Brain, Video, Users, TrendingUp, Sparkles, CheckCircle } from "lucide-react";

export type FeatureItem = {
  title: string;
  description: string;
  Icon: LucideIcon;
  iconColor: string;
  bgClass: string;
};

export const FEATURES: FeatureItem[] = [
  {
    title: "Live Video Sessions",
    description:
      "High-quality one-on-one video sessions with interactive whiteboard and real-time chat.",
    Icon: Video,
    iconColor: "#3B82F6",
    bgClass: "bg-blue-50",
  },
  {
    title: "AI Engagement Monitoring",
    description:
      "Advanced AI tracks focus levels and engagement in real-time to optimize learning.",
    Icon: Brain,
    iconColor: "#8B5CF6",
    bgClass: "bg-purple-50",
  },
  {
    title: "Auto-Generated Notes",
    description:
      "AI automatically creates detailed session summaries and personalized study notes.",
    Icon: Sparkles,
    iconColor: "#22C55E",
    bgClass: "bg-green-50",
  },
  {
    title: "Expert Teachers",
    description:
      "Connect with qualified teachers across all subjects and grade levels.",
    Icon: Users,
    iconColor: "#FACC15",
    bgClass: "bg-yellow-50",
  },
  {
    title: "Progress Analytics",
    description:
      "Track learning progress with detailed analytics and performance insights.",
    Icon: TrendingUp,
    iconColor: "#3B82F6",
    bgClass: "bg-blue-50",
  },
  {
    title: "Flexible Scheduling",
    description:
      "Book sessions at your convenience with our easy-to-use scheduling system.",
    Icon: CheckCircle,
    iconColor: "#8B5CF6",
    bgClass: "bg-purple-50",
  },
];

export type HowItWorksStep = {
  number: string;
  title: string;
  description: string;
  circleClass: string;
};

export const HOW_IT_WORKS: HowItWorksStep[] = [
  {
    number: "1",
    title: "Sign Up & Choose Your Role",
    description: "Create your account as a student or teacher and set up your profile.",
    circleClass: "bg-blue-600",
  },
  {
    number: "2",
    title: "Book or Schedule Sessions",
    description: "Students book sessions, teachers set availability and start teaching.",
    circleClass: "bg-purple-600",
  },
  {
    number: "3",
    title: "Learn with AI Support",
    description: "Join live sessions with AI monitoring and receive auto-generated notes.",
    circleClass: "bg-green-600",
  },
];

export const PRICING_BULLETS: string[] = [
  "One-on-one live sessions",
  "AI engagement monitoring",
  "Auto-generated notes",
  "Progress analytics",
  "Each teacher sets their own price",
  "No unused hours expiration",
];
