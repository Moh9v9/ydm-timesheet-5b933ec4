
import { EmployeeFormField } from "../EmployeeFormField";

interface EmployeeFormSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  error?: string;
}

export const EmployeeFormSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  error
}: EmployeeFormSelectProps) => {
  return (
    <EmployeeFormField 
      label={label} 
      name={name}
      error={error}
    >
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full border rounded-md p-3 bg-background
          text-base
          ${error ? 'border-destructive' : 'border-input'}
          focus:ring-2 focus:ring-primary
          transition-all duration-300
          outline-none
          placeholder:text-muted-foreground

          dark:bg-[#23263A]
          dark:border-[#8E9196]
          dark:text-[#F1F1F1]
          dark:placeholder-[#D6BCFA]
          dark:focus:border-[#1EAEDB]
          dark:focus:ring-2 dark:focus:ring-[#1EAEDB]
        `}
        style={{
          boxShadow:
            "var(--tw-ring-inset) 0 0 0 calc(2px) #1EAEDB40"
        }}
      >
        {options.map(option => (
          <option 
            key={option.value}
            value={option.value}
            className="bg-background dark:bg-[#23263A] dark:text-[#F1F1F1]"
          >
            {option.label}
          </option>
        ))}
      </select>
    </EmployeeFormField>
  );
};
