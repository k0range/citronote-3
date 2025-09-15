import type { icons } from "lucide";

interface LucideIcon {
  type: "lucide";
  name: keyof typeof icons; // Lucideのアイコン名
}
interface SvgIcon {
  type: "svg";
  svg: string; // <svg>タグの中に入る文字列
}
interface ImgIcon {
  type: "img";
  url: string; // 画像URL
}

// 登録が必要なicon
export type RegisteredIcon = SvgIcon | ImgIcon;

export type Icon = LucideIcon | RegisteredIcon;
