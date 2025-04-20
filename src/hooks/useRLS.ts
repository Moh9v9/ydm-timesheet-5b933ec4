
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Database } from "@/integrations/supabase/types";

type TableNames = keyof Database['public']['Tables'];

/**
 * Hook to help debug Row Level Security (RLS) issues
 */
export const useRLSDebug = (tableName: TableNames) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any[]>([]);

  const testRLSAccess = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
        
      if (error) throw error;
      
      setData(data || []);
      return { success: true, data };
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error(`RLS test error for ${tableName}:`, err);
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    testRLSAccess,
    isLoading,
    error,
    data
  };
};
