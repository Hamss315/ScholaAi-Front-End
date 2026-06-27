import { Card } from "../../../components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  BarChart,
  Bar,
} from "recharts";
import { SUBJECT_COLORS } from "../data/performanceData";

interface ChartsSectionProps {
  focusTrendData: any[];
  radarData: any[];
  barData: any[];
}

export default function ChartsSection({
  focusTrendData,
  radarData,
  barData,
}: ChartsSectionProps) {

  return (
    <>
      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Focus Trend Line Chart */}
        <Card className="p-6">
          <h3 className="text-xl mb-1" style={{ color: '#1E3A8A' }}>Focus Score Trend</h3>
          <p className="text-sm text-gray-500 mb-5">Monthly focus score per subject</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={focusTrendData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              {Object.entries(SUBJECT_COLORS).map(([subject, color]) => (
                <Line
                  key={subject}
                  type="monotone"
                  dataKey={subject}
                  stroke={color}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  connectNulls={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Radar Chart */}
        <Card className="p-6">
          <h3 className="text-xl mb-1" style={{ color: '#1E3A8A' }}>Subject Comparison</h3>
          <p className="text-sm text-gray-500 mb-5">Focus vs positive expression per subject</p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
              <Radar name="Focus Score" dataKey="Focus Score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.25} />
              <Radar name="Positive Expression" dataKey="Positive Expression" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bar Chart */}
      <Card className="p-6 mb-8">
        <h3 className="text-xl mb-1" style={{ color: '#1E3A8A' }}>Average Focus by Subject</h3>
        <p className="text-sm text-gray-500 mb-5">Focus score compared across subjects</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="Avg Focus" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </>
  );
}
