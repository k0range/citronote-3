import React from "react";
import { ContextMenu as CtxMenu } from "radix-ui";

import styles from "./ContextMenu.module.css";
import type { Icon as IconType } from "core/icons";
import Icon from "./Icon";

export type MenuItem = {
  key: string;
  label: React.ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  icon?: IconType;
};

export type ContextMenuProps = {
  items: MenuItem[];
  children: React.ReactNode;
  className?: string;
};

const panelClass =
  "min-w-[10rem] bg-background-2 border border-border px-1.5 py-1.25 rounded-lg text-color select-none z-10 m-3-translate-y-6 shadow";
const itemClass =
  "cursor-pointer rounded-lg flex items-center text-color px-2.5 py-1 w-full text-left duration-200 opacity-80 hover:bg-hover my-0.25";

function ContextMenu({ items, children, className }: ContextMenuProps) {
  return (
    <CtxMenu.Root>
      <CtxMenu.Trigger asChild>
        <div className={className}>{children}</div>
      </CtxMenu.Trigger>

      <CtxMenu.Portal>
        <CtxMenu.Content
          className={`${panelClass} ${styles.ContextMenu}`}
        >
          {items.map((it) => (
            <CtxMenu.Item
              key={it.key}
              className={itemClass}
              onSelect={() => it.onSelect?.()}
              disabled={it.disabled}
            >
              {it.icon ? <Icon icon={it.icon} size={16} className="mr-2.5" /> : null}
              <span className="text-sm">{it.label}</span>
            </CtxMenu.Item>
          ))}
        </CtxMenu.Content>
      </CtxMenu.Portal>
    </CtxMenu.Root>
  );
}

export default ContextMenu;
