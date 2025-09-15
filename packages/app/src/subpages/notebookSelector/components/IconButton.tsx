import Tooltip from "@/components/Tooltip";

export default function IconButton({
  icon: Icon,
  onClick,
  tooltip,
}: {
  icon: React.ElementType;
  onClick: () => void;
  tooltip: string;
}) {
  return (
    <Tooltip content={tooltip}>
      <button
        className="opacity-35 hover:opacity-60 transition-opacity duration-200 cursor-pointer"
        onClick={onClick}
      >
        <Icon size={18} />
      </button>
    </Tooltip>
  );
}
