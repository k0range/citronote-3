export interface FsEntry {
  /** ノートブックを起点としたファイルやディレクトリのパス */
  path: string;
  /** ファイル名、パスの最後の部分 */
  name: string;
  /** ディレクトリかどうか */
  isDirectory: boolean;
  /** ファイルサイズ（バイト） */
  sizeBytes?: number;
  /** 最終更新日時 */
  lastModified?: Date;
}

export interface NotebookFsMgr {
  /**
   * 指定したパスのファイル、ディレクトリ情報を取得
   * @param path ノートブックを起点としたパス
   */
  stat(path: string): Promise<FsEntry | null>;

  /**
   * 指定したディレクトリの中身をFsEntryとして取得
   * @param path ノートブックを起点としたディレクトリのパス
   */
  readDir(path: string): Promise<FsEntry[]>;

  /**
   * ファイルの内容をUint8Arrayで読み込む
   * @param path ノートブックを起点としたファイルのパス
   */
  readFile(path: string): Promise<Uint8Array>;

  /**
   * ファイルにデータを書き込む。ファイルが存在しない場合は新規作成する。
   * @param path ノートブックを起点としたファイルのパス
   * @param data 書き込むデータ。Uint8Arrayまたはstring
   * @param options 
   */
  writeFile(path: string, data: Uint8Array | string, options?: { recursive?: boolean }): Promise<void>;

  /**
   * ファイルに追記する。ファイルが存在しない場合は新規作成する。
   * @param path ノートブックを起点としたファイルのパス
   * @param data 追記するデータ。Uint8Arrayまたはstring
   */
  //appendFile(path: string, data: Uint8Array | string, options?: { recursive?: boolean }): Promise<void>;

  /**
   * ファイル又はディレクトリを削除する。
   * @param path ノートブックを起点としたファイル又はディレクトリのパス
   * @param options ディレクトリを削除する場合、子がある場合に再帰的に削除するかどうか
   */
  delete(path: string, options?: { recursive?: boolean }): Promise<void>;

  /**
   * ディレクトリを作成
   * @param path ノートブックを起点としたディレクトリのパス
   * @param options 親ディレクトリも自動作成するかどうか
   */
  mkdir(path: string, options?: { recursive?: boolean }): Promise<void>;

  /**
   * ファイル又はディレクトリを移動または名前変更
   * @param oldPath 元のパス
   * @param newPath 新しいパス
   */
  rename(oldPath: string, newPath: string): Promise<void>;

  // createReadStream(path: string): ReadableStream<Uint8Array>;
  // createWriteStream(path: string): WritableStream<Uint8Array>;
}
export type NotebookFsMgrClass = new (locationHandle: NotebookLocationHandle) => NotebookFsMgr;

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

export interface NotebooksStorage {
  getNotebook: (id: string) => Promise<NotebookMetadata | null>;
  fetchNotebooks: () => Promise<NotebookMetadata[]>;
  getNotebookAtLocation: (location: NotebookLocationHandle) => Promise<NotebookMetadata | null>;
  addNotebook: (notebook: NotebookMetadata) => Promise<void>;
  removeNotebook: (id: string) => Promise<void>;
  updateNotebook: (notebook: NotebookMetadata) => Promise<void>;
}

export interface Folder {
  name: string;
  path: string;
  iconUrl?: string; // blob or base64, etc url
  childrenExists: boolean;
}
