import { MdLocationOn, MdPhone, MdEmail } from "react-icons/md";

export default function Footer({ nav }) {
  return (
    <footer style={{ background: "var(--green-950)", color: "rgba(255,255,255,0.7)", padding: "36px 40px 24px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{ width: "32px", height: "32px", background: "white", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src="/sportiva-logo.png" style={{ width: "24px", height: "24px", objectFit: "contain" }} alt="SPORTIVA Logo" />
            </div>
            <h3 style={{ color: "white", fontSize: "18px", fontFamily: "Syne, sans-serif" }}>SPORTIVA</h3>
          </div>
          <p style={{ fontSize: "13px", lineHeight: 1.7 }}>
            Experience the future of indoor sports with our state-of-the-art facilities and seamless online booking system.
          </p>
        </div>
        <div>
          <h4 style={{ color: "white", marginBottom: "16px", fontSize: "15px", fontFamily: "Syne, sans-serif" }}>Quick Links</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
            <span style={{ cursor: "pointer" }} onClick={() => nav("home")}>Home</span>
            <span style={{ cursor: "pointer" }} onClick={() => nav("courts")}>Courts</span>
            <span style={{ cursor: "pointer" }} onClick={() => nav("equipments")}>Equipments</span>
            <span style={{ cursor: "pointer" }} onClick={() => nav("coaches")}>Coaches</span>
            <span style={{ cursor: "pointer" }} onClick={() => nav("my-bookings")}>My Bookings</span>
            <span style={{ cursor: "pointer" }} onClick={() => nav("about")}>About Us</span>
          </div>
        </div>
        <div>
          <h4 style={{ color: "white", marginBottom: "16px", fontSize: "15px", fontFamily: "Syne, sans-serif" }}>Further Links</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
            <span style={{ cursor: "pointer" }}>Terms & Conditions</span>
            <span style={{ cursor: "pointer" }}>Privacy Policy</span>
          </div>
        </div>
        <div>
          <h4 style={{ color: "white", marginBottom: "16px", fontSize: "15px", fontFamily: "Syne, sans-serif" }}>Get In Touch</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "13px" }}>
            <span style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <MdLocationOn size={16} color="#4ade80" style={{ marginTop: "1px", flexShrink: 0 }} />
              42, Mallawapitiya, Kurunegala
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <MdPhone size={16} color="#4ade80" style={{ flexShrink: 0 }} />
              +94 74 123 3030
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <MdEmail size={16} color="#4ade80" style={{ flexShrink: 0 }} />
              support@sportiva.com
            </span>
          </div>
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: "28px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.1)", fontSize: "12px" }}>
          &copy; {new Date().getFullYear()} SPORTIVA Indoor Sport Court
      </div>
    </footer>
  );
}
