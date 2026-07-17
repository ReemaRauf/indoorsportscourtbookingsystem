import { FaEdit, FaTrash, FaUpload } from "react-icons/fa";
import { useState } from "react";
import { uploadImageToFirebase } from "../../firebase/uploadImage";

const SPORTS = ["Cricket", "Badminton", "Table Tennis"];

// Reusable image uploader
function ImageUploader({ value, onChange, folder = "coaches", round = false }) {
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
          placeholder="Paste URL or initials (e.g. JD)"
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
      {imageFailed && value && (value.includes("/") || value.includes(".")) && <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>Image not found at this path.</p>}
      {value && (value.includes("/") || value.includes(".")) && (
        <img
          src={value}
          alt="preview"
          style={{
            width: 64, height: 64, objectFit: "cover", marginTop: 8,
            borderRadius: round ? "50%" : "8px",
            border: "1.5px solid var(--border)"
          }}
          onError={e => { e.target.style.display = "none"; setImageFailed(true); }}
          onLoad={e => { e.target.style.display = "block"; setImageFailed(false); }}
        />
      )}
    </div>
  );
}

export default function ManageCoaches({ coaches, onAdd, onEdit, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [editCoach, setEditCoach] = useState(null);
  const [form, setForm] = useState({ name: "", sport: "Cricket", role: "", desc: "", avatar: "", price: 500 });
  const [filterSport, setFilterSport] = useState("All");

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const filteredCoaches = coaches?.filter(c => filterSport === "All" || c.sport === filterSport) || [];

  const openAdd = () => { setForm({ name: "", sport: "Cricket", role: "", desc: "", avatar: "", price: 500 }); setEditCoach(null); setShowModal(true); };
  const openEdit = (c) => { setForm({ name: c.name, sport: c.sport, role: c.role, desc: c.desc, avatar: c.avatar, price: c.price || 500 }); setEditCoach(c); setShowModal(true); };
  const handleSave = () => {
    if (editCoach) onEdit(editCoach.id, form); else onAdd(form);
    setShowModal(false);
  };

  return (
    <div style={{ padding: "40px" }}>
      <div className="animate-fade" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "28px", marginBottom: "6px" }}>Manage Coaches</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Add, edit, or remove professional coaches</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>+ Add Coach</button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
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
      </div>

      <div className="card animate-fade" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1.5px solid var(--border)", background: "var(--surface-3)" }}>
          <h3 style={{ fontSize: "15px" }}>All Coaches ({filteredCoaches.length})</h3>
        </div>
        <table style={{ width: "100%" }}>
          <thead>
            <tr>{["Coach ID", "Avatar", "Name", "Sport", "Role", "Price/Hr", "Description", "Action"].map(h => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filteredCoaches.map(c => (
              <tr key={c.id}>
                <td style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{c.id}</td>
                <td>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "50%",
                    background: "var(--green-500)", display: "flex", alignItems: "center",
                    justifyContent: "center", color: "white", fontWeight: "bold", overflow: "hidden"
                  }}>
                    {c.avatar && (c.avatar.includes("/") || c.avatar.includes(".")) ? (
                      <img src={c.avatar} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} onLoad={e => { e.target.style.display = "block"; }} />
                    ) : (
                      c.avatar
                    )}
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>{c.name}</td>
                <td>{c.sport}</td>
                <td>{c.role}</td>
                <td>Rs. {c.price || 500}/=</td>
                <td style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.desc}</td>
                <td>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button className="btn-success" onClick={() => openEdit(c)}><FaEdit style={{marginRight:'4px', verticalAlign:'middle'}} /> Edit</button>
                    <button className="btn-danger" onClick={() => onDelete(c.id)}><FaTrash style={{marginRight:'4px', verticalAlign:'middle'}} /> Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {!filteredCoaches.length && (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)" }}>
                  No coaches found. Add one above.
                </td>
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
              {editCoach ? "Edit Coach" : "Add New Coach"}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div className="form-group">
                <label className="form-label">Coach Name</label>
                <input className="form-input" placeholder="Enter coach name" value={form.name} onChange={set("name")} />
              </div>
              <div className="form-group">
                <label className="form-label">Photo (or initials like "JD")</label>
                <ImageUploader
                  value={form.avatar}
                  onChange={url => setForm(p => ({ ...p, avatar: url }))}
                  folder="coaches"
                  round={true}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Sport</label>
                <select className="form-input" value={form.sport} onChange={set("sport")}>
                  <option value="Cricket">Cricket</option>
                  <option value="Badminton">Badminton</option>
                  <option value="Table Tennis">Table Tennis</option>
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <input className="form-input" placeholder="e.g. Head Coach" value={form.role} onChange={set("role")} />
                </div>
                <div className="form-group">
                  <label className="form-label">Price per Hour (Rs)</label>
                  <input className="form-input" type="number" placeholder="500" value={form.price} onChange={set("price")} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" placeholder="Experience and specialty" value={form.desc} onChange={set("desc")} style={{ minHeight: "80px", resize: "vertical" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "28px" }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleSave}>
                {editCoach ? "Save Changes" : "Add Coach"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
