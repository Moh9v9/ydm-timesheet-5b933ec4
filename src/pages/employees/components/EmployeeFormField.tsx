
interface EmployeeFormFieldProps {
  label: string;
  name: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}

export const EmployeeFormField = ({ label, name, required, children, error }: EmployeeFormFieldProps) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label} {required && "*"}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-sm text-destructive dark:text-[#ea384c] font-semibold">{error}</p>
      )}
    </div>
  );
};
