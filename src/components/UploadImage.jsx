import { useRef, useState } from "react";

export default function UploadImage({ label = "Upload image", value, onChange, onDelete }) {
  const fileRef = useRef();
  const [preview, setPreview] = useState(null);

  const pick = () => fileRef.current?.click();

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(f);
    onChange?.(f);
  };

  return (
    <div className="card" style={{ maxWidth: 420 }}>
      <label>{label}</label>
      <div style={{ display: "grid", gap: 10 }}>
        <div style={{
          width: "100%", aspectRatio: "16/10", background: "#0d1420",
          border: "1px solid #1f2937", borderRadius: 10, overflow: "hidden",
          display: "grid", placeItems: "center"
        }}>
          {preview ? (
            <img src={preview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : value?.url ? (
            <img src={value.url} alt="current" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ color: "var(--muted)" }}>No image</span>
          )}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" className="btn" onClick={pick}>Add / Change</button>
          {(value?.url || preview) && (
            <button type="button" className="btn outline" onClick={() => { setPreview(null); onDelete?.(); }}>
              Delete
            </button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={onFile} hidden />
      </div>
    </div>
  );
}
