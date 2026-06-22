import { Brain, ArrowLeft, Save } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserByEmail, updateUserProfile } from "../../../utils/userDataService";
import type { UserProfile } from "../../../utils/userDataService";

export default function AdminEditUser() {
  const { email } = useParams<{ email: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"student" | "teacher" | "admin">("student");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (email) {
      const userData = getUserByEmail(email);
      if (userData) {
        setUser(userData);
        setFullName(userData.fullName);
        setRole(userData.role);
        setLocation(userData.location || "");
        setPhone(userData.phone || "");
        setBio(userData.bio || "");
      }
    }
  }, [email]);

  const handleSave = () => {
    if (!email || !fullName.trim()) return;

    updateUserProfile(email, {
      fullName,
      role,
      location,
      phone,
      bio
    });

    alert("User profile updated successfully.");
    navigate(`/admin/users/${email}`);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#1E3A8A' }}>User not found</h2>
          <Button onClick={() => navigate("/admin/panel")} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-semibold">
            Back to Admin Panel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/users/${email}`)}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Brain className="w-8 h-8" style={{ color: '#8B5CF6' }} />
                <span className="text-2xl font-bold" style={{ color: '#1E3A8A' }}>ScholaAi</span>
                <Badge className="ml-2 bg-red-100 text-red-700 hover:bg-red-100 border-none font-semibold">Admin</Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="p-6 bg-white border border-gray-200 shadow-sm">
          <h1 className="text-3xl font-bold mb-6" style={{ color: '#1E3A8A' }}>Edit User Details</h1>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name" className="text-sm font-semibold text-gray-700">Full Name *</Label>
              <Input
                id="edit-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="edit-email" className="text-sm font-semibold text-gray-700">Email (Cannot be modified)</Label>
              <Input
                id="edit-email"
                value={email}
                disabled
                className="mt-1 bg-gray-50 cursor-not-allowed"
              />
            </div>

            <div>
              <Label htmlFor="edit-role" className="text-sm font-semibold text-gray-700">Role *</Label>
              <Select
                value={role.charAt(0).toUpperCase() + role.slice(1)}
                onValueChange={(val) => setRole(val.toLowerCase() as "student" | "teacher" | "admin")}
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
              <Label htmlFor="edit-location" className="text-sm font-semibold text-gray-700">Location</Label>
              <Input
                id="edit-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. New York, USA"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="edit-phone" className="text-sm font-semibold text-gray-700">Phone</Label>
              <Input
                id="edit-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +1 (555) 123-4567"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="edit-bio" className="text-sm font-semibold text-gray-700">Bio</Label>
              <Textarea
                id="edit-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about this user..."
                className="mt-1 min-h-[100px]"
              />
            </div>

            <div className="flex gap-3 pt-6">
              <Button 
                variant="outline" 
                className="flex-1 hover:bg-gray-50 border-gray-300 font-semibold"
                onClick={() => navigate(`/admin/users/${email}`)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-semibold"
                onClick={handleSave}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
