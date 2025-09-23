import { twMerge } from "tailwind-merge";

export function Label({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={twMerge("block mt-5 mb-1 text-sm opacity-80", className)}>
      {children}
    </div>
  );
}
