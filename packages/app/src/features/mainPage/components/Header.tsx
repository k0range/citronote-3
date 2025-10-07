import type { ReactNode } from "react";

export default function Header({ children }: { children?: ReactNode }) {
  return (
    <div
      className={`max-h-11 min-h-11 bg-background-2 border-b border-b-border flex px-3`}
    >
      <div className="w-full flex items-center">{children}</div>
    </div>
  );
}
