import { FileText } from "lucide-react";
import NotesHeader from "../components/notes/NotesHeader";
import AiNotesSection from "../components/notes/AiNotesSection";
import NotesCTA from "../components/notes/NotesCTA";

export default function SessionNotesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NotesHeader />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8" style={{ color: '#8B5CF6' }} />
            <h1 className="text-4xl" style={{ color: '#1E3A8A' }}>Session Notes</h1>
          </div>
          <p className="text-gray-600">AI-generated notes from your session recording.</p>
        </div>

        <AiNotesSection />
        <NotesCTA />
      </div>
    </div>
  );
}
