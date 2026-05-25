import { Card } from "../../../components/ui/card";

export default function ProTipCard() {
  return (
    <Card className="p-6 mt-6 rounded-xl text-white shadow-sm bg-gradient-to-r from-purple-500/90 to-blue-600/90">
      <h3 className="text-lg font-semibold mb-1">
        💡 Pro Tip
      </h3>
      <p className="text-sm opacity-90">
        Students can only book sessions during your available time slots.
      </p>
    </Card>
  );
}