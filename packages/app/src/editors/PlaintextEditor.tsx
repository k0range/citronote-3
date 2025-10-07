import styles from "./PlaintextEditor.module.css";

import { useState, useEffect, useMemo } from "react";
import { PlaintextNoteClass } from "core/builtin/notetypes";

import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { highlightActiveLine, highlightActiveLineGutter, lineNumbers } from "@codemirror/view";

import { BaseNote, type NoteEditorProps } from "core/notes";

// 仮置き、いずれutilsなどに収納
const debounce = <T extends (...args: any[]) => unknown>( // eslint-disable-line @typescript-eslint/no-explicit-any
  callback: T,
  delay = 250,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => callback(...args), delay)
  }
}

function isPlaintext(note: BaseNote): note is PlaintextNoteClass {
  return note.__notetype === "plaintext";
}

export default function PlaintextEditor({ note, ctx }: NoteEditorProps) {
  if (!isPlaintext(note)) {
    throw new Error("Invalid note type for PlaintextEditor");
  }

  const theme = EditorView.theme({
    "&": {
      height: "100%",
      maxHeight: "100%",
      color: "var(--color-color)",
      backgroundColor: "transparent",
      fontFamily: "inherit",
      boxSizing: "border-box",
    },
    ".cm-content": {
      fontFamily: "monospace",
      fontSize: "16px",
      margin: "0 auto"
    },
    ".cm-scroller": {
      fontFamily: "inherit",
      overflowX: "auto", // 横スクロール有効化
      overflowY: "auto",
      paddingBottom: "5rem",
      display: "grid !important",
    },
    ".cm-line": {
      minWidth: "100%",
      padding: 0,
    },
    ".cm-activeLine": {
      backgroundColor: "var(--theme-selected)",
    },
    ".cm-gutters": {
      fontFamily: "monospace",
      backgroundColor: "var(--theme-background-0)",
      pointerEvents: "none",
      zIndex: 10,
      color: "var(--color-color)",
    },
    ".cm-gutter": {
      width: "100%",
      textAlign: "right",
      fontSize: "16px",
      opacity: 0.5,
    },
    ".cm-activeLineGutter": {
      backgroundColor: "transparent",
      opacity: 0.95,
    },
  }, { dark: true });

  const extensions = [
    highlightActiveLine(),
    highlightActiveLineGutter(),
    lineNumbers(),
  ]

  const [content, setContent] = useState(note.content || "");
  
  useEffect(() => {
    setContent(note.content || "");
  }, [note]);

  const debouncedSave = useMemo(
    () =>
      debounce(async (value: string) => {
        await note.writeContent(value);
        ctx.updateMetadata({ excerpt: await note.getExcerpt() });
      }, 300),
    [note] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleChange = (value: string) => {
    setContent(value);
    debouncedSave(value);
  };

  return (
    <>
      <CodeMirror
        basicSetup={false}
        value={content}
        theme={theme}
        className={styles.plaintextEditor}
        extensions={[
          ...extensions
        ]}
        onChange={handleChange}
      />
    </>
  );
}
