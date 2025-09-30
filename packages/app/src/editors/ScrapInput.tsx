import { useState, useRef, useEffect } from "react";
import { Button } from "ui";

export default function ScrapInput({ isEditing, onSubmit, onCancelEdit }: { isEditing: boolean; onSubmit: (content: string) => void, onCancelEdit?: () => void }) {
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 高さ自動調整
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // リセット
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [inputValue]);

  return (
    <div className="my-4">
      <div className="rounded-lg w-full bg-background-2 border border-border text-color relative">
        <textarea
          ref={textareaRef}
          className="px-3.5 py-2 w-full bg-transparent no-focus-outline resize-none"
          value={inputValue}
          placeholder={isEditing ? "Edit..." : "Type something..."} // 翻訳する
          onChange={(e) => setInputValue(e.target.value)}
          style={{ paddingBottom: "2.3rem" }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.ctrlKey) {
              e.preventDefault();
              if (inputValue.trim() !== "") {
                onSubmit(inputValue.trim());
                setInputValue("");
              }
            }
          }}
        />
        <div className="absolute bottom-0 flex justify-between px-3.5 py-2 w-full pointer-events-none">
          <div className="flex gap-2">
            {/* ここにアイコンやボタン追加可能 */}
          </div>
          <div className="flex gap-2 pointer-events-auto">
            { isEditing && (
              <Button icon={{
                type: "lucide", name: "X"
              }} onClick={onCancelEdit}></Button>
            ) }

            <Button
              variant="primary"
              icon={ isEditing ? { type: "lucide", name: "Edit" } : { type: "lucide", name: "Plus" } }
              onClick={() => {
                if (inputValue.trim() !== "") {
                  onSubmit(inputValue.trim());
                  setInputValue("");
                }
              }}
            ></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
