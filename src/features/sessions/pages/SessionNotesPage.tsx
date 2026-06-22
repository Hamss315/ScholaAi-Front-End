import { useState, useEffect, isValidElement } from "react";
import type { ReactNode, ReactElement } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  FileText,
  ArrowLeft,
  Sparkles,
  Copy,
  Check,
  Video,
} from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { getSessionById } from "../../../services/api/studentSessions";

export default function SessionNotesPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getSessionById(Number(sessionId));
        setSession(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load session");
      } finally {
        setLoading(false);
      }
    }
    if (sessionId) load();
  }, [sessionId]);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setVisible(true), 100);
      return () => clearTimeout(t);
    }
  }, [loading]);

  const handleCopy = async () => {
    if (!session?.summary) return;
    await navigator.clipboard.writeText(session.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-[#8B5CF6] animate-spin" />
          <p className="text-gray-500 text-sm">Loading notes...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <p className="text-red-500 mb-4">{error || "Session not found"}</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </Card>
      </div>
    );
  }

  const summaryContent = session.summary || "No AI-generated notes available for this session yet.";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 max-w-5xl flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold" style={{ color: "#1E3A8A" }}>
            Session Notes
          </h2>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8" style={{ color: "#8B5CF6" }} />
            <h1 className="text-4xl" style={{ color: "#1E3A8A" }}>
              {session.lessonTitle || "Session Notes"}
            </h1>
          </div>
          <p className="text-gray-600">AI-generated notes from your session recording.</p>
        </div>

        {/* AI Notes Card */}
        <div
          className="transition-all duration-700 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
          }}
        >
          <Card className="overflow-hidden border-0 shadow-lg mb-6">
            {/* Header */}
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

            {/* Markdown Body */}
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
                  {summaryContent}
                </ReactMarkdown>
              </div>
            </div>
          </Card>

          {/* CTA - Watch Recording */}
          {session.recordedSession && (
            <Card className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold" style={{ color: "#1E3A8A" }}>Watch the Session Recording</h3>
                <p className="text-sm text-gray-500">Review the full session video recording.</p>
              </div>
              <Button
                className="bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white flex items-center gap-2"
                onClick={() => navigate(`/session/${sessionId}/record`)}
              >
                <Video className="w-4 h-4" />
                View Recording
              </Button>
            </Card>
          )}
        </div>
      </div>

      {/* Scoped Styles */}
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
