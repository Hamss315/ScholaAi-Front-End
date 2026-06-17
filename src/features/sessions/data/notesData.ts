export const sessionData = {
  lessonTitle: "Quadratic Equations and Problem Solving",
  lessonDescription: "In this session, we covered the fundamentals of quadratic equations, including factoring, completing the square, and using the quadratic formula. We also worked through several real-world application problems.",
  studentLevel: "Intermediate",
  subject: "Mathematics",
  studentName: "John Smith",
  teacherName: "Dr. Sarah Johnson",
  sessionDate: "Nov 5, 2025",
  sessionDuration: "1 hour 30 minutes",
  nextSessionDate: "Nov 12, 2025 at 2:00 PM",
  stats: { explainedTopics: 5 },
  expressions: { positive: 65, neutral: 28, negative: 7 },
  talkingTime: { student: 35, teacher: 65 },
  summary: "This was a highly productive session with strong student engagement. John demonstrated excellent understanding of basic quadratic concepts and successfully solved 4 out of 5 practice problems independently. His focus score remained above 85% throughout the session. Areas for improvement include working on word problems and translating real-world scenarios into mathematical equations. Overall performance: Excellent.",
  focusScore: 88,
};

export const aiNotes = {
  keyTopics: [
    {
      title: "Standard Form of a Quadratic Equation",
      content: "A quadratic equation has the form ax² + bx + c = 0, where a ≠ 0. The coefficient 'a' determines whether the parabola opens upward (a > 0) or downward (a < 0).",
    },
    {
      title: "Factoring Method",
      content: "When ax² + bx + c = 0 can be factored, find two numbers that multiply to give 'ac' and add to give 'b'. Rewrite the middle term and factor by grouping. Example: x² + 5x + 6 = (x+2)(x+3) = 0 → x = -2 or x = -3.",
    },
    {
      title: "Completing the Square",
      content: "Rearrange to x² + bx = -c, then add (b/2)² to both sides to create a perfect square trinomial. This method is the basis for deriving the quadratic formula.",
    },
    {
      title: "The Quadratic Formula",
      content: "x = (-b ± √(b²-4ac)) / 2a. The discriminant Δ = b²-4ac tells us the nature of roots: Δ > 0 → two real roots, Δ = 0 → one repeated root, Δ < 0 → no real roots (complex roots).",
    },
    {
      title: "Real-World Applications",
      content: "Quadratic equations model projectile motion (h = -½gt² + v₀t + h₀), area optimization problems, and revenue/profit curves in economics.",
    },
  ],
  keyTakeaways: [
    "Always identify 'a', 'b', 'c' before choosing a solving method.",
    "Factoring is fastest when the equation has simple integer roots.",
    "The quadratic formula works for any quadratic regardless of discriminant.",
    "Always check your answers by substituting back into the original equation.",
    "The vertex of the parabola is at x = -b/(2a).",
  ],
  practiceProblems: [
    {
      problem: "Solve: x² - 5x + 6 = 0",
      solution: "Factor: (x-2)(x-3) = 0 → x = 2 or x = 3",
      solved: true,
    },
    {
      problem: "Solve: 2x² + 3x - 2 = 0",
      solution: "Using the quadratic formula: x = (-3 ± √(9+16)) / 4 = (-3 ± 5) / 4 → x = ½ or x = -2",
      solved: true,
    },
    {
      problem: "A ball is thrown with h(t) = -5t² + 20t + 1. When does it hit the ground?",
      solution: "Set h(t) = 0, use quadratic formula: t ≈ 4.05 seconds",
      solved: false,
    },
  ],
  areasForImprovement: [
    "Translating word problems into quadratic equations",
    "Checking sign errors when applying the quadratic formula",
    "Understanding complex roots (when discriminant < 0)",
  ],
  teacherRecommendations: "John should practice 5–10 word problems before the next session. Suggested exercises from the textbook: Chapter 4, problems 12–22. Focus especially on projectile motion problems. John has strong algebraic manipulation skills — the main gap is problem-setup from text descriptions.",
};
