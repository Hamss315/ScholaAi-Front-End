import { Card } from "../../../components/ui/card";
import { Calendar, Clock, Check } from "lucide-react";

interface Props {
  totalSlots: number;
}

export default function ScheduleStats({ totalSlots }: Props) {
  const booked = 12;
  const remaining = Math.max(0, totalSlots - booked);

  const Item = ({ icon, label, value, bg }: any) => (
    <Card className="p-4 flex items-center gap-3 rounded-xl shadow-sm">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bg}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-2xl font-semibold text-[#1E3A8A]">{value}</p>
      </div>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Item
        icon={<Calendar className="w-5 h-5 text-blue-600" />}
        label="Available Slots"
        value={totalSlots}
        bg="bg-blue-100"
      />
      <Item
        icon={<Clock className="w-5 h-5 text-purple-600" />}
        label="Booked This Week"
        value={booked}
        bg="bg-purple-100"
      />
      <Item
        icon={<Check className="w-5 h-5 text-green-600" />}
        label="Remaining Slots"
        value={remaining}
        bg="bg-green-100"
      />
    </div>
  );
}