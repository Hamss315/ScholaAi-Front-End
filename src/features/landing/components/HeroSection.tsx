import { CheckCircle, Sparkles } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { ImageWithFallback } from "../../../components/common/ImageWithFallback";

type Props = {
  onJoinClick: () => void;
};

export default function HeroSection({ onJoinClick }: Props) {
  return (
    <section className="container mx-auto px-4 py-20 md:py-28">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 mb-6">
            <Sparkles className="w-4 h-4" style={{ color: "#8B5CF6" }} />
            <span className="text-sm" style={{ color: "#8B5CF6" }}>
              AI-Powered Learning Platform
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl mb-6" style={{ color: "#1E3A8A" }}>
            AI-powered learning made personal
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Connect with expert teachers for live one-on-one sessions. Our AI monitors engagement and
            generates personalized notes automatically.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-[#1E3A8A] hover:bg-[#1e3a8a]/90" onClick={onJoinClick}>
              Join as Student
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A]/10"
              onClick={onJoinClick}
            >
              Join as Teacher
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1608986596619-eb50cc56831f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
              alt="Online learning"
              className="w-full h-auto"
            />
          </div>

          <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Focus Score</div>
                <div className="text-2xl" style={{ color: "#22C55E" }}>
                  95%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
