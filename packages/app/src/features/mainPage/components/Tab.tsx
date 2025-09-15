import Button from "@/components/Button";
import type { Icon } from "core/icons";

export default function Tab({
  ref,
  onClick,
  selected,
  icon,
  className,
}: {
  ref?: React.Ref<HTMLButtonElement>;
  onClick?: () => void;
  selected?: boolean;
  icon?: Icon;
  className?: string;
}) {
  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={`${!selected ? "bg-transparent border border-border" : "border border-border"} w-full ${className || ""}`}
      variant="secondary"
      icon={icon}
    ></Button>
  );
}
