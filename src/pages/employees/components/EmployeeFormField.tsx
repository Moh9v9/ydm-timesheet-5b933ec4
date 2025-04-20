
interface EmployeeFormFieldProps {
  label: string;
  name: string;
  required?: boolean;
  children: React.ReactNode;
}

export const EmployeeFormField = ({ label, name, required, children }: EmployeeFormFieldProps) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label} {required && "*"}
      </label>
      {children}
    </div>
  );
};
