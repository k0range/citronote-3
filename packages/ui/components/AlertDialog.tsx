// TODO: html <dialog> 要素を使うようにする

import { createPortal } from "react-dom";
import { useEffect, useState, useRef } from "react";
import type { Icon as IconType } from "core/icons";
import { Button } from "./Button";
import { Icon } from "./Icon";
import styles from "./AlertDialog.module.css";
import { createRoot } from "react-dom/client";

export interface AlertDialogButton {
  text: string;
  variant?: "primary" | "secondary" | "danger" | "text";
  value: string;
}

export interface AlertDialogProps {
  icon?: IconType;
  title?: string;
  description?: string;
  buttons?: AlertDialogButton[];
  open: boolean;
  onClose: (value: string | null) => void;
}

export function AlertDialog({
  icon,
  title,
  description,
  buttons,
  open,
  onClose,
}: AlertDialogProps) {
  const [visible, setVisible] = useState(open);
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      setVisible(true);
      // ダイアログが開いたら最初のボタンにフォーカス
      setTimeout(() => {
        firstButtonRef.current?.focus();
      }, 50);
    } else {
      // アニメーションの時間分遅らせて unmount
      const timer = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // 表示してないなら null
  if (!visible) return null;

  return createPortal(
    <div className={`fixed top-0 left-0 w-screen h-screen bg-[#00000070] z-50 flex items-center justify-center ${styles.overlay} ${open ? styles.open : styles.close}`} onClick={() => onClose(null)}>
      <div className={`bg-background-2 border border-border rounded-lg min-w-[20rem] max-w-[28rem] min-h-58 py-7 px-6 text-color ${styles.dialog} ${open ? styles.open : styles.close}`} onClick={(e) => e.stopPropagation()}>
        {icon && (
          <Icon
            icon={icon}
            className="w-10 h-10 mx-auto mb-3 opacity-50"
          />
        )}
        { /* enter shortcut */ }
        <h2 className="text-center text-[1.05rem]">{title}</h2>
        {description && (
          <p className="text-center mt-1 mb-5.5 opacity-80 text-[0.95rem]">
            {description}
          </p>
        )}
        <div className="flex flex-col gap-2">
          {buttons?.map((button, index) => (
            <Button
              key={index}
              ref={index === 0 ? firstButtonRef : undefined}
              variant={button.variant || "secondary"}
              className="w-full"
              onClick={() => onClose(button.value)}
            >
              {button.text}
            </Button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

export function showAlertDialog(options: {
  title?: string;
  description?: string;
  icon?: IconType;
  buttons: AlertDialogButton[];
}): Promise<string | null> {
  return new Promise((resolve) => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    // ここで小さいコンポーネントを作って state を管理する
    function DialogWrapper() {
      const [open, setOpen] = useState(true);

      const handleClose = (value: string | null) => {
        setOpen(false);
        setTimeout(() => {
          root.unmount();
          container.remove();
          resolve(value);
        }, 100);
      };

      return (
        <AlertDialog
          open={open}
          title={options.title}
          description={options.description}
          icon={options.icon}
          buttons={options.buttons}
          onClose={handleClose}
        />
      );
    }

    root.render(<DialogWrapper />);
  });
}
