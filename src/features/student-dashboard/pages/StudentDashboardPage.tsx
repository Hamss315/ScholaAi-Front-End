import { useEffect, useState } from "react";
import DashboardHeader from "../components/DashboardHeader";
import StatsGrid from "../components/StatsGrid";
import UpcomingSessions from "../components/UpcomingSessions";
import RecentNotes from "../components/RecentNotes";
import RightSidebar from "../components/RightSidebar";

import {
  getUpcomingSessions,
  getRecentNotes,
} from "../services/dashboard.service";

import type {
  UpcomingSession,
  RecentNote,
} from "../types/dashboard.types";

export default function StudentDashboardPage() {
  const [sessions, setSessions] = useState<UpcomingSession[]>([]);
  const [notes, setNotes] = useState<RecentNote[]>([]);

  useEffect(() => {
    getUpcomingSessions().then(setSessions);
    getRecentNotes().then(setNotes);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      <DashboardHeader />

      <div className="container mx-auto px-4 py-8">

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2 text-[#1E3A8A]">
            Welcome back, John!
          </h1>
          <p className="text-gray-600">
            Here's your learning overview for today
          </p>
        </div>

        {/* Stats */}
        <StatsGrid />

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <UpcomingSessions sessions={sessions} />
            <RecentNotes notes={notes} />
          </div>

          {/* RIGHT */}
          <RightSidebar />

        </div>

      </div>
    </div>
  );
}