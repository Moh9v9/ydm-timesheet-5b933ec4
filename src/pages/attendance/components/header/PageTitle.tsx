
import { useLanguage } from "@/contexts/LanguageContext";

const PageTitle = () => {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1 className="text-2xl font-bold">{t('dailyAttendance')}</h1>
      <p className="text-muted-foreground">
        {t('manageAttendance')}
      </p>
    </div>
  );
};

export default PageTitle;
