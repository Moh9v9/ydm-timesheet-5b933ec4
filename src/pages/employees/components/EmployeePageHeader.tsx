
import { RefreshCw, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface EmployeePageHeaderProps {
  onRefresh: () => void;
  onAddNew: () => void;
  loading: boolean;
}

export const EmployeePageHeader = ({ onRefresh, onAddNew, loading }: EmployeePageHeaderProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const canEdit = user?.permissions.employees.edit;

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center dark:border-gray-800/50">
      <div>
        <h1 className="text-2xl font-bold text-foreground dark:text-gray-100">{t('employees')}</h1>
        <p className="text-muted-foreground dark:text-gray-400">
          {t('manageProfileSettings')}
        </p>
      </div>
      <div className="flex gap-2 mt-4 md:mt-0">
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-secondary text-secondary-foreground dark:bg-gray-800 dark:text-gray-200 rounded-md flex items-center hover:bg-secondary/90 dark:hover:bg-gray-700 transition-colors"
          disabled={loading}
        >
          <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''} dark:text-gray-300`} />
          {t('refresh')}
        </button>
        
        {canEdit && (
          <button
            onClick={onAddNew}
            className="px-4 py-2 bg-primary text-white dark:bg-primary/80 dark:text-white rounded-md flex items-center hover:bg-primary/90 dark:hover:bg-primary/70 transition-colors"
          >
            <Plus size={16} className="mr-2 dark:text-gray-200" />
            {t('add')} {t('employee')}
          </button>
        )}
      </div>
    </div>
  );
};
