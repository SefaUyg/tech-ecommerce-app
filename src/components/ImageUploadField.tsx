"use client";

import { useRef, useState } from "react";

export function ImageUploadField({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    const fd = new FormData();
    fd.set("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        const msg =
          data?.error === "file_too_large"
            ? "Dosya 5MB'dan küçük olmalı"
            : data?.error === "cloudinary_not_configured"
              ? "Cloudinary .env ile yapılandırılmamış. Manuel URL girin."
              : "Yükleme başarısız";
        setError(msg);
        return;
      }
      if (data.url) setUrl(data.url);
    } catch {
      setError("Yükleme başarısız");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-1">
      <div className="flex gap-2">
        <input type="hidden" name={name} value={url} />
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://... veya Yükle ile yükleyin"
          className="flex-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none ring-zinc-900/10 focus:ring-4"
        />
        <label className="flex cursor-pointer items-center rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm hover:bg-zinc-100">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={handleFileChange}
            disabled={uploading}
          />
          {uploading ? "..." : "Yükle"}
        </label>
      </div>
      {url ? (
        <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-zinc-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="Önizleme" className="h-full w-full object-cover" />
        </div>
      ) : null}
      {error ? <div className="text-xs text-red-600">{error}</div> : null}
    </div>
  );
}
