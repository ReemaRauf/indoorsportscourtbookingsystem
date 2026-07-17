import { FaClipboardList, FaCalendarDay, FaMoneyBillWave, FaHourglassHalf } from "react-icons/fa";

export default function AdminDashboard({ bookings, nav }) {
  const total = bookings.length;
  // Dynamic "today" matching — handles multiple date formats (YYYY-MM-DD, DD Mon YYYY, etc.)
  const now = new Date();
  const todayISO = now.toISOString().split("T")[0]; // "2026-07-01"
  const todayLocal = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); // "01 Jul 2026"
  const todayLocal2 = now.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }); // "Jul 01, 2026"
  const today = bookings.filter(b => (b.createdAt && b.createdAt.startsWith(todayISO)) || b.date === todayISO || b.date === todayLocal || b.date === todayLocal2).length;
  const revenue = bookings.filter(b => b.status === "Confirmed").reduce((s, b) => s + (b.price || 0), 0);
  const recent = bookings.slice(0, 5);

  const statusColor = { Confirmed: "confirmed", Pending: "pending", Cancelled: "cancelled", Rejected: "rejected" };

  const stats = [
    { label: "Total Bookings", value: total, icon: <FaClipboardList />, color: "var(--green-600)", bg: "var(--green-50)" },
    { label: "Today's Bookings", value: today, icon: <FaCalendarDay />, color: "#7c3aed", bg: "#f5f3ff" },
    { label: "Total Revenue", value: `${revenue.toLocaleString()}/=`, icon: <FaMoneyBillWave />, color: "#d97706", bg: "#fffbeb" },
    { label: "Cancelled Bookings", value: bookings.filter(b => b.status === "Cancelled").length, icon: <FaHourglassHalf />, color: "#dc2626", bg: "#fef2f2" },
  ];

  return (
    <div style={{ padding: "40px" }}>
      {/* Header */}
      <div className="animate-fade" style={{ marginBottom: "36px" }}>
        <h1 style={{ fontSize: "30px", marginBottom: "6px" }}>Admin Dashboard</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "36px" }}>
        {stats.map((s, i) => (
          <div key={s.label} className={`card animate-fade delay-${i + 1}`} style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{
                width: 44, height: 44, borderRadius: "11px",
                background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px",
              }}>{s.icon}</div>
            </div>
            <div style={{ fontSize: "28px", fontFamily: "Syne, sans-serif", fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px", fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="card animate-fade" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px", borderBottom: "1.5px solid var(--border)", background: "var(--surface-3)",
        }}>
          <h3 style={{ fontSize: "17px" }}>Recent Bookings</h3>
          <button className="btn-secondary btn-sm" onClick={() => nav("admin-bookings")}>View All →</button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>{["ID", "User", "Court", "Date", "Time", "Status"].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {recent.map(b => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 700, color: "var(--green-700)" }}>{b.id}</td>
                  <td>{b.user}</td>
                  <td>{b.court}</td>
                  <td>{b.date}</td>
                  <td>{b.time}</td>
                  <td><span className={`badge badge-${statusColor[b.status] || "pending"}`}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
