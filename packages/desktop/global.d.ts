import "react";
import type { NativeApi } from "./src/preload";

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
