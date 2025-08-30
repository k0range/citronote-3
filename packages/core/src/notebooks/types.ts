export interface FsEntry {
  kind: "file" | "directory";
  name: string;
  path: string; // notebook ルートからのパス
  children?: FsEntry[]; // kind === "directory" の場合のみ存在
}

export interface NotebookFsMgr {
  root(): Promise<FsEntry>;
  readDir(path: string): Promise<FsEntry[]>; // 1階層だけ
  mkdir(path: string): Promise<void>;
  readFile(path: string): Promise<string>;
  readFileBinary(path: string): Promise<ArrayBuffer>;
  writeFile(path: string, data: string | ArrayBuffer): Promise<void>;
  remove(path: string): Promise<void>;
}

export interface Folder {
  name: string;
  path: string;
  iconUrl?: string; // blob or base64, etc url
  children?: Folder[];
}

export interface NotebookMetadata {
  id: string;
  name: string;
  iconUrl?: string; // blob or base64, etc url
  location: "local" | "cloud"; // DIされたローカルFSプロバイダと、Cloudプロバイダ等の分岐に使う
  locationHandle: NotebookLocationHandle; // 主に分岐した先のプロバイダや、UI上での表示などに使われる
}

export type NotebookLocationHandle =
  | { kind: "browser"; handle: FileSystemDirectoryHandle }
  | { kind: "electron"; path: string }

export interface NotebookStorage {
  getNotebook: (id: string) => Promise<NotebookMetadata | null>;
  fetchNotebooks: () => Promise<NotebookMetadata[]>;
  addNotebook: (notebook: NotebookMetadata) => Promise<void>;
  removeNotebook: (id: string) => Promise<void>;
  updateNotebook: (notebook: NotebookMetadata) => Promise<void>;
}
