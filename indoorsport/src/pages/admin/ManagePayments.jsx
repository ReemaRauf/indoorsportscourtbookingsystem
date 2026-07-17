import { FaCheck } from "react-icons/fa";
import { useState } from "react";

export default function ManagePayments({ bookings, onMarkPaid }) {
  const [page, setPage] = useState(1);
  const perPage = 8;

  // Filter out cancelled or rejected bookings, we only care about Confirmed
  const activeBookings = bookings.filter(b => b.status === "Confirmed");
  
  const totalPages = Math.ceil(activeBookings.length / perPage);
  const paged = activeBookings.slice((page - 1) * perPage, page * perPage);

  // Calculate totals for the summary cards
  const totalRevenue = activeBookings.reduce((sum, b) => {
    if (b.paymentStatus === "Fully Paid") return sum + b.price;
    return sum + (b.advancePaid || 0);
  }, 0);

  const pendingBalances = activeBookings.reduce((sum, b) => {
    if (b.paymentStatus === "Fully Paid") return sum;
    const balance = b.price - (b.advancePaid || 0);
    return sum + balance;
  }, 0);

  const advancePayments = activeBookings.reduce((sum, b) => sum + (b.advancePaid || 0), 0);

  return (
    <div style={{ padding: "40px" }}>
      <div className="animate-fade" style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "6px" }}>Manage Payments</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Track advance payments, balances, and total revenue.</p>
      </div>

      {/* Summary Cards */}
      <div className="animate-fade" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "32px" }}>
        <div className="card" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderLeft: "4px solid var(--green-500)" }}>
          <h3 style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "8px" }}>Total Revenue Collected</h3>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--green-700)" }}>Rs. {totalRevenue}/=</div>
        </div>
        <div className="card" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderLeft: "4px solid #3b82f6" }}>
          <h3 style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "8px" }}>Advance Payments</h3>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#2563eb" }}>Rs. {advancePayments}/=</div>
        </div>
        <div className="card" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderLeft: "4px solid #f59e0b" }}>
          <h3 style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "8px" }}>Pending Balances (To Collect)</h3>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#d97706" }}>Rs. {pendingBalances}/=</div>
        </div>
      </div>

      {/* Table */}
      <div className="card animate-fade" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1.5px solid var(--border)", background: "var(--surface-3)" }}>
          <h3 style={{ fontSize: "15px" }}>Recent Payments</h3>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {["Booking ID", "Customer", "Court", "Total Price", "Advance Paid", "Balance Due", "Status", "Action"].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {paged.map(b => {
                const balanceDue = b.paymentStatus === "Fully Paid" ? 0 : b.price - (b.advancePaid || 0);
                
                return (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 700, color: "var(--green-700)" }}>{b.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.user}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{b.phone}</div>
                    </td>
                    <td>{b.court}</td>
                    <td style={{ fontWeight: 600 }}>Rs. {b.price}/=</td>
                    <td style={{ color: "var(--green-600)" }}>
                      Rs. {b.advancePaid || 0}/=
                    </td>
                    <td style={{ color: balanceDue > 0 ? "#d97706" : "var(--text-muted)", fontWeight: balanceDue > 0 ? 700 : 400 }}>
                      Rs. {balanceDue}/=
                    </td>
                    <td>
                      {balanceDue === 0 || b.paymentStatus === "Fully Paid" ? (
                        <span className="badge badge-confirmed">Fully Paid</span>
                      ) : (
                        <span className="badge badge-pending" style={{ background: "#fef3c7", color: "#d97706" }}>Balance Pending</span>
                      )}
                    </td>
                    <td>
                      {balanceDue > 0 && b.paymentStatus !== "Fully Paid" ? (
                        <button onClick={() => onMarkPaid(b.id)} style={{
                          padding: "6px 10px", borderRadius: "7px", border: "1.5px solid var(--green-400)",
                          background: "var(--green-50)", fontSize: "12px", cursor: "pointer", fontWeight: 600,
                          color: "var(--green-700)",
                        }}><FaCheck style={{marginRight:'4px', verticalAlign:'middle'}} /> Mark Paid</button>
                      ) : (
                        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>None</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {!paged.length && (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)" }}>
                    No confirmed bookings to show.
                  </td>
                </tr>
              )}
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
    </div>
  );
}
