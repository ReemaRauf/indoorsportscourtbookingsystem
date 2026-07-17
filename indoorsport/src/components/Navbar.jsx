

export default function Navbar({ user, page, nav, onLogout }) {
  const links = [
    { key: "home", label: "Home" },
    { key: "courts", label: "Courts" },
    { key: "equipments", label: " Equipment" },
    { key: "coaches", label: " Coaches" },
    ...(user ? [{ key: "my-bookings", label: "My Bookings" }] : []),
    { key: "about", label: "About Us" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
      borderBottom: "1.5px solid var(--border)",
      boxShadow: "var(--shadow-sm)",
      height: "72px",
      display: "flex", alignItems: "center",
      padding: "0 32px",
      justifyContent: "space-between",
    }}>
      {/* Logo */}
      <div
        onClick={() => nav("home")}
        style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
      >
        <div style={{
          width: 40, height: 40, borderRadius: "10px",
          background: "linear-gradient(135deg, var(--green-500), var(--green-700))",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 12px rgba(22,163,74,0.3)", overflow: "hidden",
        }}><img src="/sportiva-logo.png" alt="Logo" style={{ width: "32px", height: "32px", objectFit: "contain" }} /></div>
        <div>
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "16px", color: "var(--green-800)", lineHeight: 1.1 }}>SPORTIVA</div>
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "12px", color: "var(--green-500)", lineHeight: 1.1 }}>INDOOR COURTS</div>
        </div>
      </div>

      {/* Nav links */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {links.map(l => (
          <button key={l.key} onClick={() => nav(l.key)} style={{
            padding: "8px 16px", borderRadius: "8px", border: "none",
            background: page === l.key ? "var(--green-100)" : "transparent",
            color: page === l.key ? "var(--green-700)" : "var(--text-secondary)",
            fontFamily: "DM Sans, sans-serif", fontWeight: 600, fontSize: "14px",
            cursor: "pointer", transition: "all 0.2s",
          }}
            onMouseEnter={e => { if (page !== l.key) e.target.style.background = "var(--surface-3)"; }}
            onMouseLeave={e => { if (page !== l.key) e.target.style.background = "transparent"; }}
          >{l.label}</button>
        ))}
      </div>

      {/* User / Auth */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {user ? (
          <>
            <div
              onClick={() => nav("profile")}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "8px 12px", borderRadius: "10px",
                background: page === "profile" ? "var(--green-50)" : "var(--surface-3)", 
                border: `1.5px solid ${page === "profile" ? "var(--green-400)" : "var(--border)"}`,
                cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={e => { if (page !== "profile") { e.currentTarget.style.background = "var(--green-50)"; e.currentTarget.style.borderColor = "var(--green-200)"; } }}
              onMouseLeave={e => { if (page !== "profile") { e.currentTarget.style.background = "var(--surface-3)"; e.currentTarget.style.borderColor = "var(--border)"; } }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "linear-gradient(135deg, var(--green-400), var(--green-600))",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontWeight: 700, fontSize: "13px",
              }}>{user.name?.charAt(0) || "U"}</div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{user.name}</div>
                {user.walletBalance > 0 && (
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--green-600)" }}>
                    Wallet: Rs. {user.walletBalance}/=
                  </div>
                )}
              </div>
            </div>
            <button onClick={onLogout} style={{
              padding: "8px 16px", border: "1.5px solid var(--border)", borderRadius: "8px",
              background: "transparent", color: "var(--text-muted)", fontFamily: "DM Sans, sans-serif",
              fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.target.style.borderColor = "#fca5a5"; e.target.style.color = "#dc2626"; }}
              onMouseLeave={e => { e.target.style.borderColor = "var(--border)"; e.target.style.color = "var(--text-muted)"; }}
            >Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => nav("login")} className="btn-secondary" style={{ padding: "8px 16px", fontSize: "13px" }}>
              Login
            </button>
            <button onClick={() => nav("admin-login")} style={{
              padding: "8px 16px", border: "1.5px solid transparent", borderRadius: "8px",
              background: "transparent", color: "var(--text-muted)", fontFamily: "DM Sans, sans-serif",
              fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.target.style.background = "var(--surface-3)"; e.target.style.color = "var(--text-primary)"; }}
              onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "var(--text-muted)"; }}
            >
              Admin
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
