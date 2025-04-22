
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const RolePermissionsCard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="mt-8 border rounded-md p-4">
      <h3 className="font-medium mb-3">{t('roleAndPermissions')}</h3>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">{t('role')}:</span>
          <span className="ml-2 font-medium capitalize">{t(user?.role || '')}</span>
        </div>
        
        <div>
          <span className="text-muted-foreground">{t('viewEmployees')}:</span>
          <span className="ml-2 font-medium">
            {user?.permissions.employees.view ? t('yes') : t('no')}
          </span>
        </div>
        
        <div>
          <span className="text-muted-foreground">{t('editEmployees')}:</span>
          <span className="ml-2 font-medium">
            {user?.permissions.employees.edit ? t('yes') : t('no')}
          </span>
        </div>
        
        <div>
          <span className="text-muted-foreground">{t('deleteEmployees')}:</span>
          <span className="ml-2 font-medium">
            {user?.permissions.employees.delete ? t('yes') : t('no')}
          </span>
        </div>

        <div>
          <span className="text-muted-foreground">{t('viewAttendance')}:</span>
          <span className="ml-2 font-medium">
            {user?.permissions.attendees.view ? t('yes') : t('no')}
          </span>
        </div>

        <div>
          <span className="text-muted-foreground">{t('editAttendance')}:</span>
          <span className="ml-2 font-medium">
            {user?.permissions.attendees.edit ? t('yes') : t('no')}
          </span>
        </div>

        <div>
          <span className="text-muted-foreground">{t('exportReports')}:</span>
          <span className="ml-2 font-medium">
            {user?.permissions.export ? t('yes') : t('no')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RolePermissionsCard;
