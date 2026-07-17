import { useState } from "react";
import { FaCheckCircle, FaEdit, FaTrash, FaUpload } from "react-icons/fa";
import { uploadImageToFirebase } from "../../firebase/uploadImage";

const SPORTS = ["Cricket", "Badminton", "Table Tennis"];

const SPORT_COLORS = {
  "Cricket":      { color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
  "Badminton":    { color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
  "Table Tennis": { color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
};

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box" style={{ maxWidth: "520px" }}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", color: "var(--green-950)", marginBottom: "24px" }}>{title}</h2>
        {children}
      </div>
    </div>
  );
}

// Reusable image uploader component
function ImageUploader({ value, onChange, folder = "equipments" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

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
          placeholder="Paste URL or upload below"
          value={value || ""}
          onChange={e => onChange(e.target.value)}
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
      {error && <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>{error}</p>}
      {value && (
        <img
          src={value}
          alt="preview"
          style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, marginTop: 8, border: "1.5px solid var(--border)" }}
          onError={e => { e.target.style.display = "none"; }}
        />
      )}
    </div>
  );
}

export default function ManageEquipments({ equipments = [], onAdd, onEdit, onDelete }) {
  const [filterSport, setFilterSport] = useState("All");
  const [editEq, setEditEq] = useState(null);
  const [addEqOpen, setAddEqOpen] = useState(false);
  const [newEq, setNewEq] = useState({ sport: "Cricket", name: "", price: "", unit: "each", icon: "🏅", image: "" });
  const [successMsg, setSuccessMsg] = useState("");

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const filteredEq = equipments.filter(e => filterSport === "All" || e.sport === filterSport);

  return (
    <div style={{ padding: "32px 36px", maxWidth: "1100px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "28px", color: "var(--green-950)", marginBottom: "6px" }}>
          Equipment Management
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Manage sport equipment prices and items.</p>
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="alert alert-success animate-scale" style={{ marginBottom: "20px" }}>
           <FaCheckCircle style={{marginRight:'6px', verticalAlign:'middle'}} /> {successMsg}
        </div>
      )}

      {/* Tab + Filter Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div></div>
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
          {/* Add button */}
          <button className="btn-primary btn-sm" onClick={() => setAddEqOpen(true)}>
            + Add Equipment
          </button>
        </div>
      </div>

      {/* ── EQUIPMENT TABLE ── */}
      <div className="card animate-fade" style={{ padding: 0, overflow: "hidden" }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Sport</th>
                <th>Unit</th>
                <th>Price (Rs.)</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEq.map(eq => {
                const sc = SPORT_COLORS[eq.sport] || {};
                return (
                  <tr key={eq.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: sc.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", border: `1px solid ${sc.border}`, overflow: "hidden" }}>
                          {eq.image
                            ? <img src={eq.image} alt={eq.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} />
                            : eq.icon}
                        </div>
                        <div style={{ fontWeight: 600 }}>{eq.name}</div>
                      </div>
                    </td>
                    <td>
                      <span className="badge" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>{eq.sport}</span>
                    </td>
                    <td style={{ color: "var(--text-muted)", fontSize: "13px" }}>per {eq.unit}</td>
                    <td>
                      <span style={{ fontWeight: 800, color: "var(--green-700)", fontSize: "16px", fontFamily: "Syne, sans-serif" }}>
                        Rs. {eq.price}/=
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        <button className="btn-success btn-sm" onClick={() => setEditEq({ ...eq })}>
                          <FaEdit style={{marginRight:'4px', verticalAlign:'middle'}} /> Edit
                        </button>
                        <button
                          className="btn-danger btn-sm"
                          onClick={() => {
                            if (window.confirm(`Delete "${eq.name}"?`)) {
                              onDelete(eq.id);
                              showSuccess(`"${eq.name}" removed successfully.`);
                            }
                          }}
                        ><FaTrash style={{marginRight:'4px', verticalAlign:'middle'}} /> Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredEq.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>No equipment found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── EDIT EQUIPMENT MODAL ── */}
      {editEq && (
        <Modal title="Edit Equipment" onClose={() => setEditEq(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Equipment Name</label>
              <input className="form-input" value={editEq.name} onChange={e => setEditEq(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Sport</label>
              <select className="form-select" value={editEq.sport} onChange={e => setEditEq(p => ({ ...p, sport: e.target.value }))}>
                {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Photo</label>
              <ImageUploader
                value={editEq.image}
                onChange={url => setEditEq(p => ({ ...p, image: url }))}
                folder="equipments"
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label">Price (Rs.)</label>
                <input className="form-input" type="number" min="1" value={editEq.price} onChange={e => setEditEq(p => ({ ...p, price: Number(e.target.value) }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Unit</label>
                <select className="form-select" value={editEq.unit} onChange={e => setEditEq(p => ({ ...p, unit: e.target.value }))}>
                  {["each", "pair", "set", "couple"].map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "8px" }}>
              <button className="btn-secondary btn-sm" onClick={() => setEditEq(null)}>Cancel</button>
              <button className="btn-primary btn-sm" onClick={() => {
                onEdit(editEq.id, editEq);
                showSuccess(`"${editEq.name}" updated successfully.`);
                setEditEq(null);
              }}>Save Changes</button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── ADD EQUIPMENT MODAL ── */}
      {addEqOpen && (
        <Modal title="Add New Equipment" onClose={() => setAddEqOpen(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Equipment Name</label>
              <input className="form-input" placeholder="e.g. Cricket Ball" value={newEq.name} onChange={e => setNewEq(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Sport</label>
              <select className="form-select" value={newEq.sport} onChange={e => setNewEq(p => ({ ...p, sport: e.target.value }))}>
                {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Photo</label>
              <ImageUploader
                value={newEq.image}
                onChange={url => setNewEq(p => ({ ...p, image: url }))}
                folder="equipments"
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label">Price (Rs.)</label>
                <input className="form-input" type="number" min="1" placeholder="e.g. 500" value={newEq.price} onChange={e => setNewEq(p => ({ ...p, price: Number(e.target.value) }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Unit</label>
                <select className="form-select" value={newEq.unit} onChange={e => setNewEq(p => ({ ...p, unit: e.target.value }))}>
                  {["each", "pair", "set", "couple"].map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "8px" }}>
              <button className="btn-secondary btn-sm" onClick={() => setAddEqOpen(false)}>Cancel</button>
              <button className="btn-primary btn-sm" onClick={() => {
                if (!newEq.name || !newEq.price) return alert("Please fill all fields.");
                onAdd(newEq);
                showSuccess(`"${newEq.name}" added successfully.`);
                setNewEq({ sport: "Cricket", name: "", price: "", unit: "each", icon: "🏅", image: "" });
                setAddEqOpen(false);
              }}>Add Equipment</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
