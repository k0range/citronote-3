import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { markdownTags } from "@prosemark/core";

export const baseSyntaxHighlighting = syntaxHighlighting(HighlightStyle.define([
  {
    tag: markdownTags.headerMark,
    fontWeight: "bold",
  },
  {
    tag: tags.strong,
    fontWeight: "bold",
  },
  {
    tag: tags.emphasis,
    fontStyle: "italic",
  },
  {
    tag: tags.strikethrough,
    textDecoration: "line-through",
  },
  {
    tag: tags.meta,
    color: "var(--color-meta)",
  },
  {
    tag: tags.comment,
    color: "var(--color-comment)",
  }
]))
