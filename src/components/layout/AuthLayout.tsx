export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Side — Illustration */}
      <div className="hidden md:flex bg-blue-100 items-center justify-center">
        <h1 className="text-3xl font-bold text-blue-700">ScholaAI</h1>
      </div>

      {/* Right Side — Form */}
      <div className="w-full flex items-center justify-center p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
