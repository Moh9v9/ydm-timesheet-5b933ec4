
import { useLanguage } from "@/contexts/LanguageContext";

const PageTitle = () => {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1 className="text-2xl font-bold">{t('dashboard')}</h1>
      <p className="text-muted-foreground">
        {t('manageProfileSettings')}
      </p>
    </div>
  );
};

export default PageTitle;
