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

export type Icon = LucideIcon | SvgIcon | ImgIcon;
