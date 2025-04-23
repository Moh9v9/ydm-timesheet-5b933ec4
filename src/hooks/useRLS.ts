
import { useState } from "react";
import { toast } from "sonner";

/**
 * This hook was previously used for Supabase RLS debugging.
 * Since we've removed Supabase, we'll keep a simplified version
 * for backward compatibility.
 */
export const useRLSDebug = (tableName: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any[]>([]);

  const testRLSAccess = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Since Supabase is removed, this is a no-op function
      setData([]);
      toast.info(`RLS testing is not available - Supabase has been removed`);
      return { success: true, data: [] };
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      toast.error(`RLS test failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
