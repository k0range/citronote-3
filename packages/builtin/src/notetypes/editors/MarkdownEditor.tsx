import styles from "./MarkdownEditor.module.css";

import { useState, useEffect, useMemo } from "react";
import { MarkdownNoteClass } from "../builtinNotetype";

import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { placeholder, ViewUpdate } from "@codemirror/view";

import { NoteEditorProps } from "core/notes";

import {
  prosemarkBasicSetup,
  prosemarkBaseThemeSetup,
  prosemarkMarkdownSyntaxExtensions,
} from '@prosemark/core';

import { markdown } from '@codemirror/lang-markdown';
import { GFM } from '@lezer/markdown';

// 仮置き、いずれutilsなどに収納
const debounce = <T extends (...args: any[]) => unknown>(
  callback: T,
  delay = 250,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => callback(...args), delay)
  }
}

export default function MarkdownEditor({ note, ctx }: NoteEditorProps) {
  if (!(note instanceof MarkdownNoteClass)) {
    throw new Error("Invalid note type for MarkdownEditor");
  }

  const theme = EditorView.theme({
    "&": {
      height: "100%",
      maxHeight: "100%",
      color: "--var(--theme-color)",
      backgroundColor: "transparent",
      fontFamily: "inherit",
      boxSizing: "border-box",
    },
    ".cm-content": {
      fontFamily: "inherit",
      fontSize: "16px",
      margin: "0 auto"
    },
    ".cm-scroller": {
      fontFamily: "inherit",
      //overflowX: "auto", // 横スクロール有効化
      overflowY: "auto",
      paddingBottom: "5rem",
      display: "grid !important",
    },
    ".cm-line": {
      minWidth: "100%",
      padding: 0,
    },
    ".cm-gutters": {
      fontFamily: "inherit",
      backgroundColor: "var(--theme-background-0)",
      pointerEvents: "none",
      zIndex: 10,
    },
    ".cm-gutter": {
      width: "100%",
      textAlign: "right",
      fontSize: "16px",
      opacity: 0.5,
    }
  }, { dark: true });

  const extensions = [
    // Adds support for the Markdown language
    markdown({
      // adds support for standard syntax highlighting inside code fences
      extensions: [
        // GitHub Flavored Markdown (support for autolinks, strikethroughs)
        GFM,
        // additional parsing tags for existing markdown features, backslash escapes, emojis
        prosemarkMarkdownSyntaxExtensions,
      ]
    }),
    // Basic prosemark extensions
    prosemarkBasicSetup(),
    // Theme extensions
    prosemarkBaseThemeSetup(),
    placeholder("Start writing..."),
  ]

  const [content, setContent] = useState((note as any).content || "");
  
  useEffect(() => {
    setContent((note as any).content || "");
  }, [note]);

  const debouncedSave = useMemo(
    () =>
      debounce(async (value: string) => {
        await note.writeContent(value);
        ctx.updateMetadata({ excerpt: await note.getExcerpt() });
      }, 300),
    [note]
  );

  const handleChange = (value: string, viewUpdate: ViewUpdate) => {
    setContent(value);
    debouncedSave(value);
  };

  return (
    <>
      <CodeMirror
        basicSetup={false}
        value={content}
        extensions={[
          ...extensions
        ]}
        theme={theme}
        onChange={handleChange}
        className={styles.mdEditor}
      />
    </>
  );
}
