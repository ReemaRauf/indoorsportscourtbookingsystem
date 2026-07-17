import { useState } from "react";

const SPORTS_DATA = {
  Cricket: {
    icon: "🏏",
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
    coaches: [
      { id: "mahela", name: "Mahela Perera", role: "Batting & Technique", avatar: "MP", color: "#166534" },
      { id: "lasith", name: "Lasith ", role: "Fast Bowling Expert", avatar: "LF", color: "#15803d" },
      { id: "rangana", name: "Rangana Mendis", role: "Spin & Strategy", avatar: "RM", color: "#16a34a" },
    ],
  },
  Badminton: {
    icon: "🏸",
   color: "#15803d",
    bg: "#f0f9ff",
    border: "#bae6fd",
    equipments: [
      { id: "racket", name: "Racket Pair (Couple)", price: 350, unit: "couple", desc: "Carbon fiber lightweight rackets for perfect control and smash.", icon: "🏸", image: "/images/equipments/racket.png" },
      { id: "shuttle", name: "Shuttlecock", price: 50, unit: "each", desc: "Premium nylon shuttlecocks with high durability and stable flight.", icon: "🏸", image: "/images/equipments/shuttlecock.png" },
    ],
    coaches: [
      { id: "fayas", name: "fayas", role: "National Champion Coach", avatar: "RD", color: "#15803d" },
      { id: "arjuna", name: "Arjuna Ranasinghe", role: "Junior Head Coach", avatar: "AR", color: "#15803d" },
      { id: "dilhani", name: "Dilhani Fernando", role: "Defense Specialist", avatar: "DF", color:"#15803d" },
    ],
  },
  "Table Tennis": {
    icon: "🏓",
    color: "#15803d",
    bg: "#faf5ff",
    border: "#ddd6fe",
    equipments: [
      { id: "ttball", name: "TT Ball", price: 100, unit: "each", desc: "Standard 3-star 40mm seamless table tennis balls for high speed.", icon: "🏓", image: "/images/equipments/ttball.png" },
      { id: "paddle", name: "Paddle Couple", price: 350, unit: "couple", desc: "Double-sided rubber paddles with optimal grip and bounce.", icon: "🏓", image: "/images/equipments/paddle.png" },
    ],
    coaches: [
      { id: "chen", name: "Chen Wijetunga", role: "ITTF Certified Coach", avatar: "CW", color: "#15803d" },
      { id: "kavinda", name: "Kavinda Bandara", role: "Spin Specialist", avatar: "KB", color: "#15803d" },
      { id: "anura", name: "Anura Alwis", role: "Footwork Coach", avatar: "AA", color: "#15803d" },
    ],
  },
};

const COACH_RATE = 500;

export default function EquipmentsCoachesPage({ nav }) {
  const [activeSport, setActiveSport] = useState("Cricket");
  const [quantities, setQuantities] = useState({});   // { "Cricket-bat": 2, ... }
  const [selectedCoach, setSelectedCoach] = useState(null);  // { sport, id, name, role }
  const [coachHours, setCoachHours] = useState(1);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState("equipment"); // "equipment" | "coach"

  const sport = SPORTS_DATA[activeSport];

  const getQty = (sport, id) => quantities[`${sport}-${id}`] || 0;

  const setQty = (sport, id, val) => {
    const key = `${sport}-${id}`;
    setQuantities(prev => ({ ...prev, [key]: Math.max(0, val) }));
  };

  // Calculate equipment total for all sports
  const equipmentTotal = Object.entries(SPORTS_DATA).reduce((total, [sName, sData]) => {
    return total + sData.equipments.reduce((t, eq) => t + getQty(sName, eq.id) * eq.price, 0);
  }, 0);

  // Coach total
  const coachTotal = selectedCoach ? coachHours * COACH_RATE : 0;
  const grandTotal = equipmentTotal + coachTotal;

  // Count total items selected
  const totalItems = Object.values(quantities).reduce((s, v) => s + v, 0);

  // Items added for current sport
  const currentSportItems = sport.equipments.filter(eq => getQty(activeSport, eq.id) > 0);

  const handleSubmit = () => setOrderSubmitted(true);

  if (orderSubmitted) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div className="animate-scale" style={{
          background: "var(--surface)",
          border: "2px solid var(--green-300)",
          borderRadius: "24px",
          padding: "60px 48px",
          maxWidth: "520px",
          width: "100%",
          textAlign: "center",
          boxShadow: "var(--shadow-xl)"
        }}>
          <div style={{ fontSize: "72px", marginBottom: "24px" }}>🎉</div>
          <h2 style={{ fontSize: "28px", color: "var(--green-800)", marginBottom: "12px", fontFamily: "Syne, sans-serif" }}>
            Order Confirmed!
          </h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "28px" }}>
            Your equipment & coaching session has been successfully booked. Our staff will prepare everything before your session.
          </p>
          <div style={{ background: "var(--green-50)", border: "1.5px solid var(--green-200)", borderRadius: "16px", padding: "20px", marginBottom: "28px" }}>
            <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "6px", fontWeight: 600 }}>TOTAL PAID</div>
            <div style={{ fontSize: "36px", fontWeight: 800, color: "var(--green-700)", fontFamily: "Syne, sans-serif" }}>Rs. {grandTotal.toLocaleString()}/=</div>
          </div>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button className="btn-primary" onClick={() => { setOrderSubmitted(false); setQuantities({}); setSelectedCoach(null); setCoachHours(1); }}>
              New Order
            </button>
            <button className="btn-secondary" onClick={() => nav("courts")}>
              Book a Court
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface)", paddingTop: "40px", paddingBottom: "100px" }}>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="animate-fade" style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 48px", padding: "0 24px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "6px 18px", borderRadius: "20px",
          background: "var(--green-50)", border: "1.5px solid var(--border)",
          marginBottom: "20px"
        }}>
          <span style={{ fontSize: "11px", color: "var(--green-700)", fontWeight: 700, letterSpacing: "1.5px" }}>SPORTIVA ADD-ONS</span>
        </div>
        <h1 style={{ fontSize: "48px", color: "var(--green-950)", marginBottom: "16px", fontFamily: "Syne, sans-serif", fontWeight: 800, lineHeight: 1.1 }}>
          Gear Up &amp; Get Coached 
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "16px", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto" }}>
           premium sports equipment and book one-on-one coaching with our certified professionals — all in one place.
        </p>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr 340px", gap: "32px", alignItems: "start" }}>

        {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
        <div>
          {/* Sport Selector */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "32px", flexWrap: "wrap" }}>
            {Object.entries(SPORTS_DATA).map(([name, data]) => (
              <button
                key={name}
                onClick={() => setActiveSport(name)}
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "12px 24px", borderRadius: "16px",
                  border: activeSport === name ? `2px solid ${data.color}` : "1.5px solid var(--border)",
                  background: activeSport === name ? data.bg : "var(--surface)",
                  color: activeSport === name ? data.color : "var(--text-secondary)",
                  cursor: "pointer", transition: "all 0.25s ease",
                  fontWeight: 700, fontSize: "15px", fontFamily: "Syne, sans-serif",
                  boxShadow: activeSport === name ? "var(--shadow-md)" : "none"
                }}
              >
                <span style={{ fontSize: "22px" }}>{data.icon}</span>
                {name}
                {Object.keys(SPORTS_DATA[name].equipments).some((_, i) => getQty(name, SPORTS_DATA[name].equipments[i].id) > 0) && (
                  <span style={{ background: data.color, color: "white", borderRadius: "50%", width: "18px", height: "18px", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                    {SPORTS_DATA[name].equipments.reduce((s, eq) => s + getQty(name, eq.id), 0)}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab switcher */}
          <div style={{ display: "flex", gap: "0", marginBottom: "28px", borderRadius: "14px", background: "var(--surface-2)", border: "1.5px solid var(--border)", padding: "4px", width: "fit-content" }}>
            {[
              { id: "equipment", label: "🎒 Equipment" },
              { id: "coach", label: "🎓 Coaches" }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: "9px 24px", borderRadius: "11px", border: "none",
                  background: activeTab === t.id ? "var(--surface)" : "transparent",
                  color: activeTab === t.id ? "var(--green-800)" : "var(--text-muted)",
                  fontWeight: 700, fontSize: "14px", cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: activeTab === t.id ? "var(--shadow-sm)" : "none"
                }}
              >{t.label}</button>
            ))}
          </div>

          {/* ── EQUIPMENT TAB ── */}
          {activeTab === "equipment" && (
            <div className="animate-fade">
              <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: "22px", color: "var(--green-950)", fontFamily: "Syne, sans-serif" }}>
                  {sport.icon} {activeSport} Equipment
                </h2>
                <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600 }}>
                  Price per unit
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {sport.equipments.map(eq => {
                  const qty = getQty(activeSport, eq.id);
                  return (
                    <div
                      key={eq.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "90px 1fr auto",
                        gap: "16px",
                        alignItems: "center",
                        padding: "18px 20px",
                        borderRadius: "16px",
                        background: qty > 0 ? sport.bg : "var(--surface-2)",
                        border: qty > 0 ? `1.5px solid ${sport.border}` : "1.5px solid var(--border)",
                        transition: "all 0.25s ease",
                      }}
                    >
                      {/* Icon / Image */}
                      <div style={{
                        width: "90px", height: "90px", borderRadius: "16px",
                        background: qty > 0 ? `${sport.color}15` : "var(--surface-3)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, overflow: "hidden",
                        border: `2px solid ${qty > 0 ? sport.color + "40" : "var(--border)"}`,
                        boxShadow: qty > 0 ? `0 4px 12px ${sport.color}20` : "none",
                        transition: "all 0.25s ease"
                      }}>
                        {eq.image ? (
                          <img src={eq.image} alt={eq.name} style={{
                            width: "100%", height: "100%",
                            objectFit: "cover",
                            opacity: qty > 0 ? 1 : 0.5,
                            transition: "opacity 0.25s ease"
                          }} />
                        ) : (
                          <span style={{ fontSize: "36px" }}>{eq.icon}</span>
                        )}
                      </div>

                      {/* Info */}
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "16px", color: "var(--green-950)", marginBottom: "3px" }}>{eq.name}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>{eq.desc}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "18px", fontWeight: 800, color: sport.color, fontFamily: "Syne, sans-serif" }}>
                            Rs. {eq.price}/=
                          </span>
                          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>per {eq.unit}</span>
                          {qty > 0 && (
                            <span style={{ fontSize: "12px", fontWeight: 700, color: sport.color, marginLeft: "8px" }}>
                              = Rs. {(qty * eq.price).toLocaleString()}/=
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Qty Control */}
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                        <button
                          onClick={() => setQty(activeSport, eq.id, qty - 1)}
                          disabled={qty === 0}
                          style={{
                            width: "36px", height: "36px", borderRadius: "10px",
                            border: `1.5px solid ${qty > 0 ? sport.color : "var(--border)"}`,
                            background: qty > 0 ? sport.color : "transparent",
                            color: qty > 0 ? "white" : "var(--text-muted)",
                            fontSize: "18px", fontWeight: 700, cursor: qty === 0 ? "not-allowed" : "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.2s", opacity: qty === 0 ? 0.4 : 1
                          }}
                        >−</button>
                        <span style={{ width: "28px", textAlign: "center", fontWeight: 800, fontSize: "17px", color: "var(--green-950)" }}>{qty}</span>
                        <button
                          onClick={() => setQty(activeSport, eq.id, qty + 1)}
                          style={{
                            width: "36px", height: "36px", borderRadius: "10px",
                            border: `1.5px solid ${sport.color}`,
                            background: sport.color, color: "white",
                            fontSize: "18px", fontWeight: 700, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.2s"
                          }}
                          onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
                          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                        >+</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── COACH TAB ── */}
          {activeTab === "coach" && (
            <div className="animate-fade">
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ fontSize: "22px", color: "var(--green-950)", fontFamily: "Syne, sans-serif", marginBottom: "6px" }}>
                  {sport.icon} {activeSport} Coaches
                </h2>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Select one coach • Rs. {COACH_RATE}/= per hour</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "28px" }}>
                {sport.coaches.map(coach => {
                  const isSelected = selectedCoach?.id === `${activeSport}-${coach.id}`;
                  return (
                    <div
                      key={coach.id}
                      onClick={() => setSelectedCoach(isSelected ? null : { ...coach, id: `${activeSport}-${coach.id}`, sport: activeSport })}
                      style={{
                        display: "grid", gridTemplateColumns: "60px 1fr auto",
                        gap: "16px", alignItems: "center",
                        padding: "18px 20px", borderRadius: "16px",
                        background: isSelected ? sport.bg : "var(--surface-2)",
                        border: isSelected ? `2px solid ${sport.color}` : "1.5px solid var(--border)",
                        cursor: "pointer", transition: "all 0.25s ease",
                      }}
                      onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.borderColor = sport.border; e.currentTarget.style.background = sport.bg + "80"; } }}
                      onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--surface-2)"; } }}
                    >
                      <div style={{
                        width: "56px", height: "56px", borderRadius: "50%",
                        background: isSelected ? sport.color : "var(--surface-3)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: isSelected ? "white" : "var(--text-muted)",
                        fontWeight: 800, fontSize: "16px", fontFamily: "Syne, sans-serif",
                        flexShrink: 0
                      }}>
                        {coach.avatar}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "16px", color: "var(--green-950)" }}>{coach.name}</div>
                        <div style={{ fontSize: "12px", color: sport.color, fontWeight: 600, marginTop: "2px" }}>{coach.role}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Rs. {COACH_RATE}/= per hour</div>
                      </div>
                      <div style={{
                        width: "24px", height: "24px", borderRadius: "50%",
                        border: `2px solid ${isSelected ? sport.color : "var(--border)"}`,
                        background: isSelected ? sport.color : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0
                      }}>
                        {isSelected && <span style={{ color: "white", fontSize: "12px", fontWeight: 800 }}>✓</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Hours selector */}
              {selectedCoach && selectedCoach.sport === activeSport && (
                <div className="animate-scale" style={{
                  padding: "20px", borderRadius: "16px",
                  background: sport.bg, border: `1.5px solid ${sport.border}`
                }}>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: sport.color, marginBottom: "14px" }}>
                    ⏱️ Select Coaching Hours
                  </div>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {[1, 2, 3, 4, 5].map(h => (
                      <button
                        key={h}
                        onClick={() => setCoachHours(h)}
                        style={{
                          padding: "10px 20px", borderRadius: "10px",
                          border: coachHours === h ? `2px solid ${sport.color}` : "1.5px solid var(--border)",
                          background: coachHours === h ? sport.color : "var(--surface)",
                          color: coachHours === h ? "white" : "var(--text-secondary)",
                          fontWeight: 700, fontSize: "14px", cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                      >
                        {h}h
                      </button>
                    ))}
                  </div>
                  <div style={{ marginTop: "14px", fontSize: "14px", fontWeight: 700, color: sport.color }}>
                    Coach Fee: Rs. {(coachHours * COACH_RATE).toLocaleString()}/=
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN: Order Summary ──────────────────────────── */}
        <div style={{ position: "sticky", top: "92px" }}>
          <div style={{
            borderRadius: "20px",
            background: "var(--surface)",
            border: "2px solid var(--border)",
            boxShadow: "var(--shadow-lg)",
            overflow: "hidden"
          }}>
            {/* Header */}
            <div style={{
              padding: "20px 24px",
              background: "linear-gradient(135deg, var(--green-800), var(--green-950))",
              color: "white"
            }}>
              <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", opacity: 0.7, marginBottom: "6px" }}>ORDER SUMMARY</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "20px" }}>
                {totalItems} item{totalItems !== 1 ? "s" : ""} selected
              </div>
            </div>

            <div style={{ padding: "20px 24px" }}>
              {/* Equipment breakdown */}
              {totalItems > 0 ? (
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "1px", marginBottom: "10px" }}>EQUIPMENT</div>
                  {Object.entries(SPORTS_DATA).map(([sName, sData]) =>
                    sData.equipments
                      .filter(eq => getQty(sName, eq.id) > 0)
                      .map(eq => (
                        <div key={`${sName}-${eq.id}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <div>
                            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{eq.name}</div>
                            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{sName} × {getQty(sName, eq.id)} {eq.unit}</div>
                          </div>
                          <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--green-700)" }}>
                            Rs. {(getQty(sName, eq.id) * eq.price).toLocaleString()}/=
                          </div>
                        </div>
                      ))
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid var(--border)", marginTop: "6px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-secondary)" }}>Equipment Subtotal</span>
                    <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--green-700)" }}>Rs. {equipmentTotal.toLocaleString()}/=</span>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)", fontSize: "13px", marginBottom: "8px" }}>
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>🛒</div>
                  No equipment selected yet
                </div>
              )}

              {/* Coach breakdown */}
              {selectedCoach && (
                <div style={{ marginBottom: "16px", paddingTop: "12px", borderTop: totalItems > 0 ? "1px dashed var(--border)" : "none" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "1px", marginBottom: "10px" }}>COACHING SESSION</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{selectedCoach.name}</div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{selectedCoach.sport} • {coachHours}h × Rs. {COACH_RATE}/=</div>
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--green-700)" }}>Rs. {coachTotal.toLocaleString()}/=</div>
                  </div>
                </div>
              )}

              {!selectedCoach && totalItems === 0 && (
                <div style={{ textAlign: "center", padding: "8px 0 12px", color: "var(--text-muted)", fontSize: "12px" }}>
                  Add equipment or select a coach to get started
                </div>
              )}

              {/* Grand Total */}
              <div style={{
                borderTop: "2px solid var(--border)", paddingTop: "16px", marginTop: "8px",
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>GRAND TOTAL</div>
                  <div style={{ fontSize: "26px", fontWeight: 800, color: "var(--green-800)", fontFamily: "Syne, sans-serif", lineHeight: 1.1 }}>
                    Rs. {grandTotal.toLocaleString()}/=
                  </div>
                </div>
                {grandTotal > 0 && (
                  <div style={{ fontSize: "32px" }}>🏆</div>
                )}
              </div>

              {/* CTA Buttons */}
              <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <button
                  className="btn-primary"
                  disabled={grandTotal === 0}
                  onClick={handleSubmit}
                  style={{
                    width: "100%", padding: "14px", fontSize: "15px", borderRadius: "12px",
                    opacity: grandTotal === 0 ? 0.5 : 1,
                    cursor: grandTotal === 0 ? "not-allowed" : "pointer"
                  }}
                >
                  {grandTotal === 0 ? "Select Items to Order" : `Confirm Order — Rs. ${grandTotal.toLocaleString()}/=`}
                </button>
                <button
                  className="btn-secondary"
                  style={{ width: "100%", padding: "12px", fontSize: "14px", borderRadius: "12px" }}
                  onClick={() => nav("courts")}
                >
                  Book a Court Too →
                </button>
              </div>

              {/* Clear all */}
              {(grandTotal > 0) && (
                <button
                  onClick={() => { setQuantities({}); setSelectedCoach(null); setCoachHours(1); }}
                  style={{
                    width: "100%", padding: "8px", marginTop: "8px",
                    background: "transparent", border: "none",
                    color: "#dc2626", fontSize: "12px", fontWeight: 600,
                    cursor: "pointer", borderRadius: "8px",
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                >
                  🗑️ Clear All Selections
                </button>
              )}
            </div>
          </div>

          {/* Info cards */}
          <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ padding: "14px 16px", borderRadius: "12px", background: "var(--green-50)", border: "1.5px solid var(--green-200)", fontSize: "12px", color: "var(--green-800)" }}>
              <strong>🎓 Coach Rate:</strong> Rs. 500/= per hour · Select any 1 coach from any sport
            </div>
            <div style={{ padding: "14px 16px", borderRadius: "12px", background: "var(--surface)", border: "1.5px solid var(--green-200)", fontSize: "12px", color: "var(--green-800)" }}>
              <strong>📦 Equipment:</strong> Prices are per-unit rental. Change quantities freely before confirming.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
