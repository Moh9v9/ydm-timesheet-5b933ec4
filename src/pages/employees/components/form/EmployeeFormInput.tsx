
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

          dark:bg-[#23263A]                   /* deep navy bg */
          dark:border-[#8E9196]               /* lighter neutral gray border */
          dark:text-[#F1F1F1]                 /* almost white text */
          dark:placeholder-[#D6BCFA]          /* light purple placeholder */
          dark:focus:border-[#1EAEDB]         /* bright blue focus border */
          dark:focus:ring-2 dark:focus:ring-[#1EAEDB]
          ${className || ''}
        `}
        required={required}
        style={{
          // fallback for softer box shadow focus in dark mode
          boxShadow:
            "var(--tw-ring-inset) 0 0 0 calc(2px) #1EAEDB40",
        }}
        autoComplete="off"
      />
    </EmployeeFormField>
  );
};

