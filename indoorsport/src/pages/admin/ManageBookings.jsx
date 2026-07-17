import { FaEye, FaCheck, FaTimes, FaBan } from "react-icons/fa";
import { useState } from "react";

export default function ManageBookings({ bookings, onApprove, onCancel, onReject }) {
  const [filter, setFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 6;

  // Returns { badgeClass, label } based on status + cancelledBy
  const getStatusBadge = (b) => {
    if (b.status === "Cancelled") {
      if (b.cancelledBy === "admin") return { badgeClass: "badge-admin-cancelled", label: "Admin Cancelled" };
      return { badgeClass: "badge-user-cancelled", label: "User Cancelled" };
    }
    if (b.status === "Rejected") return { badgeClass: "badge-rejected", label: "Rejected" };
    if (b.status === "Confirmed") return { badgeClass: "badge-confirmed", label: "Confirmed" };
    if (b.status === "Pending") return { badgeClass: "badge-pending", label: "Pending" };
    return { badgeClass: "badge-pending", label: b.status };
  };

  const filters = ["All", "Confirmed", "User Cancelled", "Admin Cancelled"];

  const filtered = (() => {
    if (filter === "All") return bookings;
    if (filter === "User Cancelled") return bookings.filter(b => b.status === "Cancelled" && b.cancelledBy !== "admin");
    if (filter === "Admin Cancelled") return bookings.filter(b => b.status === "Cancelled" && b.cancelledBy === "admin");
    return bookings.filter(b => b.status === filter);
  })();

  const getFilterCount = (f) => {
    if (f === "All") return bookings.length;
    if (f === "User Cancelled") return bookings.filter(b => b.status === "Cancelled" && b.cancelledBy !== "admin").length;
    if (f === "Admin Cancelled") return bookings.filter(b => b.status === "Cancelled" && b.cancelledBy === "admin").length;
    return bookings.filter(b => b.status === f).length;
  };

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div style={{ padding: "40px" }}>
      <div className="animate-fade" style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "6px" }}>Manage Bookings</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Review, approve, and manage all booking requests</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {filters.map(f => (
          <button key={f} onClick={() => { setFilter(f); setPage(1); }} style={{
            padding: "8px 18px", borderRadius: "8px", border: "1.5px solid",
            borderColor: filter === f ? (f === "User Cancelled" ? "#f97316" : f === "Admin Cancelled" ? "#dc2626" : "var(--green-500)") : "var(--border)",
            background: filter === f ? (f === "User Cancelled" ? "#fff7ed" : f === "Admin Cancelled" ? "#fef2f2" : "var(--green-50)") : "var(--surface)",
            color: filter === f ? (f === "User Cancelled" ? "#c2410c" : f === "Admin Cancelled" ? "#991b1b" : "var(--green-700)") : "var(--text-muted)",
            fontFamily: "DM Sans, sans-serif", fontWeight: 600, fontSize: "13px", cursor: "pointer",
          }}>{f} {f !== "All" && <span style={{ marginLeft: "4px", fontSize: "11px" }}>({getFilterCount(f)})</span>}</button>
        ))}
      </div>

      {/* Table */}
      <div className="card animate-fade" style={{ padding: 0, overflow: "hidden" }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>{["ID", "User", "Court", "Date", "Time", "Advance Payment", "Status", "Action"].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {paged.map(b => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 700, color: "var(--green-700)" }}>{b.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.user}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{b.phone}</div>
                  </td>
                  <td>{b.court}</td>
                  <td>{b.date}</td>
                  <td style={{ fontSize: "13px" }}>{b.time}</td>
                  <td>
                    {b.advancePaid > 0 ? (
                      <span className="badge badge-confirmed" style={{ fontSize: "11px", background: "var(--green-100)", color: "var(--green-800)" }}>Rs. {b.advancePaid} Paid</span>
                    ) : (
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Unpaid</span>
                    )}
                  </td>
                  <td><span className={`badge ${getStatusBadge(b).badgeClass}`}>{getStatusBadge(b).label}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                      <button onClick={() => setSelectedBooking(b)} style={{
                        padding: "6px 10px", borderRadius: "7px", border: "1.5px solid var(--border)",
                        background: "var(--surface)", fontSize: "12px", cursor: "pointer", fontWeight: 600,
                        color: "var(--text-secondary)",
                      }}><FaEye style={{marginRight:'4px', verticalAlign:'middle'}} /> View</button>
                      {b.status === "Pending" && (
                        <>
                        <button onClick={() => onApprove(b.id)} style={{
                          padding: "6px 10px", borderRadius: "7px", border: "1.5px solid var(--green-400)",
                          background: "var(--green-50)", fontSize: "12px", cursor: "pointer", fontWeight: 600,
                          color: "var(--green-700)",
                        }}><FaCheck style={{marginRight:'4px', verticalAlign:'middle'}} /> Approve</button>
                        <button onClick={() => setRejectTarget(b)} style={{
                          padding: "6px 10px", borderRadius: "7px", border: "1.5px solid #fca5a5",
                          background: "#fef2f2", fontSize: "12px", cursor: "pointer", fontWeight: 600,
                          color: "#dc2626",
                        }}><FaBan style={{marginRight:'4px', verticalAlign:'middle'}} /> Reject</button>
                        </>
                      )}
                      {b.status === "Confirmed" && (
                        <button className="btn-danger" onClick={() => setCancelTarget(b)} style={{ padding: "6px 10px", fontSize: "12px" }}>
                          <FaTimes style={{marginRight:'4px', verticalAlign:'middle'}} /> Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end" }}>
            <div className="pagination">
              <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} className={`page-btn ${page === p ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))}>›</button>
            </div>
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: "520px" }}>
            <button className="modal-close" onClick={() => setSelectedBooking(null)}>✕</button>
            <h2 style={{ fontSize: "20px", marginBottom: "24px" }}>Booking Details</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {[
                ["Booking ID", selectedBooking.id],
                ["User", selectedBooking.user],
                ["Phone", selectedBooking.phone],
                ["Court", selectedBooking.court],
                ["Date", selectedBooking.date],
                ["Time", selectedBooking.time],
                ["Type", selectedBooking.type],
                ...(selectedBooking.package !== "—" ? [["Package", selectedBooking.package]] : []),
                ...(selectedBooking.coach ? [["Selected Coach", selectedBooking.coach]] : []),
                ...(selectedBooking.equipments && selectedBooking.equipments.length > 0 ? [["Rented Equipments", selectedBooking.equipments.map(e => `${e.name} (x${e.quantity})`).join(", ")]] : []),
                ["Amount", `${selectedBooking.price}/=`],
                ...(selectedBooking.advancePaid > 0 ? [["Advance Paid", `Rs. ${selectedBooking.advancePaid}/=`]] : []),
                ...(selectedBooking.paymentStatus ? [["Payment Status", selectedBooking.paymentStatus]] : []),
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600 }}>{k}</span>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>{v}</span>
                </div>
              ))}
              {/* Status row with badge */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0" }}>
                <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600 }}>Status</span>
                <span className={`badge ${getStatusBadge(selectedBooking).badgeClass}`}>{getStatusBadge(selectedBooking).label}</span>
              </div>

            </div>
            {(selectedBooking.status === "Pending" || selectedBooking.status === "Confirmed") && (
              <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                {selectedBooking.status === "Pending" && (
                  <>
                  <button className="btn-primary" style={{ flex: 1, padding: "12px", background: "var(--green-600)", borderColor: "var(--green-600)" }} onClick={() => { onApprove(selectedBooking.id); setSelectedBooking(null); }}>
                    <FaCheck style={{marginRight:'4px', verticalAlign:'middle'}} /> Approve Booking
                  </button>
                  <button className="btn-danger" style={{ flex: 1, padding: "12px" }} onClick={() => { setRejectTarget(selectedBooking); setSelectedBooking(null); }}>
                    <FaBan style={{marginRight:'4px', verticalAlign:'middle'}} /> Reject Booking
                  </button>
                  </>
                )}
                {selectedBooking.status === "Confirmed" && (
                  <button className="btn-danger" style={{ flex: 1, padding: "12px" }} onClick={() => { setCancelTarget(selectedBooking); setSelectedBooking(null); }}>
                    <FaTimes style={{marginRight:'4px', verticalAlign:'middle'}} /> Cancel Booking
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cancel Reason Modal — for Confirmed bookings */}
      {cancelTarget && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: "400px" }}>
            <h2 style={{ fontSize: "20px", marginBottom: "16px", color: "#dc2626" }}>Cancel Booking</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "16px", fontSize: "14px" }}>
              Please provide a reason for cancelling booking <strong>{cancelTarget.id}</strong>. This will be emailed to the customer.
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation..."
              style={{
                width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)",
                minHeight: "100px", fontFamily: "inherit", marginBottom: "20px", resize: "none"
              }}
            />
            <div style={{ display: "flex", gap: "12px" }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => { setCancelTarget(null); setCancelReason(""); }}>Back</button>
              <button className="btn-danger" style={{ flex: 1 }} onClick={() => {
                onCancel(cancelTarget.id, cancelReason);
                setCancelTarget(null);
                setCancelReason("");
              }}>Confirm Cancellation</button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectTarget && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: "400px" }}>
            <h2 style={{ fontSize: "20px", marginBottom: "16px", color: "#dc2626" }}>Reject Booking</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "16px", fontSize: "14px" }}>
              Please provide a reason for rejecting booking <strong>{rejectTarget.id}</strong>. This will be emailed to the customer.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              style={{
                width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)",
                minHeight: "100px", fontFamily: "inherit", marginBottom: "20px", resize: "none"
              }}
            />
            <div style={{ display: "flex", gap: "12px" }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => { setRejectTarget(null); setRejectReason(""); }}>Back</button>
              <button className="btn-danger" style={{ flex: 1 }} onClick={() => {
                onReject(rejectTarget.id, rejectReason);
                setRejectTarget(null);
                setRejectReason("");
              }}>Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
