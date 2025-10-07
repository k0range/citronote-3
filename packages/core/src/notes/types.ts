import type React from "react";

import type { Icon } from "@/icons/types";
import type { NotebookFsMgr } from "../notebooks/types";
import type { BaseNote } from "./BaseNote";

export interface NoteMetadata {
  // アプリ内で一時的に扱うためのメタデータ
  name: string;
  path: string;
  notetype?: NotetypeInfo; // Notetypeがない = unknown
  excerpt?: string; // ノートの抜粋（最初の数文字など）。未設定ならundefined
  extLabel?: string;
}

export interface NoteExtra {
  // フロントマターや隣のextraファイルなどに保存する、CTRN独自の追加情報
  pinned?: boolean; // ピン留めされているか
}

export interface Notetype {
  info: NotetypeInfo;
  noteClass: NoteClassType;
  template?: string; // ファイル作成時の内容の初期値
  editor: NoteEditor
}

export interface NotetypeInfo {
  // TranslationKey!!
  id: string; // "scrap", "task", "plugin:super-note"
  mainExt?: string; // そのノートタイプのメインの拡張子（例：Markdown=.md、Scrap=.ctrnscrap）
  addtionalExts?: string[]; // 追加でそのノートタイプとしてエディタで開ける拡張子。一覧では拡張子のバッジがつく。
  ui: NotetypeUIInfo;
}
export interface NotetypeUIInfo {
  nameKey: string; // i18n key for displayName
  fallbackName?: string;
  // displayName: string;
  // transitionkey pLUGIN!!!!!!! peti smata da!! soso nda fe1
  color?: string;
  icon: Icon;
}

export interface NoteEditorContext {
  updateMetadata: (patch: Partial<NoteMetadata>) => void;
}
export interface NoteEditorProps {
  note: BaseNote;
  ctx: NoteEditorContext;
}
export interface NoteEditor {
  [platform: string]: {
    component: React.ComponentType<NoteEditorProps>;
    // useContainer: boolean; // コンテナの中にcomponentを入れるか、自力でやるか
    // scrollAll: boolean; // エディタ部分全体をスクロール可能にするか（true）。エディタ部分の高さをコンテナに合わせて、エディタ内でスクロールさせるか（false）
  };
}

export type NoteClassType = new (
  metadata: NoteMetadata,
  fsMgr: NotebookFsMgr,
) => BaseNote;
