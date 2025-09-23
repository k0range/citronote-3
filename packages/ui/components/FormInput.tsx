import { twMerge } from "tailwind-merge";

export function FormInput({
  className = "",
  wFull,
  placeholder,
  disabled = false,
  value,
  onChange,
}: {
  wFull?: boolean;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <input
      type="text"
      className={twMerge(
        `px-3.5 py-1 rounded-lg ${wFull ? "w-full" : ""} bg-background-2 border border-border text-color`,
        disabled && "opacity-60 cursor-not-allowed",
        className,
      )}
      disabled={disabled}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
    />
  );
}
