
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotification } from "@/components/ui/notification";

const ProfileSettings = () => {
  const { user, updateProfile } = useAuth();
  const { success, error, NotificationContainer } = useNotification();
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.email) {
      error("Name and email are required");
      return;
    }
    
    if (formData.newPassword && formData.newPassword.length < 6) {
      error("Password must be at least 6 characters long");
      return;
    }
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      error("New passwords do not match");
      return;
    }
    
    if (formData.newPassword && !formData.currentPassword) {
      error("Current password is required to change your password");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare data to update
      const updateData: any = {
        fullName: formData.fullName,
        email: formData.email,
      };
      
      // Only include password if it's being changed
      if (formData.newPassword) {
        // In a real app, we would verify the current password first
        if (formData.currentPassword !== user?.password) {
          throw new Error("Current password is incorrect");
        }
        updateData.password = formData.newPassword;
      }
      
      await updateProfile(updateData);
      success("Profile updated successfully");
      
      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile";
      error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <NotificationContainer />
      
      <h2 className="text-xl font-medium mb-6">Profile Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-2 border border-input rounded-md"
            required
          />
        </div>
        
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-input rounded-md"
            required
          />
        </div>
        
        {/* Divider */}
        <hr className="my-6" />
        
        <h3 className="text-md font-medium mb-4">Change Password</h3>
        
        {/* Current Password */}
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className="w-full p-2 border border-input rounded-md"
          />
        </div>
        
        {/* New Password */}
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full p-2 border border-input rounded-md"
          />
        </div>
        
        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border border-input rounded-md"
          />
        </div>
        
        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
      
      {/* Role & Permissions (Non-editable) */}
      <div className="mt-8 border rounded-md p-4">
        <h3 className="font-medium mb-3">Your Role & Permissions</h3>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Role:</span>
            <span className="ml-2 font-medium capitalize">{user?.role}</span>
          </div>
          
          <div>
            <span className="text-muted-foreground">View Permission:</span>
            <span className="ml-2 font-medium">
              {user?.permissions.view ? "Yes" : "No"}
            </span>
          </div>
          
          <div>
            <span className="text-muted-foreground">Edit Permission:</span>
            <span className="ml-2 font-medium">
              {user?.permissions.edit ? "Yes" : "No"}
            </span>
          </div>
          
          <div>
            <span className="text-muted-foreground">Delete Permission:</span>
            <span className="ml-2 font-medium">
              {user?.permissions.delete ? "Yes" : "No"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
