import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from './ui/select';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';

const EditProfileModal = ({ isOpen, onClose, onUpdate, _userData }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    location: '',
    bloodType: '',
    chronicConditions: '',
    allergies: '',
  });

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // ✅ Pre-fill form when _userData changes
  useEffect(() => {
    if (_userData) {
      setFormData({
        fullName: _userData.fullName || '',
        phone: _userData.phone || '',
        gender: _userData.gender || '',
        dateOfBirth: _userData.dateOfBirth
          ? new Date(_userData.dateOfBirth).toISOString().substring(0, 10)
          : '',
        location: _userData.location || '',
        bloodType: _userData.bloodType || '',
        chronicConditions: Array.isArray(_userData.chronicConditions)
          ? _userData.chronicConditions.join(', ')
          : '',
        allergies: Array.isArray(_userData.allergies)
          ? _userData.allergies.join(', ')
          : '',
      });
    }
  }, [_userData]);

  // ✅ Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fullName = formData.fullName.trim();
    const nameParts = fullName.split(' ');

    if (nameParts.length < 2) {
      toast({
        title: '⚠️ Full Name Required',
        description: 'Please enter both first and last name.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    const updatedData = {
      fullName,
      firstName,
      lastName,
      phone: formData.phone,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      location: formData.location,
      bloodType: formData.bloodType,
      chronicConditions: formData.chronicConditions
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      allergies: formData.allergies
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error('Failed to update profile');

      onUpdate(updatedData); // this will close modal & refresh
    } catch (error) {
      toast({
        title: '❌ Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => onClose();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass-card max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                  <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                type="date"
                id="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              placeholder="City, State"
            />
          </div>

          <div>
            <Label htmlFor="bloodType">Blood Type</Label>
            <Select
              value={formData.bloodType}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, bloodType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select blood type" />
              </SelectTrigger>
              <SelectContent>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bt) => (
                  <SelectItem key={bt} value={bt}>
                    {bt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="chronicConditions">Chronic Conditions</Label>
            <Textarea
              id="chronicConditions"
              value={formData.chronicConditions}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, chronicConditions: e.target.value }))
              }
              placeholder="e.g. Diabetes, Hypertension"
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple with commas</p>
          </div>

          <div>
            <Label htmlFor="allergies">Allergies</Label>
            <Textarea
              id="allergies"
              value={formData.allergies}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, allergies: e.target.value }))
              }
              placeholder="e.g. Dust, Penicillin"
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple with commas</p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-healora-primary text-white" disabled={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
