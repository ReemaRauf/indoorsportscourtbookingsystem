import { useState } from "react";
import Footer from "../components/Footer";

import { MdSportsCricket } from "react-icons/md";
import { GiShuttlecock } from "react-icons/gi";
import { FaTableTennis, FaLightbulb } from "react-icons/fa";

const SPORTS_UI = {
  Cricket: { icon: <MdSportsCricket />, color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
  Badminton: { icon: <GiShuttlecock />, color: "#15803d", bg: "#f0f9ff", border: "#bae6fd" },
  "Table Tennis": { icon: <FaTableTennis />, color: "#15803d", bg: "#faf5ff", border: "#ddd6fe" },
};

export default function CoachesPage({ nav, coaches }) {
  const [activeSport, setActiveSport] = useState("Cricket");

  const sportUI = SPORTS_UI[activeSport] || SPORTS_UI["Cricket"];
  const activeCoaches = coaches?.filter(c => c.sport === activeSport) || [];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, var(--green-50) 0%, var(--surface-2) 100%)",
      paddingTop: "40px"
    }}>
      {/* Hero */}
      <div className="animate-fade" style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 48px", padding: "0 24px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "6px 18px", borderRadius: "20px",
          background: "var(--surface)", border: "1.5px solid var(--green-200)", marginBottom: "20px"
        }}>
          <span style={{ fontSize: "11px", color: "var(--green-700)", fontWeight: 700, letterSpacing: "1.5px" }}>SPORTIVA COACHING</span>
        </div>
        <h1 style={{
          fontSize: "48px", color: "var(--green-950)", marginBottom: "16px",
          fontFamily: "Syne, sans-serif", fontWeight: 800, lineHeight: 1.1
        }}>
          Professional Coaches 
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "16px", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto" }}>
          Our certified coaching staff is available for one-on-one sessions during your court booking. Select a coach when you book a court — coaching fees are included in your booking bill.
        </p>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
        {/* Sport Selector */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "32px", flexWrap: "wrap", justifyContent: "center" }}>
          {Object.entries(SPORTS_UI).map(([name, data]) => (
            <button key={name} onClick={() => setActiveSport(name)} style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "12px 24px", borderRadius: "16px",
              border: activeSport === name ? `2px solid ${data.color}` : "1.5px solid var(--border)",
              background: activeSport === name ? data.bg : "var(--surface)",
              color: activeSport === name ? data.color : "var(--text-secondary)",
              cursor: "pointer", transition: "all 0.25s ease",
              fontWeight: 700, fontSize: "15px", fontFamily: "Syne, sans-serif",
              boxShadow: activeSport === name ? "0 4px 16px rgba(22, 163, 74, 0.12)" : "none"
            }}>
              <span style={{ fontSize: "22px" }}>{data.icon}</span>
              {name}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <h2 style={{ fontSize: "26px", color: "var(--green-950)", fontFamily: "Syne, sans-serif", marginBottom: "6px" }}>
            {sportUI.icon} {activeSport} Coaches
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Available during your court booking. Rates vary per coach.
          </p>
        </div>

        {/* Coach cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "48px" }}>
          {activeCoaches.map((coach, idx) => (
            <div
              key={coach.id}
              className={`animate-fade delay-${idx + 1}`}
              style={{
                padding: "32px 24px",
                borderRadius: "20px",
                background: "var(--surface)",
                border: `1.5px solid ${sportUI.border}`,
                textAlign: "center",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                cursor: "default"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(22,163,74,0.12)";
                e.currentTarget.style.borderColor = sportUI.color;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)";
                e.currentTarget.style.borderColor = sportUI.border;
              }}
            >
              {/* Avatar */}
              <div style={{
                width: "88px", height: "88px", borderRadius: "50%",
                background: `linear-gradient(135deg, ${sportUI.color}, ${sportUI.color}cc)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontWeight: 800, fontSize: "22px",
                fontFamily: "Syne, sans-serif", margin: "0 auto 16px",
                boxShadow: `0 6px 20px ${sportUI.color}44`,
                overflow: "hidden",
                border: `3px solid ${sportUI.color}33`
              }}>
                {coach.avatar ? (
                  <img
                    src={coach.avatar}
                    alt={coach.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                    onError={e => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <span style={{ display: coach.avatar ? "none" : "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
                  {coach.name?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()}
                </span>
              </div>

              {/* Info */}
              <div style={{ fontWeight: 700, fontSize: "18px", color: "var(--green-950)", marginBottom: "4px" }}>{coach.name}</div>
              <div style={{ fontSize: "13px", color: sportUI.color, fontWeight: 700, marginBottom: "10px" }}>{coach.role}</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "16px", minHeight: "40px" }}>{coach.desc}</div>

              {/* Price */}
              <div style={{
                padding: "10px 16px", borderRadius: "12px",
                background: sportUI.bg, border: `1px solid ${sportUI.border}`,
                display: "inline-flex", alignItems: "center", gap: "6px"
              }}>
                <span style={{ fontSize: "16px", fontWeight: 800, color: sportUI.color, fontFamily: "Syne, sans-serif" }}>
                  Rs. {coach.price || 500}/=
                </span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>per hour</span>
              </div>
            </div>
          ))}
          {activeCoaches.length === 0 && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
              No coaches available for {activeSport} yet.
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="animate-fade" style={{
          textAlign: "center",
          padding: "48px 32px",
          borderRadius: "24px",
          background: "linear-gradient(135deg, var(--green-800), var(--green-950))",
          color: "white",
          boxShadow: "0 20px 48px rgba(5,46,22,0.3)"
        }}>
          <h2 style={{
            fontSize: "28px", fontFamily: "Syne, sans-serif", fontWeight: 800,
            marginBottom: "12px", lineHeight: 1.2
          }}>
            Ready to Book a Coaching Session?
          </h2>
          <p style={{
            fontSize: "15px", opacity: 0.85, lineHeight: 1.7,
            maxWidth: "500px", margin: "0 auto 28px"
          }}>
            Select a coach when booking a court — coaching fees will be added to your booking bill automatically. No separate payment needed!
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => nav("courts")}
              style={{
                padding: "14px 32px", borderRadius: "14px",
                background: "var(--green-500)", color: "white", border: "none",
                fontWeight: 700, fontSize: "16px", cursor: "pointer",
                fontFamily: "DM Sans, sans-serif",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 16px rgba(34,197,94,0.4)"
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(34,197,94,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(34,197,94,0.4)"; }}
            >
              Book a Court Now →
            </button>
            <button
              onClick={() => nav("equipments")}
              style={{
                padding: "14px 32px", borderRadius: "14px",
                background: "rgba(255,255,255,0.15)", color: "white",
                border: "1.5px solid rgba(255,255,255,0.3)",
                fontWeight: 600, fontSize: "15px", cursor: "pointer",
                fontFamily: "DM Sans, sans-serif",
                transition: "all 0.2s ease",
                backdropFilter: "blur(4px)"
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.25)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
            >
               View Equipment
            </button>
          </div>
        </div>

        {/* Info box */}
        <div style={{
          marginTop: "24px", padding: "18px 24px", borderRadius: "16px",
          background: "var(--surface)", border: "1.5px solid var(--green-200)",
          display: "flex", alignItems: "center", gap: "16px"
        }}>
          <div style={{ fontSize: "28px", flexShrink: 0 }}><FaLightbulb style={{ color: "#eab308" }} /></div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--green-950)", marginBottom: "4px" }}>
              How Coaching Works
            </div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6 }}>
              When you book a court, you'll have the option to add a coach to your session. The coaching fee (based on the coach's hourly rate) will be automatically included in your total booking bill along with any equipment rentals — one simple payment for everything.
            </div>
          </div>
        </div>
      </div>
      <Footer nav={nav} />
    </div>
  );
}
