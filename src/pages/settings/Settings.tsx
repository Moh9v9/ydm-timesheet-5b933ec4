
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { User, Settings as SettingsIcon } from "lucide-react";
import ProfileSettings from "./ProfileSettings";
import UsersSettings from "./UsersSettings";
import { useLanguage } from "@/contexts/LanguageContext";

type TabType = "profile" | "users";

const Settings = () => {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">{t('settings')}</h1>
        <p className="text-muted-foreground">
          {t('manageProfileSettings')}
        </p>
      </div>
      
      <div className="bg-card shadow-sm rounded-lg border overflow-hidden">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-3 text-sm font-medium flex items-center space-x-2 ${
              activeTab === "profile" 
                ? "border-b-2 border-primary text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <User size={16} />
            <span>{t('profile')}</span>
          </button>
          
          {isAdmin && (
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-3 text-sm font-medium flex items-center space-x-2 ${
                activeTab === "users" 
                  ? "border-b-2 border-primary text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <SettingsIcon size={16} />
              <span>{t('users')}</span>
            </button>
          )}
        </div>
        
        <div className="p-6">
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "users" && isAdmin && <UsersSettings />}
        </div>
      </div>
    </div>
  );
};

export default Settings;
