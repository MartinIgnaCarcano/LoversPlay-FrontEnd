"use client";

import { useEffect, useRef } from "react";

export function EditorHTML({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);
  const onChangeRef = useRef(onChange);
  const isInternalChange = useRef(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Lazy-load Quill entirely on the client (safe for static export)
  useEffect(() => {
    if (!containerRef.current || quillRef.current) return;

    let cancelled = false;

    (async () => {
      // Dynamic imports: Quill + its CSS — never touched during SSR/build
      const [{ default: Quill }] = await Promise.all([
        import("quill"),
        import("quill/dist/quill.snow.css" as any),
      ]);

      if (cancelled || !containerRef.current) return;

      const editorDiv = document.createElement("div");
      containerRef.current.appendChild(editorDiv);

      const quill = new Quill(editorDiv, {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["clean"],
          ],
        },
      });

      quillRef.current = quill;

      if (value) {
        quill.clipboard.dangerouslyPasteHTML(value);
      }

      quill.on("text-change", () => {
        isInternalChange.current = true;
        const isEmpty = quill.getText().trim().length === 0;
        onChangeRef.current(isEmpty ? "" : quill.getSemanticHTML());
        isInternalChange.current = false;
      });
    })();

    return () => {
      cancelled = true;
      quillRef.current = null;
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external value → editor (e.g. form reset)
  useEffect(() => {
    const quill = quillRef.current;
    if (!quill || isInternalChange.current) return;

    const currentHTML =
      quill.getText().trim().length === 0 ? "" : quill.getSemanticHTML();

    if (value !== currentHTML) {
      const sel = quill.getSelection();
      quill.clipboard.dangerouslyPasteHTML(value ?? "");
      if (sel) quill.setSelection(sel);
    }
  }, [value]);

  return (
    <>
      <style>{`
        .ql-editor-wrapper .ql-toolbar {
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
          background: #f8f8f8;
        }
        .ql-editor-wrapper .ql-container {
          height: 252px;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 14px;
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
        }
        .ql-editor-wrapper .ql-editor p {
          margin: 0 0 0.5em;
        }
      `}</style>
      <div
        className="ql-editor-wrapper"
        ref={containerRef}
        style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: 14 }}
      />
    </>
  );
}
