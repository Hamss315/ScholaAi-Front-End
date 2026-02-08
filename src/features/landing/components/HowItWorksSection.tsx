import { HOW_IT_WORKS } from "../constants/landing.constants";

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4" style={{ color: "#1E3A8A" }}>
            How It Works
          </h2>
          <p className="text-xl text-gray-600">Get started in three simple steps</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {HOW_IT_WORKS.map((step) => (
            <div key={step.number} className="text-center">
              <div
                className={`w-16 h-16 rounded-full ${step.circleClass} text-white flex items-center justify-center mx-auto mb-4 text-2xl`}
              >
                {step.number}
              </div>
              <h3 className="mb-3" style={{ color: "#1E3A8A" }}>
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
