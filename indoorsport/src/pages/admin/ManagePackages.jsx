import { FaEdit, FaTrash } from "react-icons/fa";
import { MdSportsCricket } from "react-icons/md";
import { useState } from "react";

const SPORTS = ["Cricket", "Badminton", "Table Tennis"];

export default function ManagePackages({ packages, courts, onAdd, onEdit, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [editPkg, setEditPkg] = useState(null);
  const [form, setForm] = useState({ courtName: "", name: "", duration: "", price: "", label: "" });
  const [filterSport, setFilterSport] = useState("All");
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const getSportForPackage = (p) => {
    if (!p.courtName) return "";
    const court = courts?.find(c => c.name?.trim().toLowerCase() === p.courtName?.trim().toLowerCase());
    return court ? court.sport : "";
  };

  const filteredPackages = packages.filter(p => {
    if (filterSport === "All") return true;
    let s = getSportForPackage(p);
    
    // Fallback: If no sport found from court, check the package name itself
    if (!s) s = p.name || "";
    if (!s) return false;
    
    s = s.toLowerCase().trim().replace(/batminton/g, "badminton");
    const f = filterSport.toLowerCase().trim().replace(/batminton/g, "badminton");
    
    return s === f || s.includes(f) || f.includes(s);
  });

  const openAdd = () => { setForm({ courtName: "", name: "", duration: "", price: "", label: "" }); setEditPkg(null); setShowModal(true); };
  const openEdit = (p) => { setForm({ courtName: p.courtName || "", name: p.name, duration: p.duration, price: p.price, label: p.label || "" }); setEditPkg(p); setShowModal(true); };
  const handleSave = () => {
    const data = { ...form, duration: Number(form.duration), price: Number(form.price) };
    if (editPkg) onEdit(editPkg.id, data); else onAdd(data);
    setShowModal(false);
  };

  return (
    <div style={{ padding: "40px" }}>
      <div className="animate-fade" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", marginBottom: "6px" }}>Manage Packages</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Create and manage booking packages for users</p>
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

          <button className="btn-primary" onClick={openAdd}>+ Add Package</button>
        </div>
      </div>

      {/* Package cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "32px" }}>
        {filteredPackages.map((p, i) => (
          <div key={p.id} className={`card animate-fade delay-${i + 1}`} style={{ textAlign: "center", padding: "32px 20px" }}>
            {p.courtName && (
              <div style={{
                display: "inline-block", padding: "4px 12px", borderRadius: "20px",
                background: "var(--green-50)", color: "var(--green-700)", fontSize: "11px", fontWeight: 700,
                marginBottom: "12px", border: "1px solid var(--green-200)",
              }}><MdSportsCricket style={{marginRight:'4px', verticalAlign:'middle'}} /> {p.courtName}</div>
            )}
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "28px", color: "var(--green-700)", marginBottom: "4px" }}>
              {p.duration}H
            </div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px" }}>{p.name}</div>
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "22px", marginBottom: "8px" }}>
              {p.price}/=
            </div>
            {p.label && (
              <div style={{
                display: "inline-block", padding: "4px 10px", borderRadius: "12px",
                background: "var(--green-100)", color: "var(--green-700)", fontSize: "11px", fontWeight: 700,
                marginBottom: "20px",
              }}>{p.label}</div>
            )}
            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
              <button className="btn-success btn-sm" onClick={() => openEdit(p)}><FaEdit style={{marginRight:'4px', verticalAlign:'middle'}} /> Edit</button>
              <button className="btn-danger btn-sm" onClick={() => onDelete(p.id)}><FaTrash /> Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card animate-fade" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1.5px solid var(--border)", background: "var(--surface-3)" }}>
          <h3 style={{ fontSize: "15px" }}>Package List</h3>
        </div>
        <table>
          <thead>
            <tr>{["Sport Court", "Package Name", "Duration", "Price", "Discount", "Action"].map(h => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filteredPackages.map(p => (
              <tr key={p.id}>
                <td>
                  {p.courtName ? (
                    <span style={{
                      display: "inline-block", padding: "3px 10px", borderRadius: "16px",
                      background: "var(--green-50)", color: "var(--green-700)", fontSize: "12px", fontWeight: 600,
                      border: "1px solid var(--green-200)",
                    }}><MdSportsCricket style={{marginRight:'4px', verticalAlign:'middle'}} /> {p.courtName}</span>
                  ) : (
                    <span style={{ color: "var(--text-muted)" }}>—</span>
                  )}
                </td>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td>{p.duration} Hours</td>
                <td style={{ fontWeight: 700, color: "var(--green-700)" }}>{p.price}/=</td>
                <td>{p.label || "—"}</td>
                <td>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button className="btn-success" onClick={() => openEdit(p)}><FaEdit style={{marginRight:'4px', verticalAlign:'middle'}} /> Edit</button>
                    <button className="btn-danger" onClick={() => onDelete(p.id)}><FaTrash /> Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            <h2 style={{ fontSize: "22px", marginBottom: "24px" }}>
              {editPkg ? "Edit Package" : "Add New Package"}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div className="form-group">
                <label className="form-label">Sport Court</label>
                <select className="form-input" value={form.courtName} onChange={set("courtName")}
                  style={{ appearance: "auto", cursor: "pointer" }}>
                  <option value="">— Select a Court —</option>
                  {(courts || []).map(c => (
                    <option key={c.id} value={c.name}>{c.name} ({c.sport})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Package Name</label>
                <input className="form-input" placeholder="e.g. 2 Hours Package" value={form.name} onChange={set("name")} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label className="form-label">Duration (Hours)</label>
                  <input className="form-input" type="number" placeholder="2" value={form.duration} onChange={set("duration")} />
                </div>
                <div className="form-group">
                  <label className="form-label">Price (Rs.)</label>
                  <input className="form-input" type="number" placeholder="1500" value={form.price} onChange={set("price")} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Discount Label (optional)</label>
                <input className="form-input" placeholder="e.g. Save 500/=" value={form.label} onChange={set("label")} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "28px" }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleSave}>
                {editPkg ? "Save Changes" : "Add Package"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
