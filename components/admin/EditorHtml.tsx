"use client";

import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";

export function EditorHTML({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editorRef = useRef<any>(null);

  return (
    <Editor
      apiKey="ot1p3rizx24e8u2o6nrtaw73ccreowzb4mq5zkky832bdo4c" // funciona igual, sin límites
      onInit={(_, editor) => {
        editorRef.current = editor;
      }}
      value={value}
      onEditorChange={(content) => {
        onChange(content);
      }}
      init={{
        height: 300,
        menubar: false,
        plugins: ["lists"],
        toolbar:
          "bold italic underline | bullist numlist | removeformat",
        branding: false,
        content_style:
          "body { font-family:Arial,Helvetica,sans-serif; font-size:14px }",
      }}
    />
  );
}
