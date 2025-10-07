import { Tooltip as TooltipFrame } from "radix-ui";
import styles from "./Tooltip.module.css";

export function Tooltip({
  content,
  children,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
}) {
  return (
    <TooltipFrame.Provider delayDuration={0} skipDelayDuration={0}>
      <TooltipFrame.Root disableHoverableContent={true}>
        <TooltipFrame.Trigger asChild>{children}</TooltipFrame.Trigger>
        <TooltipFrame.Portal>
          <TooltipFrame.Content
            sideOffset={-8}
            className={`${styles.TooltipContent} text-[#ffffffdf] text-sm whitespace-nowrap select-none z-10 m-3`}
          >
            {content}
            {/* 重ねて枠を作る */}
            <TooltipFrame.Arrow
              className={styles.arrowBorder}
              width={12}
              height={6}
            />
            <TooltipFrame.Arrow
              className={styles.arrowFill}
              width={9}
              height={5}
            />
          </TooltipFrame.Content>
        </TooltipFrame.Portal>
      </TooltipFrame.Root>
    </TooltipFrame.Provider>
  );
}
