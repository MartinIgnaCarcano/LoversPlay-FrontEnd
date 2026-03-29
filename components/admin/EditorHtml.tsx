"use client";

import { Editor } from "@tinymce/tinymce-react";

export function EditorHTML({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  return (
    <Editor
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      licenseKey="gpl"
      value={value}
      onEditorChange={(content) => onChange(content)}
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