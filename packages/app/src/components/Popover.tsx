import { Popover as PopoverFrame } from "radix-ui";
import styles from "./Popover.module.css";

function Popover({
  children,
  content,
}: {
  children: React.ReactNode;
  content?: React.ReactNode;
}) {
  return (
    <PopoverFrame.Root modal>
      <PopoverFrame.Trigger asChild>{children}</PopoverFrame.Trigger>
      <PopoverFrame.Portal>
        <PopoverFrame.Content
          className={`${styles.PopoverContent} bg-background-2 border border-border px-1.5 py-1.5 rounded-lg text-color select-none z-10 m-3 -translate-y-6 shadow`}
          sideOffset={5}
          align="start"
        >
          {content}
          <PopoverFrame.Arrow
            className={`${styles.arrowBorder} left-8`}
            width={12}
            height={6}
          />
          <PopoverFrame.Arrow
            className={`${styles.arrowFill}`}
            width={9}
            height={5}
          />
        </PopoverFrame.Content>
      </PopoverFrame.Portal>
    </PopoverFrame.Root>
  );
}

Popover.Close = PopoverFrame.Close;

export default Popover;
