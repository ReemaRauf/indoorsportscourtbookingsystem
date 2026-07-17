import { FaUsers, FaBuilding, FaClipboardList, FaCalendarAlt, FaDumbbell, FaGraduationCap, FaBox, FaSignOutAlt, FaMoneyBillWave, FaChartBar } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

export default function AdminSidebar({ page, nav, onLogout }) {
  const links = [
    { key: "admin-dashboard", icon: <MdDashboard />, label: "Dashboard" },
    { key: "admin-users", icon: <FaUsers />, label: "Manage Users" },
    { key: "admin-courts", icon: <FaBuilding />, label: "Manage Courts" },
    { key: "admin-packages", icon: <FaBox />, label: "Manage Packages" },
    { key: "admin-equipments", icon: <FaDumbbell />, label: "Manage Equipments " },
    { key: "admin-coaches", icon: <FaGraduationCap />, label: "Manage Coaches" },
    { key: "admin-coach-leaves", icon: <FaCalendarAlt />, label: "Manage Coach Leaves" },
    { key: "admin-bookings", icon: <FaClipboardList />, label: "Manage Bookings" },
    { key: "admin-payments", icon: <FaMoneyBillWave />, label: "Manage Payments" },
    { key: "admin-availability", icon: <FaCalendarAlt />, label: "Manage Availabilities" },
    { key: "admin-reports", icon: <FaChartBar />, label: "Reports" },
  ];

  return (
    <aside style={{
      width: "240px", minHeight: "100vh", flexShrink: 0,
      background: "var(--dark-2, #111711)",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      display: "flex", flexDirection: "column",
      padding: "0",
      position: "sticky", top: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: "24px 20px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <div style={{
            width: 32, height: 32, borderRadius: "8px",
            background: "linear-gradient(135deg, var(--green-400), var(--green-600))",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)"
          }}><img src="/sportiva-logo.png" alt="Logo" style={{ width: "20px", height: "20px", objectFit: "contain" }} /></div>
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "20px", color: "white", letterSpacing: "0.5px" }}>SPORTIVA</div>
        </div>
        <div style={{ fontSize: "11px", color: "var(--green-400)", fontWeight: 600, letterSpacing: "1px" }}>ADMIN PANEL</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
        {links.map(l => (
          <button key={l.key} onClick={() => nav(l.key)} style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "10px 12px", borderRadius: "10px",
            border: "none", width: "100%", textAlign: "left",
            background: page === l.key ? "rgba(34,197,94,0.15)" : "transparent",
            color: page === l.key ? "var(--green-400)" : "rgba(255,255,255,0.6)",
            fontFamily: "DM Sans, sans-serif", fontWeight: 600, fontSize: "13.5px",
            cursor: "pointer", transition: "all 0.2s",
            borderLeft: page === l.key ? "3px solid var(--green-500)" : "3px solid transparent",
          }}
            onMouseEnter={e => { if (page !== l.key) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "white"; }}}
            onMouseLeave={e => { if (page !== l.key) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}}
          >
            <span style={{ fontSize: "16px" }}>{l.icon}</span>
            {l.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button onClick={onLogout} style={{
          display: "flex", alignItems: "center", gap: "12px",
          padding: "10px 12px", borderRadius: "10px",
          border: "none", width: "100%", textAlign: "left",
          background: "transparent", color: "rgba(255,255,255,0.4)",
          fontFamily: "DM Sans, sans-serif", fontWeight: 600, fontSize: "13.5px", cursor: "pointer",
          transition: "all 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(220,38,38,0.1)"; e.currentTarget.style.color = "#f87171"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
        >
          <span style={{ fontSize: "16px" }}><FaSignOutAlt /></span> Logout
        </button>
      </div>
    </aside>
  );
}
