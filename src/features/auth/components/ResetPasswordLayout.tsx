import type { ReactNode } from "react";
import { Brain } from "lucide-react";

type Props = {
  title?: string;
  subtitle?: string;
  topAction?: ReactNode; // e.g. Back to Login button
  children: ReactNode;   // the Card content
  footerText?: string;   // the small text under the card
};

export default function ResetPasswordLayout({
  title,
  subtitle,
  topAction,
  children,
  footerText,
}: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          {topAction ? <div className="mb-4">{topAction}</div> : null}

          <div className="flex items-center justify-center gap-2 mb-2">
            <Brain className="w-10 h-10" style={{ color: "#8B5CF6" }} />
            <span className="text-3xl" style={{ color: "#1E3A8A" }}>
              ScholaAi
            </span>
          </div>

          {title ? (
            <h2 className="text-2xl mb-2" style={{ color: "#1E3A8A" }}>
              {title}
            </h2>
          ) : null}

          {subtitle ? <p className="text-gray-600">{subtitle}</p> : null}
        </div>

        {children}

        {footerText ? (
          <p className="text-center text-gray-600 mt-4 text-sm">{footerText}</p>
        ) : null}
      </div>
    </div>
  );
}
