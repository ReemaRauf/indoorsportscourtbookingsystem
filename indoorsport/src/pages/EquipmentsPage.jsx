import { useState } from "react";
import Footer from "../components/Footer";

import { MdSportsCricket } from "react-icons/md";
import { GiShuttlecock } from "react-icons/gi";
import { FaTableTennis, FaLightbulb } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
const resolveImage = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  if (img.startsWith("/images")) return img;
  return `${API_BASE}${img}`;
};

const SPORTS_DATA = {
  Cricket: {
    icon: <MdSportsCricket />,
    color: "#15803d",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    equipments: [
      { id: "bat", name: "Cricket Bat", price: 500, unit: "each", desc: "Premium grade-A English Willow bat for optimal stroke play.", icon: "🏏", image: "/images/equipments/bat.png" },
      { id: "ball", name: "Leather Ball", price: 100, unit: "each", desc: "Standard 5.5oz leather cricket ball for tournament play.", icon: "⚾", image: "/images/equipments/ball.png" },
      { id: "stumps", name: "Stumps Set", price: 350, unit: "set", desc: "Full set of spring-back wooden stumps with bails.", icon: "🎴", image: "/images/equipments/stumps.png" },
      { id: "gloves", name: "Batting Gloves", price: 200, unit: "pair", desc: "High-impact absorbing foam gloves with premium leather palm.", icon: "🧤", image: "/images/equipments/gloves.png" },
      { id: "pads", name: "Leg Guards (Pads)", price: 200, unit: "pair", desc: "Lightweight contoured batting leg pads for maximum mobility.", icon: "🛡️", image: "/images/equipments/pads.png" },
      { id: "helmet", name: "Helmet", price: 400, unit: "each", desc: "Steel visor certified helmet with adjustable strap.", icon: "🪖", image: "/images/equipments/helmet.png" },
    ],
  },
  Badminton: {
    icon: <GiShuttlecock />,
    color: "#15803d",
    bg: "#f0f9ff",
    border: "#bae6fd",
    equipments: [
      { id: "racket", name: "Racket Pair ", price: 350, unit: "couple", desc: "Carbon fiber lightweight rackets for perfect control and smash.", icon: "🏸", image: "/images/equipments/racket.png" },
      { id: "shuttle", name: "Shuttlecock", price: 50, unit: "each", desc: "Premium nylon shuttlecocks with high durability and stable flight.", icon: "🏸", image: "/images/equipments/shuttlecock.png" },
    ],
  },
  "Table Tennis": {
    icon: <FaTableTennis />,
    color: "#15803d",
    bg: "#faf5ff",
    border: "#ddd6fe",
    equipments: [
      { id: "ttball", name: "TT Ball", price: 100, unit: "each", desc: "Standard 3-star 40mm seamless table tennis balls for high speed.", icon: "🏓", image: "/images/equipments/ttball.png" },
      { id: "paddle", name: "Paddle Couple", price: 350, unit: "couple", desc: "Double-sided rubber paddles with optimal grip and bounce.", icon: "🏓", image: "/images/equipments/paddle.png" },
    ],
  },
};

export default function EquipmentsPage({ nav, equipments = [] }) {
  const [activeSport, setActiveSport] = useState("Cricket");

  const sport = SPORTS_DATA[activeSport];
  const availableEquipments = equipments.filter(e => e.sport === activeSport);

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
          <span style={{ fontSize: "11px", color: "var(--green-700)", fontWeight: 700, letterSpacing: "1.5px" }}>SPORTIVA RENTALS</span>
        </div>
        <h1 style={{
          fontSize: "48px", color: "var(--green-950)", marginBottom: "16px",
          fontFamily: "Syne, sans-serif", fontWeight: 800, lineHeight: 1.1
        }}>
          Sports Equipment 
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "16px", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto" }}>
          Browse our premium sports equipment available for rental. Add equipment to your booking when you reserve a court — all prices are included in your booking bill.
        </p>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
        {/* Sport Selector */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "32px", flexWrap: "wrap", justifyContent: "center" }}>
          {Object.entries(SPORTS_DATA).map(([name, data]) => (
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

        {/* Header */}
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <h2 style={{ fontSize: "26px", color: "var(--green-950)", fontFamily: "Syne, sans-serif", marginBottom: "6px" }}>
            {sport.icon} {activeSport} Equipment
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            All prices are per-unit rental • Added to your booking bill
          </p>
        </div>

        {/* Equipment Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "20px",
          marginBottom: "48px"
        }}>
          {availableEquipments.map((eq, idx) => (
            <div
              key={eq.id}
              className={`animate-fade delay-${Math.min(idx + 1, 4)}`}
              style={{
                display: "flex", flexDirection: "column",
                borderRadius: "20px",
                background: "var(--surface)",
                border: `1.5px solid ${sport.border}`,
                transition: "all 0.3s ease",
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                overflow: "hidden",
                cursor: "pointer"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = `0 16px 40px ${sport.color}25`;
                e.currentTarget.style.borderColor = sport.color;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)";
                e.currentTarget.style.borderColor = sport.border;
              }}
            >
              {/* Image Area */}
              <div style={{
                width: "100%", height: "200px",
                background: sport.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden",
                position: "relative"
              }}>
                {eq.image ? (
                  <img
                    src={resolveImage(eq.image)}
                    alt={eq.name}
                    style={{
                      width: "100%", height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.4s ease"
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.07)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    onError={e => { e.target.style.display='none'; }}
                  />
                ) : (
                  <span style={{ fontSize: "72px" }}>{eq.icon}</span>
                )}
                {/* Price badge */}
                <div style={{
                  position: "absolute", top: "12px", right: "12px",
                  background: sport.color,
                  color: "#fff",
                  borderRadius: "20px",
                  padding: "4px 12px",
                  fontSize: "13px",
                  fontWeight: 700,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                }}>
                  Rs. {eq.price}
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: "16px 18px" }}>
                <div style={{ fontWeight: 700, fontSize: "16px", color: "var(--green-950)", marginBottom: "4px" }}>{eq.name}</div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "10px", lineHeight: 1.5 }}>{eq.desc}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "17px", fontWeight: 800, color: sport.color, fontFamily: "Syne, sans-serif" }}>
                    Rs. {eq.price}/=
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>per {eq.unit}</span>
                </div>
              </div>
            </div>
          ))}
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
            Ready to Rent Equipment?
          </h2>
          <p style={{
            fontSize: "15px", opacity: 0.85, lineHeight: 1.7,
            maxWidth: "500px", margin: "0 auto 28px"
          }}>
            Add equipment when booking a court — rental fees will be included in your booking bill automatically. No separate payment needed!
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
              onClick={() => nav("coaches")}
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
               View Coaches
            </button>
          </div>
        </div>

        {/* Info box */}
        <div style={{
          marginTop: "24px", padding: "18px 24px", borderRadius: "16px",
          background: "var(--surface)", border: "1.5px solid var(--green-200)",
          display: "flex", alignItems: "center", gap: "16px"
        }}>
          <div style={{ fontSize: "28px", flexShrink: 0 }}><FaLightbulb style={{ color: "#2aea08ff" }} /></div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--green-950)", marginBottom: "4px" }}>
              How Equipment Rental Works
            </div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6 }}>
              When you book a court, you can browse and add rental equipment to your session. The total equipment fee will be automatically calculated and included in your final booking bill — no separate payments required!
            </div>
          </div>
        </div>
      </div>
      <Footer nav={nav} />
    </div>
  );
}
