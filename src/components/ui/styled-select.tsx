
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface StyledSelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder: string
  options: {
    value: string
    label: string
  }[]
  label?: string
  className?: string
}

export function StyledSelect({
  value,
  onValueChange,
  placeholder,
  options,
  label,
  className,
}: StyledSelectProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium mb-1 dark:text-gray-200">
          {label}
        </label>
      )}
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger 
          className={cn(
            "w-full transition-colors",
            "dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100",
            "dark:hover:bg-gray-700 dark:focus:ring-2 dark:focus:ring-primary dark:focus:ring-offset-2 dark:focus:ring-offset-background",
            className
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="dark:text-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
