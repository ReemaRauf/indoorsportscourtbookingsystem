import { FaEdit, FaTrash, FaUpload } from "react-icons/fa";
import { useState } from "react";
import { uploadImageToFirebase } from "../../firebase/uploadImage";

const SPORTS = ["Cricket", "Badminton", "Table Tennis"];

// Reusable image uploader
function ImageUploader({ value, onChange, folder = "courts" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const url = await uploadImageToFirebase(file, folder);
      onChange(url);
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
        <input
          className="form-input"
          placeholder="Paste URL or upload an image"
          value={value || ""}
          onChange={e => { onChange(e.target.value); setImageFailed(false); }}
          style={{ flex: 1 }}
        />
        <label style={{
          display: "flex", alignItems: "center", gap: "6px",
          padding: "8px 14px", borderRadius: "8px",
          background: uploading ? "var(--green-300)" : "var(--green-600)",
          color: "white", fontWeight: 700, fontSize: "12px",
          cursor: uploading ? "not-allowed" : "pointer",
          whiteSpace: "nowrap", transition: "all 0.2s"
        }}>
          <FaUpload />
          {uploading ? "Uploading..." : "Upload"}
          <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} disabled={uploading} />
        </label>
      </div>
      {error && <p style={{ color: "red", fontSize: "12px" }}>{error}</p>}
      {imageFailed && value && <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>Image not found at this path.</p>}
      {value && (
        <img
          src={value}
          alt="preview"
          style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 8, marginTop: 8, border: "1.5px solid var(--border)" }}
          onError={e => { e.target.style.display = "none"; setImageFailed(true); }}
          onLoad={e => { e.target.style.display = "block"; setImageFailed(false); }}
        />
      )}
    </div>
  );
}

export default function ManageCourts({ courts, onAdd, onEdit, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [editCourt, setEditCourt] = useState(null);
  const [form, setForm] = useState({ name: "", sport: "", image: "/court_badminton.png" });
  const [filterSport, setFilterSport] = useState("All");
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const filteredCourts = courts.filter(c => {
    if (filterSport === "All") return true;
    if (!c.sport) return false;
    const s = c.sport.toLowerCase().trim().replace(/batminton/g, "badminton");
    const f = filterSport.toLowerCase().trim().replace(/batminton/g, "badminton");
    return s === f || s.includes(f) || f.includes(s);
  });

  const openAdd = () => { setForm({ name: "", sport: "", image: "/court_badminton.png" }); setEditCourt(null); setShowModal(true); };
  const openEdit = (c) => { setForm({ name: c.name, sport: c.sport, image: c.image }); setEditCourt(c); setShowModal(true); };
  const handleSave = () => {
    if (editCourt) onEdit(editCourt.id, form); else onAdd(form);
    setShowModal(false);
  };

  return (
    <div style={{ padding: "40px" }}>
      <div className="animate-fade" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", marginBottom: "6px" }}>Manage Courts</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Add, edit, or remove sports courts</p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {/* Sport filter */}
          <div style={{ display: "flex", gap: "6px" }}>
            {["All", ...SPORTS].map(s => (
              <button
                key={s}
                onClick={() => setFilterSport(s)}
                style={{
                  padding: "7px 14px", borderRadius: "20px",
                  border: filterSport === s ? "none" : "1.5px solid var(--border)",
                  background: filterSport === s ? "var(--green-600)" : "transparent",
                  color: filterSport === s ? "white" : "var(--text-secondary)",
                  fontSize: "12px", fontWeight: 700, cursor: "pointer", transition: "all 0.2s"
                }}
              >{s}</button>
            ))}
          </div>
          <button className="btn-primary" onClick={openAdd}>+ Add Court</button>
        </div>
      </div>

      <div className="card animate-fade" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1.5px solid var(--border)", background: "var(--surface-3)" }}>
          <h3 style={{ fontSize: "15px" }}>All Courts ({courts.length})</h3>
        </div>
        <table style={{ width: "100%" }}>
          <thead>
            <tr>{["Court Name", "Sport Type", "Image", "Action"].map(h => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filteredCourts.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 600 }}>{c.name}</td>
                <td>{c.sport}</td>
                <td>
                  {c.image ? (
                    <img
                      src={c.image}
                      alt="court"
                      style={{ width: 48, height: 36, borderRadius: 6, objectFit: "cover" }}
                      onError={e => { e.target.style.display = "none"; }}
                      onLoad={e => { e.target.style.display = "block"; }}
                    />
                  ) : (
                    <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>No image</span>
                  )}
                </td>
                <td>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button className="btn-success" onClick={() => openEdit(c)}><FaEdit style={{marginRight:'4px', verticalAlign:'middle'}} /> Edit</button>
                    <button className="btn-danger" onClick={() => onDelete(c.id)}><FaTrash style={{marginRight:'4px', verticalAlign:'middle'}} /> Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {!filteredCourts.length && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)" }}>No courts found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            <h2 style={{ fontSize: "22px", marginBottom: "24px" }}>
              {editCourt ? "Edit Court" : "Add New Court"}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div className="form-group">
                <label className="form-label">Court Name</label>
                <input className="form-input" placeholder="Enter court name" value={form.name} onChange={set("name")} />
              </div>
              <div className="form-group">
                <label className="form-label">Sport Type</label>
                <select className="form-input" value={form.sport} onChange={set("sport")}>
                  <option value="">Select sport...</option>
                  {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Court Photo</label>
                <ImageUploader
                  value={form.image}
                  onChange={url => setForm(p => ({ ...p, image: url }))}
                  folder="courts"
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "28px" }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleSave}>
                {editCourt ? "Save Changes" : "Add Court"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
