"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import { useRef, useState } from "react";

function ToolbarButton({ onClick, active, children, title }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`px-2.5 py-1.5 rounded-lg text-[13px] font-bold transition-colors ${
        active ? "bg-green-dk2 text-white" : "text-ink hover:bg-cream"
      }`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ name, initialContent }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [content, setContent] = useState(initialContent ?? "");

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension.configure({ HTMLAttributes: { class: "rounded-xl max-w-full" } }),
      LinkExtension.configure({ openOnClick: false }),
    ],
    content: initialContent ?? "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose-news min-h-[240px] px-4 py-3 text-[13.5px] outline-none",
      },
    },
    onUpdate: ({ editor }) => setContent(editor.getHTML()),
  });

  async function handleImagePick(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !editor) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload-image", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload gagal.");
      editor.chain().focus().setImage({ src: data.url }).run();
    } catch (err) {
      alert(err.message ?? "Upload gambar gagal.");
    } finally {
      setUploading(false);
    }
  }

  function setLink() {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL tautan:", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  }

  if (!editor) return null;

  return (
    <div className="border border-line rounded-xl overflow-hidden focus-within:border-emerald">
      <div className="flex flex-wrap items-center gap-1 border-b border-line bg-cream/60 px-2 py-1.5">
        <ToolbarButton title="Tebal" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          B
        </ToolbarButton>
        <ToolbarButton title="Miring" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          I
        </ToolbarButton>
        <ToolbarButton
          title="Judul Bagian"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          title="Sub Judul"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>
        <ToolbarButton
          title="Daftar Poin"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </ToolbarButton>
        <ToolbarButton
          title="Daftar Angka"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </ToolbarButton>
        <ToolbarButton
          title="Kutipan"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          &ldquo;Kutipan&rdquo;
        </ToolbarButton>
        <ToolbarButton title="Tautan" active={editor.isActive("link")} onClick={setLink}>
          Link
        </ToolbarButton>
        <ToolbarButton title="Sisipkan Gambar" onClick={() => fileInputRef.current?.click()}>
          {uploading ? "Mengunggah…" : "🖼 Gambar"}
        </ToolbarButton>
        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleImagePick} />
        <div className="flex-1" />
        <ToolbarButton title="Urungkan" onClick={() => editor.chain().focus().undo().run()}>
          ↶
        </ToolbarButton>
        <ToolbarButton title="Ulangi" onClick={() => editor.chain().focus().redo().run()}>
          ↷
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} className="bg-white" />
      <input type="hidden" name={name} value={content} />
    </div>
  );
}
