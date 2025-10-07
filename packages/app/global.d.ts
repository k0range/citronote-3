import "react";
import type { NativeApi } from "desktop/src/preload";

declare global {
  interface Window {
    api: NativeApi;
  }
}

declare module "react" {
  interface CSSProperties {
    WebkitAppRegion?: "drag" | "no-drag";
  }
}
