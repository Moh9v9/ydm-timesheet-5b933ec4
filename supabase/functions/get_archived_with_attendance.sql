
-- This function returns archived employees who have attendance records for a given date
CREATE OR REPLACE FUNCTION public.get_archived_with_attendance(selected_date date)
RETURNS SETOF public.employees
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT DISTINCT e.*
  FROM public.employees e
  JOIN public.attendance_records ar ON e.id = ar.employee_uuid
  WHERE e.status = 'Archived'
  AND ar.date = selected_date;
$$;
