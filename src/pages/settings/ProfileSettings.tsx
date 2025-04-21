
import ProfileForm from "./components/ProfileForm";
import TimeZoneSettingsSection from "./components/TimeZoneSettingsSection";

const ProfileSettings = () => {
  return (
    <div>
      <h2 className="text-xl font-medium mb-6">Profile Settings</h2>
      <TimeZoneSettingsSection />
      <ProfileForm />
    </div>
  );
};

export default ProfileSettings;
