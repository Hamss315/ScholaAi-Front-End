import { useState, useEffect ,isValidElement} from "react";
import type { ReactNode, ReactElement } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles, Copy, Check } from "lucide-react";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { aiNotesMarkdown } from "../../data/notesData";

export default function AiNotesSection() {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(aiNotesMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="transition-all duration-700 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
      }}
    >
      <Card className="overflow-hidden border-0 shadow-lg">
        {/* ── Header ──────────────────────────────────────── */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{
            background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A78BFA 100%)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg leading-tight">
                AI-Generated Notes
              </h3>
              <p className="text-white/70 text-xs mt-0.5">
                Auto-generated from session recording
              </p>
            </div>
          </div>
          <Button
            size="sm"
            className="bg-white/15 hover:bg-white/25 text-white border-0 backdrop-blur text-xs gap-1.5 transition-all"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy
              </>
            )}
          </Button>
        </div>

        {/* ── Markdown Body ───────────────────────────────── */}
        <div className="p-6 sm:p-8 bg-white">
          <div className="ai-notes-content" dir="auto">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children }) => (
                  <h2 className="ai-notes-h2">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="ai-notes-h3">{children}</h3>
                ),
                p: ({ children }) => {
                  // Flatten children to a plain string safely
                  const flatten = (child: ReactNode): string => {
                  if (typeof child === "string") return child;
                  if (typeof child === "number") return String(child);
                  if (Array.isArray(child)) return child.map(flatten).join("");
                  if (isValidElement(child)) {
                    const el = child as ReactElement<{ children?: ReactNode }>;
                    return flatten(el.props.children);
                  }
                  return "";
                };

                  const text = flatten(children);

                  if (text.startsWith("←")) {
                    return (
                      <div className="ai-notes-callout">
                        <div className="ai-notes-callout-arrow">←</div>
                        <p className="ai-notes-callout-text">{text.slice(1).trim()}</p>
                      </div>
                    );
                  }
                  return <p className="ai-notes-p">{children}</p>;
                },
                ul: ({ children }) => (
                  <ul className="ai-notes-ul">{children}</ul>
                ),
                li: ({ children }) => (
                  <li className="ai-notes-li">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="ai-notes-strong">{children}</strong>
                ),
              }}
            >
              {aiNotesMarkdown}
            </ReactMarkdown>
          </div>
        </div>
      </Card>

      {/* ── Scoped Styles ─────────────────────────────────── */}
      <style>{`
        .ai-notes-content {
          font-family: inherit;
          line-height: 1.8;
          color: #374151;
        }

        .ai-notes-h2 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1E3A8A;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #E0E7FF;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .ai-notes-h2:first-child {
          margin-top: 0;
        }

        .ai-notes-h3 {
          font-size: 1.05rem;
          font-weight: 600;
          color: #1E3A8A;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }

        .ai-notes-p {
          margin-bottom: 0.5rem;
          color: #4B5563;
          line-height: 1.85;
        }

        .ai-notes-ul {
          list-style: none;
          padding: 0;
          margin: 0 0 0.75rem 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .ai-notes-li {
          position: relative;
          padding-inline-start: 1.75rem;
          color: #4B5563;
          line-height: 1.7;
        }

        .ai-notes-li::before {
          content: "";
          position: absolute;
          inset-inline-start: 0.25rem;
          top: 0.65rem;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366F1, #8B5CF6);
        }

        .ai-notes-callout {
          background: linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%);
          border-inline-start: 3px solid #8B5CF6;
          border-radius: 0 8px 8px 0;
          padding: 0.875rem 1rem;
          margin: 0.5rem 0 1rem 0;
          display: flex;
          gap: 0.625rem;
          align-items: flex-start;
        }

        .ai-notes-callout-arrow {
          color: #8B5CF6;
          font-weight: 700;
          font-size: 1.1rem;
          flex-shrink: 0;
          line-height: 1.7;
        }

        .ai-notes-callout-text {
          color: #4B5563;
          line-height: 1.8;
          margin: 0;
        }

        .ai-notes-strong {
          color: #1E3A8A;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
