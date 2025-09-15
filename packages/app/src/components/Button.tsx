import type { Icon as IconType } from "core/icons";
import { twMerge } from "tailwind-merge";

import Icon from "./Icon";

export default function Button({
  ref,
  children,
  onClick,
  className = "",
  variant = "secondary",
  disabled = false,
  icon,
}: {
  ref?: React.Ref<HTMLButtonElement>;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  icon?: IconType;
}) {
  const variantClass =
    variant === "primary"
      ? "bg-primary text-white"
      : variant === "secondary"
        ? "bg-secondary hover:bg-selected duration-150 text-color"
        : variant === "danger"
          ? "bg-red-500"
          : "";

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={twMerge(
        `px-3.5 py-1 rounded-lg ${variantClass} cursor-pointer ${disabled ? "opacity-60 cursor-not-allowed" : ""}`,
        className,
      )}
      disabled={disabled}
    >
      {icon && <Icon icon={icon} className="inline w-4.5" />}
      {children && <span className={icon && "ml-2"}>{children}</span>}
    </button>
  );
}
