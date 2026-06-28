import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Loader2, AlertCircle, BookOpen, Check, X } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../components/ui/dialog";
import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  type AdminSubject,
} from "../../../services/api/admin";

export default function SubjectsTable() {
  const [subjects, setSubjects] = useState<AdminSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Create dialog state
  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createDesc, setCreateDesc] = useState("");

  // Edit inline state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  // Delete confirm
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadSubjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSubjects();
      setSubjects(data);
      setError(null);
    } catch {
      setError("Failed to load subjects.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  const handleCreate = async () => {
    if (!createName.trim()) return;
    setSaving(true);
    try {
      await createSubject({ name: createName.trim(), description: createDesc.trim() || null });
      setShowCreate(false);
      setCreateName("");
      setCreateDesc("");
      await loadSubjects();
    } catch {
      setError("Failed to create subject.");
    } finally {
      setSaving(false);
    }
  };

  const handleStartEdit = (s: AdminSubject) => {
    setEditingId(s.subjectId);
    setEditName(s.name);
    setEditDesc(s.description ?? "");
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      await updateSubject(editingId, { name: editName.trim(), description: editDesc.trim() || null });
      setEditingId(null);
      await loadSubjects();
    } catch {
      setError("Failed to update subject.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setSaving(true);
    try {
      await deleteSubject(id);
      setDeletingId(null);
      await loadSubjects();
    } catch {
      setError("Failed to delete subject. It may have teachers assigned to it.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Card className="p-6 bg-white border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: "#1E3A8A" }}>
            Subjects
          </h2>
          <Button
            onClick={() => setShowCreate(true)}
            className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Subject
          </Button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 mb-4 text-sm font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading subjects…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Name</TableHead>
                  <TableHead className="font-bold">Description</TableHead>
                  <TableHead className="font-bold text-center">Teachers</TableHead>
                  <TableHead className="font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-400 py-8">
                      No subjects found. Add one above.
                    </TableCell>
                  </TableRow>
                ) : (
                  subjects.map((s) =>
                    editingId === s.subjectId ? (
                      <TableRow key={s.subjectId} className="bg-blue-50">
                        <TableCell>
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="h-8 text-sm"
                            autoFocus
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            className="h-8 text-sm"
                            placeholder="Optional description"
                          />
                        </TableCell>
                        <TableCell className="text-center">{s.teacherCount}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={handleSaveEdit}
                              disabled={saving}
                              className="h-8 bg-green-600 hover:bg-green-700 text-white"
                            >
                              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingId(null)}
                              className="h-8"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow key={s.subjectId} className="hover:bg-gray-50/80">
                        <TableCell>
                          <div className="flex items-center gap-2 font-semibold text-gray-800">
                            <BookOpen className="w-4 h-4 text-purple-500" />
                            {s.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-500 max-w-xs truncate">
                          {s.description ?? <span className="text-gray-300 italic">No description</span>}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                            {s.teacherCount}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleStartEdit(s)}
                              className="h-8 w-8 hover:bg-blue-50"
                            >
                              <Pencil className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setDeletingId(s.subjectId)}
                              className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  )
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Create Subject Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md bg-white rounded-xl shadow-lg border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold" style={{ color: "#1E3A8A" }}>
              Add Subject
            </DialogTitle>
            <DialogDescription>Create a new subject for the platform.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">Name *</label>
              <Input
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="e.g. Mathematics"
                className="mt-1"
                autoFocus
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Description</label>
              <Textarea
                value={createDesc}
                onChange={(e) => setCreateDesc(e.target.value)}
                placeholder="Optional subject description"
                className="mt-1 min-h-[80px]"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-semibold"
                onClick={handleCreate}
                disabled={saving || !createName.trim()}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Create Subject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <DialogContent className="max-w-sm bg-white rounded-xl shadow-lg border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-700">Delete Subject?</DialogTitle>
            <DialogDescription>
              This will permanently delete the subject. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setDeletingId(null)}>
              Cancel
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold"
              onClick={() => deletingId && handleDelete(deletingId)}
              disabled={saving}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
