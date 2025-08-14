export default function Confirm({ text = "Are you sure?", onConfirm, onCancel }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <span>{text}</span>
      <button className="btn" onClick={onConfirm}>Yes</button>
      <button className="btn outline" onClick={onCancel}>No</button>
    </div>
  );
}
