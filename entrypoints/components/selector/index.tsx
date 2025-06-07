import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Selector = ({
    className,
    placeholder,
    options,
    onChange,
    value,
}: {
    className?: string;
    placeholder?: string;
    options: {
        value: string;
        label: string;
    }[];
    onChange: (value: string) => void;
    value: string;
}) => {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default Selector;
