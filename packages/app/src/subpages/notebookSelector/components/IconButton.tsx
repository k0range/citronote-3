import { Tooltip } from "ui";

export default function IconButton({
  icon: Icon,
  onClick,
  tooltip,
}: {
  icon: React.ComponentType<{ size?: number, className?: string }>;
  onClick: () => void;
  tooltip: string;
}) {
  return (
    <Tooltip content={tooltip}>
      <button
        type="button"
        aria-label={tooltip}
        title={tooltip}
        className="opacity-35 hover:opacity-60 transition-opacity duration-200 cursor-pointer"
        onClick={onClick}
      >
        <Icon size={18} />
      </button>
    </Tooltip>
  );
}
