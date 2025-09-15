export default function MenuActionButton({
  icon: Icon,
  label,
  onClick,
  className = "",
}: {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      className={`cursor-pointer flex items-center text-color px-2.25 py-1 w-full text-left duration-200 opacity-50 hover:opacity-65 ${className}`}
      onClick={onClick}
    >
      <Icon className="mr-3 h-4 w-4" />
      <span className="text-sm">{label}</span>
    </button>
  );
}
