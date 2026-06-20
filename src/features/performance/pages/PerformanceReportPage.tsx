import { TrendingUp } from "lucide-react";
import PerformanceHeader from "../components/PerformanceHeader";
import OverallStats from "../components/OverallStats";
import PerformanceHighlights from "../components/PerformanceHighlights";
import ChartsSection from "../components/ChartsSection";
import SubjectBreakdown from "../components/SubjectBreakdown";
import PerformanceCTA from "../components/PerformanceCTA";

export default function PerformanceReportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PerformanceHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8" style={{ color: '#3B82F6' }} />
            <h1 className="text-4xl" style={{ color: '#1E3A8A' }}>Performance Report</h1>
          </div>
          <p className="text-gray-600">Your learning analytics across all sessions and subjects.</p>
        </div>

        <OverallStats />
        <PerformanceHighlights />
        <ChartsSection />
        <SubjectBreakdown />
        <PerformanceCTA />
      </div>
    </div>
  );
}
