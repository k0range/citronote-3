import type { Icon as IconType } from "core/icons";
import { Icon } from "ui";

export default function HeaderIconButton({ icon, onClick, ref }: {
  icon: IconType,
  onClick?: () => void,
  ref?: React.Ref<HTMLButtonElement>,
}) {
  return (
    <button className="group hover:bg-selected transition-colors duration-150 p-1.25 cursor-pointer rounded-full" onClick={onClick} ref={ref}>
      <Icon icon={icon} className="h-5 w-5 text-color opacity-70 group-hover:opacity-80 transition-colors duration-150" />
    </button>
  )
}
