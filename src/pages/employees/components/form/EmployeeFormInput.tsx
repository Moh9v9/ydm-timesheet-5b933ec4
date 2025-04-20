
import { EmployeeFormField } from "../EmployeeFormField";

interface EmployeeFormInputProps {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  min?: string;
  className?: string;
}

export const EmployeeFormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required,
  placeholder,
  min,
  className
}: EmployeeFormInputProps) => {
  return (
    <EmployeeFormField 
      label={label} 
      name={name}
      required={required}
      error={error}
    >
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        className={`w-full p-2 border ${error ? 'border-destructive' : 'border-input'} rounded-md 
          bg-background 
          dark:bg-gray-900 
          dark:border-gray-700 
          dark:text-white 
          dark:placeholder-gray-500
          focus:ring-2 
          focus:ring-primary 
          dark:focus:ring-primary/70 
          transition-all 
          duration-300
          ${className}`}
        required={required}
      />
    </EmployeeFormField>
  );
};
