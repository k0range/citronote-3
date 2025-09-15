import { notetypeRegistry } from "../notes";
import { builtinNotetypes } from "builtin/notetypes";

export interface InitCoreOptions {
  // プラグインなど予定
}

export async function initCore(options: InitCoreOptions) {
  console.log("[core] buildin/initCore");

  // 標準のノートタイプを登録
  builtinNotetypes.forEach(nt => {
    notetypeRegistry.register(nt);
  });
}
