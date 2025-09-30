export abstract class AppError extends Error {
  abstract code: string;

  /** ユーザー向けにUIで表示してよい短いメッセージ（ただし基本的にメッセージはUI側に置くべき） */
  userMessage?: string;

  /** 開発者・ログ向けの詳細情報（例: ライブラリのスタックやレスポンス） */
  details?: string;

  constructor(message: string, options?: { userMessage?: string; details?: string }) {
    super(message);
    this.userMessage = options?.userMessage;
    this.details = options?.details;
  }
}

export class StringError extends Error {
  code = "STRING_ERROR" as const;
  details?: string;

  constructor(message: string, details?: string) {
    super(message);
    this.details = details;
  }
}
