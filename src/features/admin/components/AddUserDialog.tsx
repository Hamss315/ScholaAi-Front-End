import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { createUser, getSubjects, type AdminSubject } from "../../../services/api/admin";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated: () => void;
}

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  userName: "",
  email: "",
  password: "",
  role: "Student",
  gender: "Male",
  phoneNumber: "",
  // Student
  grade: "",
  // Teacher
  college: "",
  certificate: "",
  teachingExperience: "",
  subjectId: "",
};

export default function AddUserDialog({ open, onOpenChange, onUserCreated }: AddUserDialogProps) {
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [subjects, setSubjects] = useState<AdminSubject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      getSubjects()
        .then(setSubjects)
        .catch(() => {});
    }
  }, [open]);

  const set = (key: keyof typeof EMPTY_FORM, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleCreate = async () => {
    setError(null);
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.password.trim() || !form.userName.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    if (form.role === "Student" && !form.grade) {
      setError("Grade is required for students.");
      return;
    }
    if (form.role === "Teacher" && (!form.college.trim() || !form.certificate.trim() || !form.teachingExperience.trim() || !form.subjectId)) {
      setError("All teacher fields are required.");
      return;
    }

    setLoading(true);
    try {
      await createUser({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        userName: form.userName.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        gender: form.gender,
        phoneNumber: form.phoneNumber.trim() || null,
        grade: form.role === "Student" ? Number(form.grade) : null,
        college: form.role === "Teacher" ? form.college.trim() : null,
        certificate: form.role === "Teacher" ? form.certificate.trim() : null,
        teachingExperience: form.role === "Teacher" ? form.teachingExperience.trim() : null,
        subjectId: form.role === "Teacher" ? Number(form.subjectId) : null,
      });
      onOpenChange(false);
      setForm({ ...EMPTY_FORM });
      onUserCreated();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to create user. Please check the details and try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    onOpenChange(false);
    setForm({ ...EMPTY_FORM });
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg bg-white rounded-xl shadow-lg border border-gray-200 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold" style={{ color: "#1E3A8A" }}>
            Add New User
          </DialogTitle>
          <DialogDescription>Create a new user account for the platform.</DialogDescription>
        </DialogHeader>

        {error && (
          <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-medium">
            {error}
          </div>
        )}

        <div className="space-y-4 mt-2">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="new-first" className="text-sm font-semibold text-gray-700">First Name *</Label>
              <Input id="new-first" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="John" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="new-last" className="text-sm font-semibold text-gray-700">Last Name *</Label>
              <Input id="new-last" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="Doe" className="mt-1" />
            </div>
          </div>

          <div>
            <Label htmlFor="new-username" className="text-sm font-semibold text-gray-700">Username *</Label>
            <Input id="new-username" value={form.userName} onChange={(e) => set("userName", e.target.value)} placeholder="johndoe" className="mt-1" />
          </div>

          <div>
            <Label htmlFor="new-email" className="text-sm font-semibold text-gray-700">Email *</Label>
            <Input id="new-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="john@example.com" className="mt-1" />
          </div>

          <div>
            <Label htmlFor="new-password" className="text-sm font-semibold text-gray-700">Password *</Label>
            <Input id="new-password" type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="••••••••" className="mt-1" />
          </div>

          {/* Role & Gender */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-semibold text-gray-700">Role *</Label>
              <Select value={form.role} onValueChange={(v) => set("role", v)}>
                <SelectTrigger className="mt-1 w-full bg-white border border-gray-300 rounded-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-md">
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Teacher">Teacher</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">Gender *</Label>
              <Select value={form.gender} onValueChange={(v) => set("gender", v)}>
                <SelectTrigger className="mt-1 w-full bg-white border border-gray-300 rounded-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-md">
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="new-phone" className="text-sm font-semibold text-gray-700">Phone</Label>
            <Input id="new-phone" value={form.phoneNumber} onChange={(e) => set("phoneNumber", e.target.value)} placeholder="+1 555 000 0000" className="mt-1" />
          </div>

          {/* Student-only */}
          {form.role === "Student" && (
            <div>
              <Label htmlFor="new-grade" className="text-sm font-semibold text-gray-700">Grade *</Label>
              <Input id="new-grade" type="number" min={1} max={12} value={form.grade} onChange={(e) => set("grade", e.target.value)} placeholder="e.g. 10" className="mt-1" />
            </div>
          )}

          {/* Teacher-only */}
          {form.role === "Teacher" && (
            <>
              <div>
                <Label htmlFor="new-college" className="text-sm font-semibold text-gray-700">College *</Label>
                <Input id="new-college" value={form.college} onChange={(e) => set("college", e.target.value)} placeholder="University of …" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="new-cert" className="text-sm font-semibold text-gray-700">Certificate *</Label>
                <Input id="new-cert" value={form.certificate} onChange={(e) => set("certificate", e.target.value)} placeholder="e.g. B.Sc. Mathematics" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="new-exp" className="text-sm font-semibold text-gray-700">Teaching Experience *</Label>
                <Input id="new-exp" value={form.teachingExperience} onChange={(e) => set("teachingExperience", e.target.value)} placeholder="e.g. 3 years" className="mt-1" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700">Subject *</Label>
                <Select value={form.subjectId} onValueChange={(v) => set("subjectId", v)}>
                  <SelectTrigger className="mt-1 w-full bg-white border border-gray-300 rounded-md">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-md">
                    {subjects.map((s) => (
                      <SelectItem key={s.subjectId} value={String(s.subjectId)}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1 hover:bg-gray-50 border-gray-300 font-medium" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button className="flex-1 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-semibold" onClick={handleCreate} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Create User
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
