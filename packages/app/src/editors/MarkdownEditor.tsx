import styles from "./MarkdownEditor.module.css";

import { useState, useEffect, useMemo } from "react";
import { MarkdownNoteClass } from "core/builtin/notetypes";

import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { placeholder } from "@codemirror/view";

import { BaseNote, type NoteEditorProps } from "core/notes";

import {
  prosemarkBasicSetup,
  prosemarkBaseThemeSetup,
  prosemarkMarkdownSyntaxExtensions,
} from '@korange/prosemark-ctrn3-tempfork-core';

import { markdown } from '@codemirror/lang-markdown';
import { GFM } from '@lezer/markdown';
import useActiveNotebookStore from "@/features/mainPage/stores/activeNotebook";
import { PathUtil } from "shared/utils";

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

function isMarkdown(note: BaseNote): note is MarkdownNoteClass {
  return note.__notetype === "markdown";
}

export default function MarkdownEditor({ note, ctx }: NoteEditorProps) {
  if (!isMarkdown(note)) {
    throw new Error("Invalid note type for MarkdownEditor");
  }

  const notebook = useActiveNotebookStore(state => state.notebook);

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
      margin: "0 auto",
      paddingBottom: "16rem"
    },
    ".cm-scroller": {
      fontFamily: "inherit",
      overflowY: "auto",
      display: "grid !important",
      scrollbarGutter: "stable"
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
      display: "none"
    },
    ".cm-gutter": {
      width: "100%",
      textAlign: "right",
      fontSize: "16px",
      opacity: 0.5,
    },
    ".pm-heading": {
      backgroundColor: "#ff00000"
    },
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
    prosemarkBasicSetup({
      imgSrcReplacer: async (src) => {
        console.log(note.metadata.path, "..", src)
        const file = await notebook?.fsMgr.readFile(
          PathUtil.join(note.metadata.path, "..", src)
        ).catch(() => null);
        if (file) {
          const blob = new Blob([file.buffer as ArrayBuffer], { type: "image*" });
          console.log("return blob", blob);
          return URL.createObjectURL(blob);
        } else {
          console.log("return src", src);
          return src;
        }
      }
    }),
    // Theme extensions
    prosemarkBaseThemeSetup(),
    placeholder("Start writing..."),
  ]

  // gpt kiku how!

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
      { /* <div className="bg-danger/12 px-3 py-1 rounded-lg col-[2] text-sm opacity-95">
        Markdown editor may currently be unstable. If you encounter any issues, please report them on <a
          href="https://forms.gle/xUM4zdRs4pq5ofZG8"
          className="underline"
          target="_blank"
          rel="noreferrer"
        >Feedback Form</a>.
      </div> */}
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
