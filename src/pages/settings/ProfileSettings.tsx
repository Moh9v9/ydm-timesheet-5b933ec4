
import ProfileForm from "./components/ProfileForm";
import TimeZoneSettingsSection from "./components/TimeZoneSettingsSection";
import { useLanguage } from "@/contexts/LanguageContext";

const ProfileSettings = () => {
  const { t } = useLanguage();
  
  return (
    <div>
      <h2 className="text-xl font-medium mb-6">{t('profileSettings')}</h2>
      <TimeZoneSettingsSection />
      <ProfileForm />
    </div>
  );
};

export default ProfileSettings;
