import { Card } from "../../../components/ui/card";
import { FEATURES } from "../constants/landing.constants";

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4" style={{ color: "#1E3A8A" }}>
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600">Everything you need for effective online learning</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((f) => (
            <Card key={f.title} className="p-6 hover:shadow-lg transition-shadow border-2">
              <div className={`w-14 h-14 rounded-xl ${f.bgClass} flex items-center justify-center mb-4`}>
                <f.Icon className="w-7 h-7" style={{ color: f.iconColor }} />
              </div>
              <h3 className="mb-3" style={{ color: "#1E3A8A" }}>
                {f.title}
              </h3>
              <p className="text-gray-600">{f.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
