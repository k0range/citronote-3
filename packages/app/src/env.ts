export type Platform = "electron" | "browser";

export interface AppEnv {
  platform: Platform;
  isPortable: boolean;
  version: string;
}

declare const __APP_PLATFORM__: Platform;
declare const __APP_IS_PORTABLE__: boolean;
declare const __APP_VERSION__: string;

export const appEnv: AppEnv = {
  platform: __APP_PLATFORM__, // 'electron' | 'browser'
  isPortable: __APP_IS_PORTABLE__, // boolean
  version: __APP_VERSION__,
};
