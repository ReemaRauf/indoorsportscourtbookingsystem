import { useState, useEffect } from "react";
import { FaBuilding, FaSyncAlt, FaBan, FaCheck, FaTrash } from "react-icons/fa";
import api from "../../api";
export default function ManageAvailability({ courts }) {
  const getLocalDate = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split("T")[0];
  };

  const [courtId, setCourtId] = useState(courts[0]?.id || "");
  const [slots, setSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({ date: getLocalDate(), start: "", end: "", status: "Blocked" });
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (courtId) {
      fetchAvailability();
    }
  }, [courtId]);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/availability?courtId=${courtId}`);
      setSlots(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveAvailabilityStateForDate = async (targetDate, newSlots) => {
    setSaving(true);
    try {
      const slotsForDate = newSlots.filter(s => s.date === targetDate);
      const slotsToSave = slotsForDate.map(({date, ...rest}) => rest);
      await api.post("/availability", { courtId, date: targetDate, slots: slotsToSave });
    } catch (err) {
      console.error(err);
      alert("Failed to auto-save availability");
    } finally {
      setSaving(false);
    }
  };

  const saveAvailability = async () => {
    // Optional manual save
    fetchAvailability();
  };

  const toggleStatus = async (id) => {
    const targetSlot = slots.find(s => s.id === id);
    if (!targetSlot) return;
    const newSlots = slots.map(s => s.id === id ? { ...s, status: s.status === "Available" ? "Blocked" : "Available" } : s);
    setSlots(newSlots);
    await saveAvailabilityStateForDate(targetSlot.date, newSlots);
  };

  const deleteSlot = async (id) => {
    const targetSlot = slots.find(s => s.id === id);
    if (!targetSlot) return;
    const newSlots = slots.filter(s => s.id !== id);
    setSlots(newSlots);
    await saveAvailabilityStateForDate(targetSlot.date, newSlots);
  };

  const addSlot = async () => {
    if (!newSlot.start || !newSlot.end || !newSlot.date) return;
    const newSlotObj = { id: Date.now(), date: newSlot.date, start: newSlot.start, end: newSlot.end, duration: "Custom", status: newSlot.status };
    const newSlots = [...slots, newSlotObj];
    setSlots(newSlots.sort((a,b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.start.localeCompare(b.start);
    }));
    setNewSlot({ date: getLocalDate(), start: "", end: "", status: "Blocked" });
    setShowAdd(false);
    await saveAvailabilityStateForDate(newSlotObj.date, newSlots);
  };

  return (
    <div style={{ padding: "40px" }}>
      <div className="animate-fade" style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "6px" }}>Manage Availability</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Set and control time slot availability for each court</p>
      </div>

      {/* Filters */}
      <div className="card animate-fade" style={{ padding: "24px", marginBottom: "24px" }}>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>Select a court to view all its configured slots</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px", marginBottom: "20px" }}>
          <div className="form-group">
            <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}><FaBuilding /> Court</label>
            <select className="form-select" value={courtId} onChange={e => setCourtId(e.target.value)}>
              {courts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* Add slot form */}
        {showAdd && (
          <div style={{
            background: "var(--surface-3)", border: "1.5px solid var(--border)",
            borderRadius: "12px", padding: "20px", marginBottom: "16px",
          }}>
            <h4 style={{ fontSize: "14px", marginBottom: "16px" }}>Add New Time Slot</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: "12px", alignItems: "end" }}>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input className="form-input" type="date" min={new Date().toISOString().split('T')[0]} value={newSlot.date} onChange={e => setNewSlot(p => ({ ...p, date: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Start Time</label>
                <input className="form-input" type="time" value={newSlot.start} onChange={e => setNewSlot(p => ({ ...p, start: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">End Time</label>
                <input className="form-input" type="time" value={newSlot.end} onChange={e => setNewSlot(p => ({ ...p, end: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={newSlot.status} onChange={e => setNewSlot(p => ({ ...p, status: e.target.value }))}>
                  <option>Available</option>
                  <option>Blocked</option>
                </select>
              </div>
              <button className="btn-primary" onClick={addSlot}>Add</button>
            </div>
          </div>
        )}

        <button className="btn-primary btn-sm" onClick={() => setShowAdd(v => !v)}>
          {showAdd ? "✕ Cancel" : "+ Add Time Slot"}
        </button>
      </div>

      {/* Time slots */}
      <div className="card animate-fade" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1.5px solid var(--border)", background: "var(--surface-3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: "15px" }}>All Configured Slots — {courts.find(c => c.id === courtId)?.name || ""}</h3>
          <button className="btn-secondary btn-sm" onClick={fetchAvailability} disabled={loading} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {loading ? "Refreshing..." : <><FaSyncAlt /> Refresh</>}
          </button>
        </div>
        <table>
          <thead>
            <tr>{["Booking ID", "Date", "Start Time", "End Time", "Duration", "Status", "Action"].map(h => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {slots.length === 0 && !loading && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                  No slots configured for this court.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                  Loading...
                </td>
              </tr>
            )}
            {!loading && slots.map(s => (
              <tr key={s.id} style={s.isBooking ? { background: "#fef2f2" } : {}}>
                <td style={{ fontWeight: 600, color: s.isBooking ? "#dc2626" : "var(--text-muted)" }}>
                  {s.isBooking ? s.bookingId : "—"}
                </td>
                <td style={{ fontWeight: 600 }}>{s.date}</td>
                <td style={{ fontWeight: 600 }}>{s.start}</td>
                <td>{s.end}</td>
                <td>{s.isBooking ? "Customer Booking" : s.duration}</td>
                <td>
                  {s.isBooking ? (
                    <span style={{ background: "#fee2e2", color: "#b91c1c", padding: "4px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 600 }}>
                      🔒 Blocked — {s.bookedBy}
                    </span>
                  ) : (
                    <span className={`badge badge-${s.status.toLowerCase()}`}>{s.status}</span>
                  )}
                </td>
                <td>
                  {s.isBooking ? (
                    <span style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic" }}>Managed in Bookings</span>
                  ) : (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button className={s.status === "Available" ? "btn-danger" : "btn-success"}
                        onClick={() => toggleStatus(s.id)} style={{ fontSize: "12px", padding: "6px 12px", display: "flex", alignItems: "center", gap: "6px" }}>
                        {s.status === "Available" ? <><FaBan /> Block</> : <><FaCheck /> Unblock</>}
                      </button>
                      <button className="btn-danger" onClick={() => deleteSlot(s.id)} style={{ fontSize: "12px", padding: "6px 12px", display: "flex", alignItems: "center", gap: "6px" }}>
                        <FaTrash /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
