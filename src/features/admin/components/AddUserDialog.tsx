import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { createUserProfile } from "../../../utils/userDataService";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated: () => void;
}

export default function AddUserDialog({
  open,
  onOpenChange,
  onUserCreated,
}: AddUserDialogProps) {
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    role: "Student",
    password: "",
  });

  const handleCreateUser = () => {
    if (!newUserData.name.trim() || !newUserData.email.trim()) return;
    
    createUserProfile({
      fullName: newUserData.name,
      email: newUserData.email,
      role: newUserData.role.toLowerCase() as "student" | "teacher" | "admin"
    });
    
    onOpenChange(false);
    setNewUserData({ name: "", email: "", role: "Student", password: "" });
    onUserCreated();
  };

  const handleCancel = () => {
    onOpenChange(false);
    setNewUserData({ name: "", email: "", role: "Student", password: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white rounded-xl shadow-lg border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold" style={{ color: '#1E3A8A' }}>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account for the platform.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-6">
          <div>
            <Label htmlFor="new-name" className="text-sm font-semibold text-gray-700">Full Name *</Label>
            <Input
              id="new-name"
              value={newUserData.name}
              onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
              placeholder="John Doe"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="new-email" className="text-sm font-semibold text-gray-700">Email *</Label>
            <Input
              id="new-email"
              type="email"
              value={newUserData.email}
              onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
              placeholder="john@example.com"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="new-role" className="text-sm font-semibold text-gray-700">Role *</Label>
            <Select
              value={newUserData.role}
              onValueChange={(value) => setNewUserData({ ...newUserData, role: value })}
            >
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
            <Label htmlFor="new-password" className="text-sm font-semibold text-gray-700">Temporary Password *</Label>
            <Input
              id="new-password"
              type="password"
              value={newUserData.password}
              onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
              placeholder="••••••••"
              className="mt-1"
            />
          </div>

          <div className="flex gap-3 pt-6">
            <Button 
              variant="outline" 
              className="flex-1 hover:bg-gray-50 border-gray-300 font-medium"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-semibold"
              onClick={handleCreateUser}
            >
              Create User
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
