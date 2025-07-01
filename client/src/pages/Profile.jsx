import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { User, MapPin, Heart, Shield, Edit } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import EditProfileModal from "../components/EditProfileModal";
import { useAuth } from "../context/useAuth";
import api from "../services/api";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();
  const { setUser } = useAuth();

  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get("/user/profile");
      const user = res.data;
      const fullName =
        user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim();

      setUserData({
        fullName: fullName || "Unknown",
        email: user.email || "Not available",
        phone: user.phone || "Not available",
        gender: user.gender || "Not specified",
        dateOfBirth: user.dateOfBirth || "Not specified",
        location: user.location || "Not specified",
        bloodType: user.bloodType || "Not specified",
        chronicConditions: user.chronicConditions || [],
        allergies: user.allergies || [],
      });

      setUser((prev) => ({
        ...prev,
        ...user,
      }));
    } catch {
      toast({
        title: "Error",
        description: "Failed to load your profile. Please try again later.",
        variant: "destructive",
      });
    }
  }, [toast, setUser]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ✅ UPDATED: only refresh and close the modal, no API call
  const handleUpdateProfile = () => {
    fetchProfile();
    setIsEditModalOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "Not specified") return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!userData) {
    return (
      <div className="text-center text-gray-500 py-10">Loading profile...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-healora-background via-blue-50 to-healora-accent/20 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-healora-primary to-healora-accent bg-clip-text text-transparent mb-2">
            My Profile
          </h1>
          <p className="text-gray-600">
            Manage your healthcare information and account settings
          </p>
        </div>

        <Card className="glass-card border-0 shadow-2xl">
          <CardContent className="p-8 text-center">
            <Avatar className="w-32 h-32 mx-auto mb-4 ring-4 ring-white shadow-xl">
              <AvatarFallback className="bg-gradient-to-br from-healora-primary to-healora-accent text-white text-3xl">
                <User className="w-16 h-16" />
              </AvatarFallback>
            </Avatar>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {userData.fullName}
            </h2>
            <p className="text-healora-primary font-medium text-lg">
              {userData.email}
            </p>
            <Button
              onClick={() => setIsEditModalOpen(true)}
              className="mt-6 px-6 py-2 bg-healora-primary text-white rounded hover:bg-healora-primary/80"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 shadow-xl">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Medical Info
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
              <p>
                <MapPin className="inline w-4 h-4 mr-2 text-healora-accent" />
                Location: {userData.location}
              </p>
              <p>
                <Heart className="inline w-4 h-4 mr-2 text-healora-accent" />
                Blood Type: {userData.bloodType}
              </p>
              <p>
                <User className="inline w-4 h-4 mr-2 text-healora-accent" />
                Gender: {userData.gender}
              </p>
              <p>
                <Shield className="inline w-4 h-4 mr-2 text-healora-accent" />
                Date of Birth: {formatDate(userData.dateOfBirth)}
              </p>
            </div>

            <div className="mt-6">
              <p className="font-medium mb-1">Chronic Conditions:</p>
              {userData.chronicConditions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userData.chronicConditions.map((c, i) => (
                    <Badge key={i} variant="secondary">
                      {c}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">None</p>
              )}

              <p className="font-medium mt-4 mb-1">Allergies:</p>
              {userData.allergies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userData.allergies.map((a, i) => (
                    <Badge key={i} variant="secondary">
                      {a}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">None</p>
              )}
            </div>
          </CardContent>
        </Card>

        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdateProfile}
          userData={userData}
        />
      </div>
    </div>
  );
};

export default Profile;
