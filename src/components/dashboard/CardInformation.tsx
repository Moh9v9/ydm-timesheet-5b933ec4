
import { User, UserCheck, UserX } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { SponsorshipType } from "@/lib/types";

interface CardInformationProps {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  sponsorshipBreakdown: Record<SponsorshipType, number>;
  presentBreakdown: Record<SponsorshipType, number>;
  absentBreakdown: Record<SponsorshipType, number>;
  isLoading?: boolean;
}

export const CardInformation = ({
  totalEmployees,
  presentToday,
  absentToday,
  sponsorshipBreakdown,
  presentBreakdown,
  absentBreakdown,
  isLoading = false,
}: CardInformationProps) => {
  const { t } = useLanguage();

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-4"
      style={{ 
        backgroundColor: "transparent", 
        background: "none" 
      }}
    >
      <StatsCard
        icon={User}
        title={t('totalEmployees')}
        value={totalEmployees}
        colorClass="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
        isLoading={isLoading}
        breakdown={sponsorshipBreakdown}
      />
      <StatsCard
        icon={UserCheck}
        title={t('totalPresent')}
        value={presentToday}
        colorClass="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
        isLoading={isLoading}
        breakdown={presentBreakdown}
      />
      <StatsCard
        icon={UserX}
        title={t('totalAbsent')}
        value={absentToday}
        colorClass="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400"
        isLoading={isLoading}
        breakdown={absentBreakdown}
      />
    </div>
  );
};
