
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
        className="w-full border border-input rounded-md p-2 bg-background dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-primary"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </EmployeeFormField>
  );
};
