import React from "react";
import { icons as lucideIcons } from "lucide";
import type { IconNode } from "lucide";
import type { ReactElement, SVGProps } from "react";
import type { Icon } from "core/icons";

type IconProps = {
  icon: Icon
  size?: number;
  color?: string;
} & SVGProps<SVGSVGElement>;

function parseSvgString(svgString: string): React.ReactNode[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<svg>${svgString}</svg>`, "image/svg+xml");
  const svg = doc.documentElement;

  function traverse(node: Element): React.ReactNode {
    const children = Array.from(node.children).map(traverse);
    const props: Record<string, unknown> = {};
    for (const attr of node.attributes) {
      props[attr.name === "class" ? "className" : attr.name] = attr.value;
    }
    return React.createElement(node.tagName, props, children.length > 0 ? children : null);
  }

  return Array.from(svg.children).map(traverse);
}


export default function Icon({ icon, size = 24, color = "currentColor", ...props }: IconProps) {
  let svgContent: ReactElement[] | null = null;

  if (icon.type === "lucide") {
    const lucideIcon = lucideIcons[icon.name as keyof typeof lucideIcons] as IconNode | undefined;
    if (!lucideIcon) return null;
    svgContent = lucideIcon.map(([tag, attrs], i) => {
      // SVG のタグを React.createElement で作る
      return React.createElement(tag, { key: i, ...attrs });
    });
  } else if (icon.type === "svg") {
    svgContent = parseSvgString(icon.svg) as ReactElement[];
  }

  return (
    <>
      { icon.type === "lucide" || icon.type === "svg" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          {...props}
        >
          {svgContent}
        </svg>
      ) : null }

      { icon.type === "img" ? (
        <img
          src={icon.url}
          width={size}
          height={size}
        />
      ) : null }
    </>
  );
}
