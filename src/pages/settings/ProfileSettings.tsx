
import ProfileForm from "./components/ProfileForm";
import RolePermissionsCard from "./components/RolePermissionsCard";

const ProfileSettings = () => {
  return (
    <div>
      <h2 className="text-xl font-medium mb-6">Profile Settings</h2>
      <ProfileForm />
      <RolePermissionsCard />
    </div>
  );
};

export default ProfileSettings;
