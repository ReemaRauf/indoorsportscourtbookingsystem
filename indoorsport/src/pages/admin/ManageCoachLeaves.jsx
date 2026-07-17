import { useState, useEffect } from "react";
import { FaChalkboardTeacher, FaSyncAlt, FaBan, FaCheck, FaTrash } from "react-icons/fa";
import api from "../../api";

export default function ManageCoachLeaves({ coaches }) {
  const getLocalDate = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split("T")[0];
  };

  const [coachId, setCoachId] = useState("");
  const [slots, setSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({ date: getLocalDate(), start: "", end: "", status: "Blocked" });
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/coach-availability`);
      setSlots(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveAvailabilityStateForDate = async (targetDate, targetCoachId, newSlots) => {
    setSaving(true);
    try {
      const slotsForDate = newSlots.filter(s => s.date === targetDate && s.coachId === targetCoachId);
      const slotsToSave = slotsForDate.map(({date, coachId, ...rest}) => rest);
      await api.post("/coach-availability", { coachId: targetCoachId, date: targetDate, slots: slotsToSave });
    } catch (err) {
      console.error(err);
      alert("Failed to auto-save availability");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (id) => {
    const targetSlot = slots.find(s => s.id === id);
    if (!targetSlot) return;
    const newSlots = slots.map(s => s.id === id ? { ...s, status: s.status === "Available" ? "Blocked" : "Available" } : s);
    setSlots(newSlots);
    await saveAvailabilityStateForDate(targetSlot.date, targetSlot.coachId, newSlots);
  };

  const deleteSlot = async (id) => {
    const targetSlot = slots.find(s => s.id === id);
    if (!targetSlot) return;
    const newSlots = slots.filter(s => s.id !== id);
    setSlots(newSlots);
    await saveAvailabilityStateForDate(targetSlot.date, targetSlot.coachId, newSlots);
  };

  const addSlot = async () => {
    if (!newSlot.start || !newSlot.end || !newSlot.date || !coachId) return;
    const newSlotObj = { id: Date.now(), date: newSlot.date, start: newSlot.start, end: newSlot.end, duration: "Leave", status: newSlot.status, coachId };
    const newSlots = [...slots, newSlotObj];
    setSlots(newSlots.sort((a,b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.start.localeCompare(b.start);
    }));
    setNewSlot({ date: getLocalDate(), start: "", end: "", status: "Blocked" });
    setShowAdd(false);
    await saveAvailabilityStateForDate(newSlotObj.date, coachId, newSlots);
  };

  const selectedCoach = coaches?.find(c => c.id === coachId);

  return (
    <div style={{ padding: "40px" }}>
      <div className="animate-fade" style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "6px" }}>Manage Coach Leaves</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Set and control personal leave slots for coaches</p>
      </div>

      <div className="card animate-fade" style={{ padding: "24px", marginBottom: "24px" }}>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>Manage leave slots for coaches</p>

        {/* Add slot form */}
        {showAdd && (
          <div style={{
            background: "var(--surface-3)", border: "1.5px solid var(--border)",
            borderRadius: "12px", padding: "20px", marginBottom: "16px",
          }}>
            <h4 style={{ fontSize: "14px", marginBottom: "16px" }}>Add New Leave Slot</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr auto", gap: "12px", alignItems: "end" }}>
              <div className="form-group">
                <label className="form-label">Coach</label>
                <select className="form-select" value={coachId} onChange={e => setCoachId(e.target.value)}>
                  <option value="">Select Coach</option>
                  {coaches?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
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
                  <option>Blocked</option>
                  <option>Available</option>
                </select>
              </div>
              <button className="btn-primary" onClick={addSlot}>Add Leave</button>
            </div>
          </div>
        )}

        <button className="btn-primary btn-sm" onClick={() => setShowAdd(v => !v)}>
          {showAdd ? "✕ Cancel" : "+ Add Leave Slot"}
        </button>
      </div>

      {/* Time slots */}
      <div className="card animate-fade" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1.5px solid var(--border)", background: "var(--surface-3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: "15px" }}>All Leave Slots</h3>
          <button className="btn-secondary btn-sm" onClick={fetchAvailability} disabled={loading || saving} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {loading ? "Refreshing..." : <><FaSyncAlt /> Refresh</>}
          </button>
        </div>
        <table>
          <thead>
            <tr>{["Coach ID", "Avatar", "Name", "Date", "Start Time", "End Time", "Type", "Status", "Action"].map(h => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {slots.length === 0 && !loading && (
              <tr>
                <td colSpan="9" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                  No leave slots configured for this coach.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan="9" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                  Loading...
                </td>
              </tr>
            )}
            {!loading && slots.map(s => (
              <tr key={s.id} style={s.isBooking ? { background: "#fef2f2" } : {}}>
                <td style={{ fontWeight: 600 }}>{s.coachId || "—"}</td>
                <td>
                  <div style={{width: '32px', height: '32px', borderRadius: '50%', background: '#eee', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    {coaches?.find(c => c.id === s.coachId)?.avatar ? (
                      <img src={coaches?.find(c => c.id === s.coachId)?.avatar} alt="Avatar" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                    ) : (
                      <FaChalkboardTeacher size={16} color="#999" />
                    )}
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>{coaches?.find(c => c.id === s.coachId)?.name || "—"}</td>
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
                    <span className={`badge badge-${s.status === 'Available' ? 'available' : 'blocked'}`} style={{background: s.status === 'Available' ? 'var(--green-100)' : '#fee2e2', color: s.status === 'Available' ? 'var(--green-800)' : '#b91c1c'}}>{s.status}</span>
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
