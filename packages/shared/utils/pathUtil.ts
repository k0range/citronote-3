export class PathUtil {
  /**
   * パスを結合
   */
  static join(...parts: string[]): string {
    const raw = parts.join("/");
    return PathUtil.normalize(raw);
  }

  /**
   * パスを正規化
   */
  static normalize(path: string): string {
    // 一旦全部 "/" に揃える
    const unified = path.replace(/\\/g, "/");

    const segments = unified.split("/");
    const stack: string[] = [];

    for (const segment of segments) {
      if (segment === "" || segment === ".") {
        continue;
      }
      if (segment === "..") {
        if (stack.length > 0 && stack[stack.length - 1] !== "..") {
          stack.pop();
        } else {
          stack.push("..");
        }
      } else {
        stack.push(segment);
      }
    }

    let result = stack.join("/");
    if (path.startsWith("/") || path.startsWith("\\")) {
      result = "/" + result;
    }

    // 出力時にseparatorに変換
    return result.replace(/\//g, "/");
  }

  static dirname(path: string): string {
    const normalized = PathUtil.normalize(path);
    const segments = normalized.split("/");
    segments.pop();
    const dir = segments.join("/") || "/";
    return dir.replace(/\//g,"/");
  }

  static basename(path: string): string {
    const normalized = PathUtil.normalize(path);
    const segments = normalized.split("/");
    return segments.pop() || "";
  }

  static extname(path: string): string {
    const base = PathUtil.basename(path);
    const dotIndex = base.lastIndexOf(".");
    return dotIndex >= 0 ? base.slice(dotIndex) : "";
  }
}
