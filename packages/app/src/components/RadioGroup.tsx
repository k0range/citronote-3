import { InfoIcon } from "lucide-react";
import { RadioGroup as RadioGroupFrame } from "radix-ui";
import { twMerge } from "tailwind-merge";
import Tooltip from "./Tooltip";

export default function RadioGroup({
  className = "",
  value,
  onChange,
  options,
}: {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: { label: React.ReactNode; value: string, disabled?: boolean, info?: string, infoUrl?: string }[];
}) {
  return (
    <RadioGroupFrame.Root
      value={value}
      onValueChange={(val) => onChange && onChange(val)}
      className={twMerge(`flex flex-col gap-1.5`, className)}
    >
      {options.map((opt) => (
        <label key={opt.value} className={twMerge("flex items-center gap-2", opt.disabled ? "opacity-50 cursor-not-allowed" : "")}>
          <RadioGroupFrame.Item
            value={opt.value}
            className={twMerge(
              "w-4.5 h-4.5 rounded-full border border-border bg-background-2 cursor-pointer",
              "radix-state-checked:border-primary radix-state-checked:bg-primary flex items-center justify-center",
              opt.disabled ? "cursor-not-allowed" : "",
            )}
            disabled={opt.disabled}
          >
            <RadioGroupFrame.Indicator
              forceMount
              className="w-2 h-2 rounded-full outline-5 outline-primary data-[state=unchecked]:opacity-0 data-[state=checked]:opacity-100 duration-150"
            />
          </RadioGroupFrame.Item>
          <span className="text-color">{opt.label}</span>
          {opt.info && (
            opt.infoUrl ? (
              <a href={opt.infoUrl} target="_blank" className="cursor-pointer">
                <Tooltip content={opt.info}>
                  <InfoIcon className="h-4 w-4 text-color/50 cursor-pointer" />
                </Tooltip>
              </a>
            ) : (
              <Tooltip content={opt.info}>
                <InfoIcon className="h-4 w-4 text-color/50 cursor-default" />
              </Tooltip>
            )
          )}
        </label>
      ))}
    </RadioGroupFrame.Root>
  );
}
