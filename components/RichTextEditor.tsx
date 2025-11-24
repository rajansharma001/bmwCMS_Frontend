"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex gap-2 border p-2 rounded mb-2 bg-gray-50">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="px-2 py-1 border rounded"
      >
        B
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className="px-2 py-1 border rounded"
      >
        I
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className="px-2 py-1 border rounded"
      >
        S
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className="px-2 py-1 border rounded"
      >
        • List
      </button>
    </div>
  );
};

const RichTextEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // <-- Sync editor content when `value` prop changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="border p-4 rounded min-h-[150px] bg-white"
      />
    </div>
  );
};

export default RichTextEditor;
