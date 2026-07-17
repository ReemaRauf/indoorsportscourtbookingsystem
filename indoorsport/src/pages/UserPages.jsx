import { useState, useEffect } from "react";
import api from "../api";
import Footer from "../components/Footer";
import { FaLightbulb, FaUserAlt, FaGraduationCap, FaTableTennis } from "react-icons/fa";
import { MdStadium, MdSportsCricket, MdSportsBaseball, MdSportsTennis, MdShield } from "react-icons/md";
import StripeCheckout from "../components/StripeCheckout";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
const resolveImage = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  if (img.startsWith("/images")) return img;
  return `${API_BASE}${img}`;
};

const calculateDuration = (start, end) => {
  if (!start || !end) return 0;
  let diffMs = new Date(`1970-01-01T${end}`) - new Date(`1970-01-01T${start}`);
  if (diffMs < 0) {
    diffMs += 12 * 3600000;
    if (diffMs < 0) {
      diffMs += 12 * 3600000;
    }
  }
  return diffMs / 3600000;
};

// ── Availability Result ──────────────────────────────────────────────────────
export function AvailabilityResultPage({ selectedCourt, bookingType, bookingDate, startTime, endTime, selectedPackage, availabilityResult, bookingAddons, nav }) {
  const isAvailable = availabilityResult === "available";

  return (
    <div style={{ padding: "48px 40px", maxWidth: "680px", margin: "0 auto" }}>
      <div className="animate-scale">
        <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>Availability Result</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "32px" }}>
          Checking slot for <strong>{selectedCourt?.name}</strong>
        </p>

        {/* Status banner */}
        <div style={{
          padding: "28px 32px", borderRadius: "16px", marginBottom: "28px",
          background: isAvailable ? "var(--green-50)" : "#fef2f2",
          border: `2px solid ${isAvailable ? "var(--green-300)" : "#fca5a5"}`,
          display: "flex", alignItems: "center", gap: "20px",
        }}>
          <div style={{ fontSize: "48px" }}>{isAvailable ? "✅" : "❌"}</div>
          <div>
            <div style={{
              fontSize: "22px", fontFamily: "Syne, sans-serif", fontWeight: 800,
              color: isAvailable ? "var(--green-700)" : "#dc2626",
            }}>
              {isAvailable ? "AVAILABLE" : "NOT AVAILABLE"}
            </div>
            <div style={{ fontSize: "14px", color: isAvailable ? "var(--green-600)" : "#ef4444", marginTop: "4px" }}>
              {isAvailable ? "Slot is free — proceed to book!" : "Select another time"}
            </div>
          </div>
        </div>

        {/* Selected details */}
        <div className="card" style={{ padding: "28px", marginBottom: "24px" }}>
          <h3 style={{ fontSize: "16px", marginBottom: "20px", color: "var(--text-secondary)" }}>SELECTED DETAILS</h3>
          {[
            ["Court", selectedCourt?.name],
            ["Date", bookingDate],
            ["Start Time", startTime],
            ["Duration", selectedPackage ? `${selectedPackage.duration} Hours` : (startTime && endTime ? `${calculateDuration(startTime, endTime)} Hours` : "Custom")],
            ["Type", bookingType === "time" ? "Time Booking" : "Package Booking"],
            ...(selectedPackage ? [["Package", selectedPackage.name], ["Price", `${selectedPackage.price}/=`]] : []),
          ].map(([k, v]) => v && (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600 }}>{k}</span>
              <span style={{ fontSize: "14px", fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>

        {isAvailable ? (
          <div style={{ marginTop: "24px" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "16px", color: "var(--text-secondary)" }}>ADD-ONS </h3>
            <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexDirection: "column" }}>
              <button 
                className="btn-secondary" 
                style={{ 
                  width: "100%", 
                  padding: "14px", 
                  justifyContent: "flex-start", 
                  background: "#ffffff",
                  borderColor: Object.keys(bookingAddons?.equipments || {}).filter(k => bookingAddons.equipments[k] > 0).length > 0 ? "#22c55e" : ""
                }} 
                onClick={() => nav("booking-equipment")}
              >
                {Object.keys(bookingAddons?.equipments || {}).filter(k => bookingAddons.equipments[k] > 0).length > 0 
                  ? ` Equipments Added (${Object.values(bookingAddons.equipments).reduce((a,b) => a+b, 0)} items)` 
                  : ` Select Sports Equipments`}
              </button>
              <button 
                className="btn-secondary" 
                style={{ 
                  width: "100%", 
                  padding: "14px", 
                  justifyContent: "flex-start", 
                  background: "#ffffff",
                  borderColor: bookingAddons?.coach ? "#22c55e" : ""
                }} 
                onClick={() => nav("booking-coach")}
              >
                {bookingAddons?.coach ? ` Selected Coach: ${bookingAddons.coach.name}` : ` Add a Coach`}
              </button>
            </div>
            
            <div style={{ display: "flex", gap: "12px" }}>
              <button className="btn-secondary" onClick={() => nav("courts")}>← Cancel</button>
              <button className="btn-primary" style={{ flex: 1, padding: "14px" }} onClick={() => nav("booking-form")}>
                Proceed to Book →
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "12px" }}>
            <button className="btn-primary" style={{ flex: 1, padding: "14px" }} onClick={() => nav("time-booking")}>
              Choose Another Time
            </button>
            <button className="btn-secondary" onClick={() => nav("courts")}>← Back to Courts</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sports Equipment & Coaching Data ──────────────────────────────────────────
const SPORT_COACHES = {
  "Badminton Court": [
    { id: "fayas", name: "fayas", role: "National Champion Coach", avatar: "RD"  },
      { id: "arjuna", name: "Arjuna Ranasinghe", role: "Junior Head Coach", avatar: "AR" },
      { id: "dilhani", name: "Dilhani Fernando", role: "Defense Specialist", avatar: "DF" },
    ],
  
  "Cricket Court": [
    { id: "mahela", name: "Mahela Perera", role: "Batting & Technique", avatar: "MP" },
      { id: "lasith", name: "Lasith ", role: "Fast Bowling Expert", avatar: "LF"},
      { id: "rangana", name: "Rangana Mendis", role: "Spin & Strategy", avatar: "RM" }
  ],
  "Table Tennis Court": [
    { id: "chen", name: "Chen Wijetunga", role: "ITTF Certified Coach", avatar: "CW" },
      { id: "kavinda", name: "Kavinda Bandara", role: "Spin Specialist", avatar: "KB" },
      { id: "anura", name: "Anura Alwis", role: "Footwork Coach", avatar: "AA" },
  ],
  
};

const SPORT_EQUIPMENTS = {
  "Cricket Court": [
    { id: "eq1", name: "Cricket Bat", price: 500, icon: <MdSportsCricket style={{ color: "var(--green-700)" }} /> },
    { id: "eq2", name: "Leather Ball", price: 100, icon: <MdSportsBaseball style={{ color: "var(--green-700)" }} /> },
    { id: "eq3", name: "Stumps Set", price: 350, icon: <MdSportsCricket style={{ color: "var(--green-700)" }} /> },
    { id: "eq4", name: "Batting Gloves", price: 200, icon: <MdShield style={{ color: "var(--green-700)" }} /> },
    { id: "eq5", name: "Leg Guards (Pads)", price: 200, icon: <MdShield style={{ color: "var(--green-700)" }} /> },
    { id: "eq6", name: "Helmet", price: 400, icon: <MdShield style={{ color: "var(--green-700)" }} /> }
  ],
  "Badminton Court": [
    { id: "eq1", name: "Racket Pair (Couple)", price: 350, icon: <MdSportsTennis style={{ color: "var(--green-700)" }} /> },
    { id: "eq2", name: "Shuttlecock", price: 50, icon: <MdSportsTennis style={{ color: "var(--green-700)" }} /> }
  ],
  "Table Tennis Court": [
    { id: "eq1", name: "TT Ball", price: 100, icon: <FaTableTennis style={{ color: "var(--green-700)" }} /> },
    { id: "eq2", name: "Paddle Couple", price: 350, icon: <FaTableTennis style={{ color: "var(--green-700)" }} /> }
  ],
  
};

// ── Helper for matching sports data ─────────────────────────────────────────
const getSportCategory = (name) => {
  const lower = name?.toLowerCase() || "";
  if (lower.includes("cricket")) return "Cricket";
  if (lower.includes("badminton")) return "Badminton";
  if (lower.includes("table tennis") || lower.includes("tt")) return "Table Tennis";
  return "Badminton";
};

// ── Booking Coach (Separate Step) ───────────────────────────────────────────
export function BookingCoachPage({ selectedCourt, bookingAddons, setBookingAddons, nav, coaches, bookingDate, startTime, endTime }) {
  const [selectedCoach, setSelectedCoach] = useState(bookingAddons?.coach || null);
  const [blockedCoachIds, setBlockedCoachIds] = useState([]);

  useEffect(() => {
    const checkAvailability = async () => {
      if (!bookingDate) return;
      try {
        const res = await api.post("/coach-availability/check-all", { date: bookingDate, startTime, endTime });
        setBlockedCoachIds(res.data.blockedCoachIds || []);
      } catch (err) {
        console.error(err);
      }
    };
    checkAvailability();
  }, [bookingDate, startTime, endTime]);

  const sportCategory = getSportCategory(selectedCourt?.name);
  
  const SPORTS_UI = {
    Cricket: { color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
    Badminton: { color: "#15803d", bg: "#f0f9ff", border: "#bae6fd" },
    "Table Tennis": { color: "#15803d", bg: "#faf5ff", border: "#ddd6fe" },
  };

  const sportUI = SPORTS_UI[sportCategory] || SPORTS_UI["Cricket"];
  const availableCoaches = coaches?.filter(c => c.sport === sportCategory) || [];

  const handleSave = () => {
    setBookingAddons(prev => ({ ...prev, coach: selectedCoach }));
    nav("availability-result");
  };

  return (
    <div style={{ padding: "48px 40px", maxWidth: "1100px", margin: "0 auto" }}>
      <div className="animate-fade" style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "40px", marginBottom: "12px", fontFamily: "Syne, sans-serif", fontWeight: 800, color: "#052e16", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
          Select a Coach <FaGraduationCap />
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "16px", maxWidth: "600px", margin: "0 auto" }}>
          Choose a professional {sportCategory} trainer to assist you during your session. 
          The coaching fee will be seamlessly added to your final booking bill.
        </p>
      </div>

      {availableCoaches.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "48px" }}>
          {availableCoaches.map((coach, idx) => {
            const isBlocked = blockedCoachIds.includes(coach.id);
            const isSelected = selectedCoach?.id === coach.id && !isBlocked;
            return (
              <div
                key={coach.id}
                className={`animate-fade delay-${idx + 1}`}
                onClick={() => { if (!isBlocked) setSelectedCoach(isSelected ? null : coach); }}
                style={{
                  padding: "32px 24px",
                  borderRadius: "20px",
                  background: isSelected ? sportUI.bg : "#ffffff",
                  border: isSelected ? `2.5px solid ${sportUI.color}` : `1.5px solid ${sportUI.border}`,
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  boxShadow: isSelected ? `0 12px 32px ${sportUI.color}22` : "0 2px 12px rgba(0,0,0,0.04)",
                  cursor: isBlocked ? "not-allowed" : "pointer",
                  position: "relative",
                  opacity: isBlocked ? 0.6 : 1
                }}
                onMouseEnter={e => {
                  if (!isSelected && !isBlocked) {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(22,163,74,0.12)";
                    e.currentTarget.style.borderColor = sportUI.color;
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected && !isBlocked) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)";
                    e.currentTarget.style.borderColor = sportUI.border;
                  }
                }}
              >
                {isBlocked && (
                  <div style={{
                    position: "absolute", top: "16px", left: "16px", right: "16px",
                    background: "#ef4444", color: "white", padding: "6px",
                    borderRadius: "8px", fontWeight: "bold", fontSize: "12px",
                    zIndex: 2, letterSpacing: "1px"
                  }}>NOT AVAILABLE</div>
                )}
                {isSelected && (
                  <div style={{
                    position: "absolute", top: "16px", right: "16px",
                    background: sportUI.color, color: "white", width: "28px", height: "28px",
                    borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: "bold", fontSize: "16px"
                  }}>✓</div>
                )}
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
                <div style={{ fontWeight: 700, fontSize: "18px", color: "#052e16", marginBottom: "4px" }}>{coach.name}</div>
                <div style={{ fontSize: "13px", color: sportUI.color, fontWeight: 700, marginBottom: "10px" }}>{coach.role}</div>
                <div style={{ fontSize: "12px", color: "#6b7a6b", lineHeight: 1.6, marginBottom: "16px", minHeight: "40px" }}>{coach.desc}</div>

                {/* Price */}
                <div style={{
                  padding: "10px 16px", borderRadius: "12px",
                  background: isSelected ? "#ffffff" : sportUI.bg, border: `1px solid ${sportUI.border}`,
                  display: "inline-flex", alignItems: "center", gap: "6px"
                }}>
                  <span style={{ fontSize: "16px", fontWeight: 800, color: sportUI.color, fontFamily: "Syne, sans-serif" }}>
                    Rs. {coach.price || 500}/=
                  </span>
                  <span style={{ fontSize: "11px", color: "#6b7a6b", fontWeight: 600 }}>per hour</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card" style={{ padding: "40px", textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>😞</div>
          <h3 style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "8px" }}>No Coaches Available</h3>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>We currently do not have any coaches available for {sportCategory}.</p>
        </div>
      )}

      <div style={{ display: "flex", gap: "12px", justifyContent: "center", maxWidth: "600px", margin: "0 auto" }}>
        <button className="btn-secondary" style={{ flex: 1, padding: "16px", fontSize: "16px" }} onClick={() => nav("availability-result")}>
          ← Go Back
        </button>
        <button className="btn-primary" style={{ flex: 1, padding: "16px", fontSize: "16px" }} onClick={handleSave}>
          {selectedCoach ? "Save →" : "Proceed without Coach →"}
        </button>
      </div>
    </div>
  );
}

// ── Booking Equipment (Separate Step) ───────────────────────────────────────
export function BookingEquipmentPage({ selectedCourt, bookingAddons, setBookingAddons, nav, equipments = [] }) {
  const [eqQuantities, setEqQuantities] = useState(bookingAddons?.equipments || {});

  const sportCategory = getSportCategory(selectedCourt?.name);
  
  const SPORTS_DATA = {
    Cricket: { color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
    Badminton: { color: "#15803d", bg: "#f0f9ff", border: "#bae6fd" },
    "Table Tennis": { color: "#15803d", bg: "#faf5ff", border: "#ddd6fe" },
  };

  const sport = SPORTS_DATA[sportCategory] || SPORTS_DATA["Cricket"];
  const availableEquipments = equipments.filter(e => e.sport === sportCategory);

  const handleSave = () => {
    setBookingAddons(prev => ({ ...prev, equipments: eqQuantities }));
    nav("availability-result");
  };

  const totalSelected = Object.values(eqQuantities).reduce((a, b) => a + b, 0);

  return (
    <div style={{ padding: "48px 40px", maxWidth: "1100px", margin: "0 auto" }}>
      <div className="animate-fade" style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "40px", marginBottom: "12px", fontFamily: "Syne, sans-serif", fontWeight: 800, color: "#052e16" }}>
          Select Equipment 
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "16px", maxWidth: "600px", margin: "0 auto" }}>
          Browse our premium {sportCategory} equipment available . Add equipment to your booking and all prices will be included in your final bill.
        </p>
      </div>

      {availableEquipments.length > 0 ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "16px",
          marginBottom: "48px"
        }}>
          {availableEquipments.map((eq, idx) => {
            const qty = eqQuantities[eq.id] || 0;
            return (
              <div
                key={eq.id}
                className={`animate-fade delay-${Math.min(idx + 1, 4)}`}
                style={{
                  display: "flex", alignItems: "center", gap: "16px",
                  padding: "20px 22px", borderRadius: "16px",
                  background: qty > 0 ? sport.bg : "#ffffff",
                  border: qty > 0 ? `2px solid ${sport.color}` : `1.5px solid ${sport.border}`,
                  transition: "all 0.25s ease",
                  boxShadow: qty > 0 ? `0 8px 24px ${sport.color}22` : "0 2px 8px rgba(0,0,0,0.03)"
                }}
                onMouseEnter={e => {
                  if (qty === 0) {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(22,163,74,0.1)";
                    e.currentTarget.style.borderColor = sport.color;
                  }
                }}
                onMouseLeave={e => {
                  if (qty === 0) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.03)";
                    e.currentTarget.style.borderColor = sport.border;
                  }
                }}
              >
                {/* Icon / Image */}
                <div style={{
                  width: "64px", height: "64px", borderRadius: "14px",
                  background: qty > 0 ? "#ffffff" : sport.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "28px", flexShrink: 0, overflow: "hidden",
                  border: qty > 0 ? `1.5px solid ${sport.color}` : `1px solid ${sport.border}`
                }}>
                  {eq.image ? (
                    <img src={resolveImage(eq.image)} alt={eq.name} style={{
                      width: "100%", height: "100%",
                      objectFit: "contain",
                      opacity: qty > 0 ? 1 : 0.8,
                      transition: "opacity 0.25s ease"
                    }} />
                  ) : (
                    eq.icon
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "16px", color: "#052e16", marginBottom: "3px" }}>{eq.name}</div>
                  <div style={{ fontSize: "12px", color: "#6b7a6b", marginBottom: "8px", lineHeight: 1.5 }}>{eq.desc}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ fontSize: "16px", fontWeight: 800, color: sport.color, fontFamily: "Syne, sans-serif" }}>
                        Rs. {eq.price}/=
                      </span>
                    </div>
                    
                    {/* Stepper */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <button
                        onClick={() => setEqQuantities(p => ({ ...p, [eq.id]: Math.max(0, qty - 1) }))}
                        style={{
                          width: "28px", height: "28px", borderRadius: "50%",
                          border: qty > 0 ? `1.5px solid ${sport.color}` : "1.5px solid var(--border)", 
                          background: "white",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "15px", cursor: "pointer", fontWeight: 800,
                          color: qty > 0 ? sport.color : "inherit"
                        }}
                      >-</button>
                      <span style={{ fontSize: "14px", fontWeight: 700, minWidth: "16px", textAlign: "center", color: qty > 0 ? sport.color : "inherit" }}>{qty}</span>
                      <button
                        onClick={() => setEqQuantities(p => ({ ...p, [eq.id]: qty + 1 }))}
                        style={{
                          width: "28px", height: "28px", borderRadius: "50%",
                          border: qty > 0 ? `1.5px solid ${sport.color}` : "1.5px solid var(--border)", 
                          background: "white",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "15px", cursor: "pointer", fontWeight: 800,
                          color: qty > 0 ? sport.color : "inherit"
                        }}
                      >+</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card" style={{ padding: "40px", textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>😞</div>
          <h3 style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "8px" }}>No Equipments Available</h3>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>We currently do not have any equipments available for {sportCategory}.</p>
        </div>
      )}

      <div style={{ display: "flex", gap: "12px", justifyContent: "center", maxWidth: "600px", margin: "0 auto" }}>
        <button className="btn-secondary" style={{ flex: 1, padding: "16px", fontSize: "16px" }} onClick={() => nav("availability-result")}>
          ← Go Back
        </button>
        <button className="btn-primary" style={{ flex: 1, padding: "16px", fontSize: "16px" }} onClick={handleSave}>
          {totalSelected > 0 ? `Save (${totalSelected} item${totalSelected > 1 ? 's' : ''}) →` : "Proceed without Equipment →"}
        </button>
      </div>
    </div>
  );
}

// ── Booking Form ──────────────────────────────────────────────────────────────
export function BookingFormPage({ user, selectedCourt, bookingType, bookingDate, startTime, endTime, selectedPackage, addons, onConfirm, nav, equipments = [] }) {
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "" });

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const hrs = calculateDuration(startTime, endTime);
  
  const getHourlyRate = (name) => {
    const lowerName = name?.toLowerCase() || "";
    if (lowerName.includes("cricket")) return 1000;
    if (lowerName.includes("badminton")) return 600;
    if (lowerName.includes("table tennis")) return 1000;
    return 1000; // default rate
  };

  const courtName = selectedCourt?.name || "Badminton Court";
  const sportCategory = getSportCategory(courtName);
  
  const availableEquipments = equipments.filter(e => e.sport === sportCategory);

  const calculatedTimePrice = hrs > 0 ? hrs * getHourlyRate(courtName) : 2000;
  const basePrice = selectedPackage ? selectedPackage.price : calculatedTimePrice;
  const isPackage = bookingType === "package";

  const durationHrs = isPackage ? (selectedPackage?.duration || 1) : (hrs || 1);
  
  const selectedCoach = addons?.coach || null;
  const eqQuantities = addons?.equipments || {};

  const coachPrice = selectedCoach ? ((selectedCoach.price || 500) * durationHrs) : 0;

  const equipmentPrice = Object.entries(eqQuantities).reduce((acc, [eqId, qty]) => {
    const eq = availableEquipments.find(e => e.id === eqId);
    return acc + (eq ? eq.price * qty : 0);
  }, 0);

  const totalPrice = basePrice + coachPrice + equipmentPrice;
  const advanceAmount = Math.round(totalPrice * 0.2);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const handleConfirm = async (paymentIntentId = null, usingWallet = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const equipmentsList = Object.entries(eqQuantities)
      .filter(([_, qty]) => qty > 0)
      .map(([eqId, qty]) => {
        const eq = availableEquipments.find(e => e.id === eqId);
        return { name: eq.name, quantity: qty, price: eq.price };
      });

    await onConfirm(form, totalPrice, {
      coach: selectedCoach ? selectedCoach.name : "",
      equipments: equipmentsList,
      advancePaid: (paymentIntentId || usingWallet) ? advanceAmount : 0,
      paymentStatus: usingWallet ? "Paid via Wallet" : (paymentIntentId ? "Advance Paid" : "Unpaid"),
      status: (paymentIntentId || usingWallet) ? "Confirmed" : "Pending",
      paymentIntentId: typeof paymentIntentId === 'string' ? paymentIntentId : null,
      useWallet: usingWallet,
      walletAmountUsed: usingWallet ? advanceAmount : 0
    });
    setIsSubmitting(false);
    setShowPayment(false);
  };

  return (
    <div style={{ padding: "48px 40px", maxWidth: "980px", margin: "0 auto" }}>
      <div className="animate-fade">
        <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>
          {isPackage ? "Book Your Package" : "Book Your Slot"}
        </h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "32px" }}>Enter your contact details to finalize the booking</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "24px" }}>
          {/* Left panel: Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Details Form */}
            <div className="card" style={{ padding: "28px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "20px", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}><FaUserAlt style={{ color: "var(--green-700)" }} /> YOUR DETAILS</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={form.name} onChange={set("name")} placeholder="Enter your full name" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input className="form-input" type="email" value={form.email} onChange={set("email")} placeholder="name@example.com" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input className="form-input" value={form.phone} onChange={set("phone")} placeholder="+94 7X XXX XXXX" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Notice */}
            <div style={{
              padding: "20px", borderRadius: "16px",
              background: "var(--surface-3)", border: "1.5px solid var(--border)",
              display: "flex", gap: "16px"
            }}>
              <div style={{ fontSize: "24px" }}><FaLightbulb style={{ color: "#eab308" }} /></div>
              <div style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                You have already configured your Add-ons in the previous step. All selected Coach and Equipment are included in your unified Booking Bill on the right.
              </div>
            </div>
          </div>

          {/* Right panel: Unified Booking Bill */}
          <div>
            <div className="card" style={{ padding: "0", marginBottom: "16px", overflow: "hidden" }}>
              {/* Bill Header */}
              <div style={{
                padding: "18px 24px",
                background: "linear-gradient(135deg, #166534, #052e16)",
                color: "white"
              }}>
                <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", opacity: 0.7, marginBottom: "4px" }}>SPORTIVA INDOOR COURTS</div>
                <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "20px" }}>Booking Bill</div>
              </div>

              <div style={{ padding: "20px 24px" }}>
                {/* Booking Details */}
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "1px", marginBottom: "10px" }}>BOOKING DETAILS</div>
                  {[
                    ["Court", selectedCourt?.name],
                    ["Date", bookingDate],
                    ["Time", startTime ? (endTime ? `${startTime} – ${endTime}` : startTime) : "—"],
                    ["Duration", isPackage ? `${selectedPackage?.duration} Hours` : `${hrs} Hours`],
                    ["Type", isPackage ? "Package Booking" : "Time Booking"],
                    ...(isPackage ? [["Package", selectedPackage?.name]] : []),
                  ].map(([k, v]) => v && (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>{k}</span>
                      <span style={{ fontSize: "13px", fontWeight: 600 }}>{v}</span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div style={{ borderTop: "1.5px dashed var(--border)", paddingTop: "16px" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "1px", marginBottom: "10px" }}>PRICE BREAKDOWN</div>

                  {/* Court Fee */}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}><MdStadium size={16} style={{ color: "var(--green-700)" }} /> Court Fee</div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                        {isPackage ? selectedPackage?.name : `${hrs} hrs × Rs. ${getHourlyRate(courtName)}/=`}
                      </div>
                    </div>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--green-700)" }}>Rs. {basePrice}/=</span>
                  </div>

                  {/* Coach Fee */}
                  {selectedCoach && (
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}><FaGraduationCap size={16} style={{ color: "var(--green-700)" }} /> Coaching Fees</div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                          {selectedCoach.name} • {durationHrs}h × Rs. {selectedCoach.price || 500}/=
                        </div>
                      </div>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--green-700)" }}>Rs. {coachPrice}/=</span>
                    </div>
                  )}

                  {/* Equipment Fees */}
                  {Object.entries(eqQuantities).filter(([_, qty]) => qty > 0).map(([eqId, qty]) => {
                    const eq = availableEquipments.find(e => e.id === eqId);
                    if (!eq) return null;
                    return (
                      <div key={eqId} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                            {eq.image ? <img src={resolveImage(eq.image)} alt={eq.name} style={{ width: "18px", height: "18px", objectFit: "contain", borderRadius: "4px" }} /> : eq.icon}
                            {eq.name}
                          </div>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                            {qty} × Rs. {eq.price}/=
                          </div>
                        </div>
                        <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--green-700)" }}>Rs. {qty * eq.price}/=</span>
                      </div>
                    );
                  })}

                  {/* No add-ons note */}
                  {!selectedCoach && equipmentPrice === 0 && (
                    <div style={{ padding: "10px 0", fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic" }}>
                      No coach or equipment selected
                    </div>
                  )}
                </div>

                {/* Grand Total */}
                <div style={{
                  borderTop: "2.5px solid var(--green-600)", paddingTop: "14px", marginTop: "12px",
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600, marginBottom: "2px" }}>TOTAL AMOUNT</div>
                    <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "24px", color: "var(--green-700)", lineHeight: 1.1 }}>
                      Rs. {totalPrice.toLocaleString()}/=
                    </div>
                  </div>
                  <div style={{
                    padding: "6px 12px", borderRadius: "8px",
                    background: "var(--green-50)", border: "1px solid var(--green-200)",
                    fontSize: "11px", fontWeight: 700, color: "var(--green-700)"
                  }}>
                    {1 + (selectedCoach ? 1 : 0) + Object.values(eqQuantities).filter(q => q > 0).length} item{(1 + (selectedCoach ? 1 : 0) + Object.values(eqQuantities).filter(q => q > 0).length) !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            </div>

            <div className="alert alert-warning" style={{ marginBottom: "16px", fontSize: "13px" }}>
              ⏳ Pay the 20% advance (Rs. {advanceAmount.toLocaleString()}/=) to instantly <strong>Confirm</strong> your booking. Note: Advance is non-refundable upon cancellation.
            </div>

            {showPayment ? (
              <StripeCheckout 
                amount={advanceAmount} 
                onSuccess={handleConfirm} 
                onCancel={() => setShowPayment(false)} 
              />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {user?.walletBalance >= advanceAmount && (
                  <button className="btn-primary" style={{ width: "100%", padding: "14px", background: "var(--green-700)", opacity: isSubmitting ? 0.7 : 1 }}
                    onClick={() => handleConfirm("wallet_payment", true)} disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : `Pay Rs. ${advanceAmount}/= Advance using Wallet (Bal: Rs. ${user.walletBalance}/=)`}
                  </button>
                )}
                <button className="btn-primary" style={{ width: "100%", padding: "14px", opacity: isSubmitting ? 0.7 : 1 }}
                  onClick={() => setShowPayment(true)} disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : `Pay Rs. ${advanceAmount}/= Advance via Card`}
                </button>
                <button className="btn-secondary" style={{ width: "100%", padding: "14px" }}
                  onClick={() => nav("availability-result")} disabled={isSubmitting}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Confirmation ──────────────────────────────────────────────────────────────
export function ConfirmationPage({ booking, nav }) {
  const handlePrintReceipt = () => {
    if (!booking) return;
    const printContent = `
      <html>
        <head>
          <title>Booking Receipt - ${booking.id}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #111; max-width: 600px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #166534; padding-bottom: 20px; }
            .header h1 { margin: 0; color: #166534; font-size: 24px; }
            .header p { margin: 5px 0 0 0; color: #555; }
            .details { border: 1px solid #e5e7eb; padding: 24px; border-radius: 12px; background-color: #f9fafb; }
            .row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
            .row:last-child { border-bottom: none; }
            .label { color: #4b5563; font-weight: 600; font-size: 14px; }
            .value { font-weight: 700; font-size: 15px; color: #111827; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>SPORTIVA INDOOR COURTS</h1>
            <p>Official Booking Receipt</p>
          </div>
          <div class="details">
            ${[
              ["Booking ID", booking.id],
              ["Court", booking.court],
              ["Date", booking.date],
              ["Time", booking.time],
              ["Type", booking.type],
              ...(booking.coach ? [["Selected Coach", booking.coach]] : []),
              ...(booking.equipments && booking.equipments.length > 0 ? [["Rented Equipments", booking.equipments.map(e => `${e.name} (x${e.quantity})`).join(", ")]] : []),
              ["Total Price", `Rs. ${booking.price}/=`],
              ["Advanced Payment", `Rs. ${booking.advancePaid !== undefined ? booking.advancePaid : Math.round(booking.price * 0.2)}/=`],
              ["Balance Price", `Rs. ${booking.price - (booking.advancePaid !== undefined ? booking.advancePaid : Math.round(booking.price * 0.2))}/=`],
              ["Status", booking.status || "Confirmed"]
            ].map(([k, v]) => `
              <div class="row">
                <span class="label">${k}</span>
                <span class="value">${v}</span>
              </div>
            `).join('')}
          </div>
          <div class="footer">
            <p>Thank you for booking with Sportiva Indoor Courts!</p>
            <p>Please present this receipt at the venue.</p>
          </div>
        </body>
      </html>
    `;
    const printWindow = window.open('', '', 'width=800,height=800');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      // Small timeout to ensure styles are loaded before printing
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  return (
    <div style={{ padding: "80px 40px", maxWidth: "580px", margin: "0 auto", textAlign: "center" }}>
      <div className="animate-scale">
        <div style={{
          width: 88, height: 88, borderRadius: "50%", margin: "0 auto 28px",
          background: "linear-gradient(135deg, var(--green-400), var(--green-600))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "40px", boxShadow: "0 12px 32px rgba(22,163,74,0.3)",
        }}>✓</div>
        <h1 style={{ fontSize: "36px", marginBottom: "12px", color: "var(--green-800)" }}>Booking Submitted!</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "32px", lineHeight: 1.7 }}>
          Your booking request has been submitted. Status: <strong>Confirmed</strong>.
          Your slot is secured!
        </p>

        <div className="card" style={{ padding: "24px", textAlign: "left", marginBottom: "28px" }}>
          <h3 style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "16px", letterSpacing: "0.8px" }}>BOOKING DETAILS</h3>
          {booking && [
            ["Booking ID", booking.id],
            ["Court", booking.court],
            ["Date", booking.date],
            ["Time", booking.time],
            ["Type", booking.type],
            ...(booking.coach ? [["Selected Coach", booking.coach]] : []),
            ...(booking.equipments && booking.equipments.length > 0 ? [["Rented Equipments", booking.equipments.map(e => `${e.name} (x${e.quantity})`).join(", ")]] : []),
            ["Total Price", `${booking.price}/=`],
            ["Advanced Payment", `${booking.advancePaid !== undefined ? booking.advancePaid : Math.round(booking.price * 0.2)}/=`],
            ["Balance Price", `${booking.price - (booking.advancePaid !== undefined ? booking.advancePaid : Math.round(booking.price * 0.2))}/=`],
            ["Status", booking.status || "Confirmed"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600 }}>{k}</span>
              <span style={{ fontSize: "14px", fontWeight: 600, color: k === "Status" ? "#a16207" : "var(--text-primary)" }}>{v}</span>
            </div>
          ))}
        </div>
        
        <button className="btn-primary" style={{ width: "100%", padding: "14px", marginBottom: "12px", backgroundColor: "#0f172a", borderColor: "#0f172a" }} onClick={handlePrintReceipt}>
          Download Receipt
        </button>
        <div style={{ display: "flex", gap: "12px" }}>
          <button className="btn-secondary" style={{ flex: 1, padding: "12px" }} onClick={() => nav("home")}>
            Go to Home
          </button>
          <button className="btn-secondary" style={{ flex: 1, padding: "12px" }} onClick={() => nav("my-bookings")}>
            View My Bookings
          </button>
        </div>
      </div>
    </div>
  );
}

// ── My Bookings ───────────────────────────────────────────────────────────────
export function MyBookingsPage({ bookings, onCancel, nav }) {
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelDone, setCancelDone] = useState(null);

  const handleCancel = () => {
    onCancel(cancelTarget.id);
    setCancelDone(cancelTarget);
    setCancelTarget(null);
  };

  const statusColor = { Confirmed: "confirmed", Pending: "pending", Cancelled: "cancelled", Rejected: "rejected" };

  if (cancelDone) {
    return (
      <div style={{ padding: "80px 40px", maxWidth: "480px", margin: "0 auto", textAlign: "center" }}>
        <div className="animate-scale">
          <div style={{
            width: 80, height: 80, borderRadius: "50%", margin: "0 auto 24px",
            background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px",
          }}>✓</div>
          <h1 style={{ fontSize: "28px", marginBottom: "12px" }}>Booking Cancelled</h1>
          <p style={{ color: "var(--text-muted)", marginBottom: "28px" }}>Your booking has been successfully cancelled.</p>
          <div className="card" style={{ padding: "20px", textAlign: "left", marginBottom: "24px" }}>
            {[["Booking ID", cancelDone.id], ["Court", cancelDone.court], ["Date", cancelDone.date], ["Time", cancelDone.time], ["Total Price", `${cancelDone.price}/=`]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>{k}</span>
                <span style={{ fontSize: "13px", fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
          <button className="btn-primary" style={{ width: "100%" }} onClick={() => setCancelDone(null)}>← Back to My Bookings</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ padding: "48px 40px", maxWidth: "960px", margin: "0 auto", minHeight: "calc(100vh - 300px)" }}>
        <div className="animate-fade">
          <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>My Bookings</h1>
          <p style={{ color: "var(--text-muted)", marginBottom: "32px" }}>Manage and track all your court reservations</p>

        {bookings.length === 0 ? (
          <div className="card" style={{ padding: "64px", textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
            <h3 style={{ marginBottom: "8px" }}>No Bookings Yet</h3>
            <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>You haven't made any bookings yet.</p>
            <button className="btn-primary" onClick={() => nav("courts")}>Book a Court Now</button>
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1.5px solid var(--border)", background: "var(--surface-3)" }}>
              <h3 style={{ fontSize: "16px" }}>All Bookings ({bookings.length})</h3>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    {["ID", "Court", "Date", "Time", "Status", "Total Price", "Advance Payment", "Balance Payment", "Action"].map(h => <th key={h}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 8).map(b => {
                    const displayStatus = (b.status === "Pending" && b.advancePaid > 0) ? "Confirmed" : b.status;
                    return (
                    <tr key={b.id}>
                      <td style={{ fontWeight: 700, color: "var(--green-700)" }}>{b.id}</td>
                      <td>{b.court}</td>
                      <td>{b.date}</td>
                      <td>{b.time}</td>
                      <td><span className={`badge badge-${statusColor[displayStatus] || "pending"}`}>{displayStatus}</span></td>
                      <td style={{ fontWeight: 700 }}>{b.price}/=</td>
                      <td style={{ fontWeight: 700, color: "var(--green-700)" }}>{b.advancePaid ? `${b.advancePaid}/=` : "0/="}</td>
                      <td style={{ fontWeight: 700, color: "var(--green-700)" }}>
                        {b.paymentStatus === "Fully Paid" ? (
                          <span className="badge badge-confirmed" style={{ background: "#dcfce7", color: "#166534" }}>Fully Paid</span>
                        ) : (
                          `${b.price - (b.advancePaid || 0)}/=`
                        )}
                      </td>
                      <td>
                        {(() => {
                          const creationDate = b.createdAt ? new Date(b.createdAt) : new Date(b.date);
                          const today = new Date();
                          const diffDays = (today.getTime() - creationDate.getTime()) / (1000 * 60 * 60 * 24);
                          const canCancel = displayStatus === "Confirmed" && diffDays <= 3;

                          if (canCancel) {
                            return <button className="btn-danger" onClick={() => setCancelTarget(b)}>Cancel</button>;
                          } else {
                            return <span style={{ fontSize: "12px", color: "var(--text-muted)", cursor: "not-allowed" }} title={displayStatus === "Confirmed" ? "Can only cancel within 3 days of booking creation" : ""}>—</span>;
                          }
                        })()}
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", background: "var(--surface-3)" }}>
              <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                ℹ️ You can only cancel confirmed bookings within 3 days of making the reservation.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Cancel confirmation modal */}
      {cancelTarget && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
            <h2 style={{ fontSize: "22px", marginBottom: "12px" }}>Cancel Booking?</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "24px", lineHeight: 1.6 }}>
              Are you sure you want to cancel booking <strong>{cancelTarget.id}</strong> for <strong>{cancelTarget.court}</strong>?
            </p>
            <div className="card" style={{ padding: "16px", marginBottom: "24px", textAlign: "left" }}>
              {[["Booking ID", cancelTarget.id], ["Court", cancelTarget.court], ["Date", cancelTarget.date], ["Time", cancelTarget.time], ["Total Price", `${cancelTarget.price}/=`]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>{k}</span>
                  <span style={{ fontSize: "13px", fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={handleCancel} style={{ width: "100%", padding: "13px", marginBottom: "10px", border: "none", borderRadius: "10px", background: "#dc2626", color: "white", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}>
              Yes, Cancel Booking
            </button>
            <button className="btn-secondary" style={{ width: "100%", padding: "12px" }} onClick={() => setCancelTarget(null)}>
              No, Go Back
            </button>
          </div>
        </div>
      )}
      </div>
      <Footer nav={nav} />
    </>
  );
}
