import { useEffect, useState } from "react";

import { SimpleIcon } from "ui";

export default function Titlebar({
  icon = true,
  border = true,
  title,
}: {
  icon?: boolean;
  border?: boolean;
  title?: string;
}) {
  const [focused, setFocused] = useState(true);

  useEffect(() => {
    window.api.onWindowFocusChanged((isFocused) => {
      setFocused(isFocused);
    });
  }, []);

  return (
    <div
      className={`top-0 left-0 w-screen min-h-[31px] h-[31px] py-[5px] px-2.5 flex gap-2 bg-background-1 z-999 ${border && "border-b border-b-border"}`}
      style={{ WebkitAppRegion: "drag" }}
    >
      {icon && (
        <SimpleIcon className={`text-color h-3.75 w-3 translate-y-0.75 ${focused ? "opacity-90" : "opacity-60"}`} />
      )}
      {title && (
        <div
          className={`text-xs mt-0.5 text-color ${focused ? "opacity-85" : "opacity-60"}`}
        >
          {title}
        </div>
      )}
    </div>
  );
}
