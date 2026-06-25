import { Brain, ArrowLeft, Calendar, Clock, Save, Edit2, Check, X, LogOut } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUserProfile, saveCurrentUserProfile } from "../services/schedule.service";
import type { TeacherProfile } from "../types/schedule.types";

export default function TeacherSchedulePage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  const [availability, setAvailability] = useState<Record<string, string[]>>({});
  const [originalAvailability, setOriginalAvailability] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const profile = getCurrentUserProfile();
    if (profile) {
      setTeacherProfile(profile as TeacherProfile);
      const currentAvailability = profile.availability || {};
      setAvailability(currentAvailability);
      setOriginalAvailability(currentAvailability);
    }
  }, []);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const timeSlots = [
    { value: "Morning (6-12)", label: "Morning", time: "6:00 AM - 12:00 PM" },
    { value: "Afternoon (12-17)", label: "Afternoon", time: "12:00 PM - 5:00 PM" },
    { value: "Evening (17-23)", label: "Evening", time: "5:00 PM - 11:00 PM" },
    { value: "Night (23-6)", label: "Night", time: "11:00 PM - 6:00 AM" }
  ];

  const toggleTimeSlot = (day: string, timeSlot: string) => {
    if (!isEditing) return;

    setAvailability(prev => {
      const daySlots = prev[day] || [];
      const isSelected = daySlots.includes(timeSlot);

      if (isSelected) {
        return {
          ...prev,
          [day]: daySlots.filter(slot => slot !== timeSlot)
        };
      } else {
        return {
          ...prev,
          [day]: [...daySlots, timeSlot]
        };
      }
    });
  };

  const handleSave = () => {
    if (teacherProfile) {
      const updatedProfile = {
        ...teacherProfile,
        availability
      };
      saveCurrentUserProfile(updatedProfile);
      setTeacherProfile(updatedProfile);
      setOriginalAvailability(availability); // Update original to match saved state
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    // Reset to original profile data
    if (teacherProfile) {
      setAvailability(originalAvailability);
    }
    setIsEditing(false);
  };

  // Count total available slots
  const totalSlots = Object.values(availability).reduce((sum, slots) => sum + slots.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/teacher/profile")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Brain className="w-8 h-8" style={{ color: '#8B5CF6' }} />
                <span className="text-2xl" style={{ color: '#1E3A8A' }}>ScholaAi</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback className="bg-[#8B5CF6] text-white">
                  {getInitials(teacherProfile?.fullName) || "T"}
                </AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl mb-2" style={{ color: '#1E3A8A' }}>My Schedule</h1>
              <p className="text-gray-600">Manage your weekly availability for teaching sessions</p>
            </div>
            {!isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)}
                className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/90"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Availability
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={handleCancel}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Available Slots</p>
                <p className="text-2xl" style={{ color: '#1E3A8A' }}>{totalSlots}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Booked This Week</p>
                <p className="text-2xl" style={{ color: '#1E3A8A' }}>12</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Remaining Slots</p>
                <p className="text-2xl" style={{ color: '#1E3A8A' }}>{Math.max(0, totalSlots - 12)}</p>
              </div>
            </div>
          </Card>
        </div>

        {isEditing && (
          <Card className="p-4 mb-6 border-blue-200 bg-blue-50">
            <div className="flex items-start gap-3">
              <Edit2 className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Edit Mode Active</p>
                <p className="text-sm text-blue-700 mt-1">
                  Click on any time slot to toggle your availability. Don't forget to save your changes!
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Weekly Schedule Grid */}
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl mb-2" style={{ color: '#1E3A8A' }}>Weekly Availability</h2>
            <p className="text-gray-600">
              {isEditing 
                ? "Click on time slots to mark your availability" 
                : "Your current weekly schedule"}
            </p>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Time slot headers */}
              <div className="grid grid-cols-8 gap-2 mb-2">
                <div></div>
                {daysOfWeek.map(day => (
                  <div key={day} className="text-center">
                    <Badge className="bg-gray-100 text-gray-700 w-full justify-center">
                      {day}
                    </Badge>
                  </div>
                ))}
              </div>

              {/* Schedule grid */}
              {timeSlots.map((slot) => (
                <div key={slot.value} className="grid grid-cols-8 gap-2 mb-3">
                  <div className="flex items-center">
                    <div className="text-sm">
                      <p className="font-medium text-gray-700">{slot.label}</p>
                      <p className="text-xs text-gray-500">{slot.time}</p>
                    </div>
                  </div>
                  
                  {daysOfWeek.map(day => {
                    const isAvailable = (availability[day] || []).includes(slot.value);
                    return (
                      <div key={day}>
                        <div
                          onClick={() => toggleTimeSlot(day, slot.value)}
                          className={`
                            h-16 rounded-lg border-2 flex items-center justify-center
                            transition-all duration-200
                            ${isEditing ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
                            ${isAvailable 
                              ? 'bg-green-100 border-green-400 hover:bg-green-200' 
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                            }
                          `}
                        >
                          {isAvailable && (
                            <Check className="w-6 h-6 text-green-600" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-6 pt-6 border-t">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-green-100 border-2 border-green-400 flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gray-50 border-2 border-gray-200"></div>
              <span className="text-sm text-gray-600">Not Available</span>
            </div>
          </div>
        </Card>

        {/* Additional Info */}
        <Card className="p-6 mt-6 bg-gradient-to-r from-purple-500 to-blue-600 text-white">
          <h3 className="text-xl mb-2">💡 Pro Tip</h3>
          <p className="opacity-90">
            Students can only book sessions during your available time slots. Keep your schedule updated to maximize bookings!
          </p>
        </Card>
      </div>
    </div>
  );
}