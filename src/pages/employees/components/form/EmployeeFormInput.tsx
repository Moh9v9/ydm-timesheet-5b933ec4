
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
        className={`w-full p-3 border text-base rounded-md bg-background
          ${error ? 'border-destructive' : 'border-input'}
          placeholder:text-muted-foreground 
          focus:ring-2 focus:ring-primary
          transition-all duration-300
          outline-none
          dark:bg-[#23263A]
          dark:border-[#3b4261]
          dark:text-[#F1F1F1]
          dark:placeholder-[#C8C8C9]
          dark:focus:border-[#1EAEDB]
          dark:focus:ring-2 dark:focus:ring-[#1EAEDB]
          ${className || ''}
        `}
        required={required}
      />
    </EmployeeFormField>
  );
};
