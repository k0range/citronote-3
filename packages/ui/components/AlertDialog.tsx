import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
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
  text: string;
  description?: string;
  buttons?: AlertDialogButton[];
  open: boolean;
  onClose: (value: string | null) => void;
}

export function AlertDialog({
  icon,
  text,
  description,
  buttons,
  open,
  onClose,
}: AlertDialogProps) {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setVisible(true);
    } else {
      // アニメーションの時間分遅らせて unmount
      const timer = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // 表示してないなら null
  if (!visible) return null;

  return createPortal(
    <div className={`fixed top-0 left-0 w-screen h-screen bg-[#00000070] z-50 flex items-center justify-center ${styles.overlay} ${open ? styles.open : styles.close}`}>
      <div className={`bg-background-2 border border-border rounded-lg min-w-[20rem] max-w-[28rem] min-h-58 py-6 px-5 text-color ${styles.dialog} ${open ? styles.open : styles.close}`}>
        {icon && (
          <Icon
            icon={icon}
            className="w-10 h-10 mx-auto mb-3.5 opacity-50"
          />
        )}
        <h2 className="text-center text-lg opacity-95">{text}</h2>
        {description && (
          <p className="text-center text-xs opacity-70 mt-1.5 mb-5.5">
            {description}
          </p>
        )}
        <div className="flex flex-col gap-2">
          {buttons?.map((button, index) => (
            <Button
              key={index}
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
  text: string;
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
          text={options.text}
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
