import { useNavigate } from "react-router-dom";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

export default function PerformanceCTA() {
  const navigate = useNavigate();

  return (
    <Card className="p-6 mt-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-lg mb-1">Ready to improve your scores?</div>
          <div className="text-sm opacity-90">Book a session with your best-fit teacher and keep the momentum going.</div>
        </div>
        <div className="flex gap-3">
          <Button
            className="bg-white text-blue-600 hover:bg-gray-100"
            onClick={() => navigate("/search-teachers")}
          >
            Find a Teacher
          </Button>
          <Button
            className="bg-transparent border border-white text-white hover:bg-white/20 hover:text-white"
            onClick={() => navigate(-1)}
          >
            All Sessions
          </Button>
        </div>
      </div>
    </Card>
  );
}
