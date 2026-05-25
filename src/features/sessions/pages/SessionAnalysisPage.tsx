import { Button } from "../../../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SessionAnalysisPage() {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto p-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>
      <h1 className="text-3xl font-bold mb-4">Session Analysis</h1>
      <p>This is a placeholder for the session analysis and feedback page.</p>
    </div>
  );
}
