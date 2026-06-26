import { Card } from "../../../components/ui/card";

interface EarningsSummaryProps {
  week: number;
  month: number;
  lastMonth: number;
  lifetime: number;
}

export default function EarningsSummary({
  week,
  month,
  lastMonth,
  lifetime,
}: EarningsSummaryProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg mb-4 font-semibold" style={{ color: "#1E3A8A" }}>
        Earnings Summary
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">This Week</span>
          <span className="font-semibold">{week.toLocaleString()} EGP</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">This Month</span>
          <span className="font-semibold">{month.toLocaleString()} EGP</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Last Month</span>
          <span className="font-semibold">{lastMonth.toLocaleString()} EGP</span>
        </div>
        <div className="pt-3 border-t">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Lifetime</span>
            <span
              style={{ color: "#1E3A8A" }}
              className="text-lg font-bold"
            >
              {lifetime.toLocaleString()} EGP
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
