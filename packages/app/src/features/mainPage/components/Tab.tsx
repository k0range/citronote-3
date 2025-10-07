import { Button, Icon } from "ui";
import type { Icon as IconType } from "core/icons";

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
  icon?: IconType;
  className?: string;
}) {
  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={`${!selected ? "bg-transparent border border-border" : "border border-border"} w-full ${className || ""}`}
      variant="secondary"
    >
      {icon && <Icon icon={icon} className="inline w-4.5" />}
    </Button>
  );
}
