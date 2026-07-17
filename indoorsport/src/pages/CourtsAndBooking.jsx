import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { FaLightbulb, FaClock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import api from "../api";

// ── Real court images ─────────────────────────────────────────────────────────
const COURT_IMAGES = {
  "Tennis Court":       "/sl_tennis.png",
  "Badminton Court":    "/court_badminton.png",
  "Cricket Court":      "/court_cricket.png",
  "Table Tennis Court": "/court_table_tennis.png",
  default:              "/court_badminton.png",
};

const getCourtImage = (court) => {
  if (!court) return COURT_IMAGES.default;
  if (court.image) return court.image;
  return COURT_IMAGES[court.name] || COURT_IMAGES.default;
};

// ── Sport color themes ────────────────────────────────────────────────────────
const SPORT_COLORS = {
  "Table Tennis": { bg: "#fef9c3", text: "#a16207" },
  "Badminton":    { bg: "#dcfce7", text: "#15803d" },
  "Cricket":      { bg: "#dbeafe", text: "#1d4ed8" },
  "Tennis":       { bg: "#fce7f3", text: "#be185d" },
  default:        { bg: "#f0fdf4", text: "#15803d" },
};

const getSportColor = (sport) => SPORT_COLORS[sport] || SPORT_COLORS.default;

const COURT_DESCRIPTIONS = {
  "Badminton Court": "Professional shock-absorbing wooden flooring.",
  "Table Tennis Court": "Top-tier tables with optimal non-slip flooring.",
  "Cricket Court": "Premium synthetic turf with high-quality nets.",
  "Tennis Court": "High-quality court with optimal bounce and grip."
};

/* 
  COURTS PAGE
   Displays all available courts in a grid for the user to select.
*/
export function CourtsPage({ courts, onSelect, nav }) {
  return (
    <div style={{ minHeight: "100vh" }}>
      <div style={{ padding: "48px 40px", maxWidth: "1000px", margin: "0 auto" }}>
        <div className="animate-fade" style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "36px", marginBottom: "8px" }}>Select a Court</h1>
          <p style={{ color: "var(--text-muted)" }}>Choose from our premium indoor sports facilities</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          {courts.map((c, i) => {
            let displayTitle = c.sport;
            if (c.name === "Cricket Court") displayTitle = "Cricket";

            return (
              <div
                key={c.id}
                className={`animate-fade delay-${i + 1}`}
                onClick={() => onSelect(c)}
                style={{
                  borderRadius: "16px", overflow: "hidden", cursor: "pointer",
                  background: "var(--surface)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)", transition: "all 0.25s",
                  border: "1px solid rgba(0,0,0,0.05)"
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)"; }}
              >
                {/* Court photo */}
                <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
                  <img
                    src={getCourtImage(c)}
                    alt={c.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                    onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
                    onMouseLeave={e => e.target.style.transform = "scale(1)"}
                  />
                  {/* Standard Arena badge */}
                  <div style={{
                    position: "absolute", top: "16px", left: "16px",
                    padding: "6px 14px", borderRadius: "20px",
                    background: "white", color: "#15803d",
                    fontSize: "13px", fontWeight: 700,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                  }}>
                    {c.name}
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: "24px" }}>
                  <h3 style={{ fontSize: "22px", fontWeight: 700, color: "#064e3b", marginBottom: "12px" }}>{displayTitle}</h3>
                  <p style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: 1.5 }}>
                    {COURT_DESCRIPTIONS[c.name] || `Premium indoor ${c.sport.toLowerCase()} court with professional equipment.`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="animate-fade" style={{
          textAlign: "center",
          padding: "48px 32px",
          borderRadius: "24px",
          background: "linear-gradient(135deg, var(--green-800), var(--green-950))",
          color: "white",
          boxShadow: "0 20px 48px rgba(5,46,22,0.3)",
          marginTop: "48px"
        }}>
          <h2 style={{
            fontSize: "28px", fontFamily: "Syne, sans-serif", fontWeight: 800,
            marginBottom: "12px", lineHeight: 1.2
          }}>
            Ready to Book a Court?
          </h2>
          <p style={{
            fontSize: "15px", opacity: 0.85, lineHeight: 1.7,
            maxWidth: "500px", margin: "0 auto 28px"
          }}>
            Select a court above to get started. Choose your preferred time slot, add equipment or a coach, and confirm your booking in minutes!
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => nav("equipments")}
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
              View Equipment →
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
          display: "flex", alignItems: "center", gap: "16px",
          marginBottom: "48px"
        }}>
          <div style={{ fontSize: "28px", flexShrink: 0 }}><FaLightbulb style={{ color: "#08ea1bff" }} /></div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--green-950)", marginBottom: "4px" }}>
              How Court Booking Works
            </div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6 }}>
              Click on any court above to begin. You can choose a time slot or a package, optionally add a coach or rental equipment, and confirm your booking — all in one seamless flow.
            </div>
          </div>
        </div>
      </div>
      <Footer nav={nav} />
    </div>
  );
}

/* 
    BOOKING TYPE PAGE
   User chooses between 'Time Booking' (hourly) or 'Package Booking' (bundles).
  */
export function BookingTypePage({ court, onSelect, nav }) {
  return (
    <div style={{ padding: "48px 40px", maxWidth: "760px", margin: "0 auto" }}>
      <div className="animate-fade" style={{ marginBottom: "36px" }}>
        <button className="btn-secondary btn-sm" onClick={() => nav("courts")} style={{ marginBottom: "20px" }}>← Back</button>

        {/* Selected court banner */}
        <div style={{
          display: "flex", alignItems: "center", gap: "16px",
          padding: "16px 20px", borderRadius: "14px",
          background: "var(--green-50)", border: "1.5px solid var(--green-200)",
          marginBottom: "28px",
        }}>
          <img
            src={getCourtImage(court)}
            alt={court?.name}
            style={{ width: 56, height: 56, borderRadius: "10px", objectFit: "cover" }}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: "16px" }}>{court?.name}</div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{court?.sport} · Indoor Court</div>
          </div>
          <span className="badge badge-confirmed" style={{ marginLeft: "auto" }}>Selected</span>
        </div>

        <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>Choose Booking Type</h1>
        <p style={{ color: "var(--text-muted)" }}>How would you like to book your slot?</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {[
          {
            type: "time",
            image: "https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=800&q=80",
            icon: "⏰", title: "Time Booking",
            desc: "Book by selecting your preferred start and end time. Flexible hourly rates — pay only for the time you use.",
            badge: "Flexible",
          },
          {
            type: "package",
            image: "https://images.pexels.com/photos/264787/pexels-photo-264787.jpeg?auto=compress&cs=tinysrgb&w=800",
            icon: "📦", title: "Package Booking",
            desc: "Choose from fixed-duration packages. Bundle deals save you money compared to hourly rates.",
            badge: "Save More",
          },
        ].map(t => (
          <div
            key={t.type}
            className="animate-fade"
            onClick={() => onSelect(t.type)}
            style={{
              borderRadius: "16px", overflow: "hidden", cursor: "pointer",
              border: "1.5px solid var(--border)", background: "var(--surface)",
              boxShadow: "var(--shadow-sm)", transition: "all 0.25s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "var(--green-400)"; e.currentTarget.style.boxShadow = "var(--shadow-lg)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}
          >
            {/* Image */}
            <div style={{ position: "relative", height: "140px", overflow: "hidden" }}>
              <img src={t.image} alt={t.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)" }} />
              <div style={{
                position: "absolute", top: "12px", right: "12px",
                background: "var(--green-500)", color: "white",
                fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "12px",
              }}>{t.badge}</div>
              <div style={{
                position: "absolute", bottom: "12px", left: "16px",
                fontSize: "28px",
              }}>{t.icon}</div>
            </div>

            {/* Info */}
            <div style={{ padding: "20px" }}>
              <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>{t.title}</h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6 }}>{t.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/*
   Reusable component to show already booked times for a specific date
*/
function BookedTimesDisplay({ court, date }) {
  const [bookedTimes, setBookedTimes] = useState([]);
  const [loadingTimes, setLoadingTimes] = useState(false);

  useEffect(() => {
    if (!date || !court) {
      setBookedTimes([]);
      return;
    }
    const fetchTimes = async () => {
      setLoadingTimes(true);
      try {
        const res = await api.get("/availability/booked-times", {
          params: { courtId: court.id, courtName: court.name, date }
        });
        setBookedTimes(res.data || []);
      } catch (e) {
        console.error("Failed to fetch booked times", e);
      } finally {
        setLoadingTimes(false);
      }
    };
    fetchTimes();
  }, [date, court]);

  if (!date) return null;

  return (
    <div className="animate-fade" style={{ marginTop: "16px", marginBottom: "16px", padding: "16px", borderRadius: "12px", background: "#f8fafc", border: "1.5px solid #e2e8f0" }}>
      <h4 style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", marginBottom: "12px", color: "#334155" }}>
        <FaClock /> Availability for {date}
      </h4>
      {loadingTimes ? (
        <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Checking slots...</div>
      ) : bookedTimes.length > 0 ? (
        <div>
          <div style={{ fontSize: "13px", color: "#dc2626", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px", fontWeight: 600 }}>
             <FaExclamationCircle /> The following times are already taken:
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {bookedTimes.map((bt, i) => (
              <span key={i} style={{ padding: "6px 12px", borderRadius: "8px", background: "#fee2e2", color: "#991b1b", fontSize: "12.5px", fontWeight: 700, border: "1px solid #fca5a5" }}>
                {bt.time}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ fontSize: "13px", color: "#16a34a", display: "flex", alignItems: "center", gap: "6px", fontWeight: 600 }}>
          <FaCheckCircle /> All time slots are currently open for this date!
        </div>
      )}
    </div>
  );
}

/* 
   TIME BOOKING PAGE
   Form for selecting a specific Date, Start Time, and End Time manually.
   */
export function TimeBookingPage({ court, onCheck, nav, loading }) {
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  return (
    <div style={{ padding: "48px 40px", maxWidth: "640px", margin: "0 auto" }}>
      <div className="animate-fade">
        <button className="btn-secondary btn-sm" onClick={() => nav("booking-type")} style={{ marginBottom: "20px" }}>← Back</button>
        <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>Select Date & Time</h1>

        {/* Court info */}
        <div style={{
          display: "flex", alignItems: "center", gap: "14px",
          padding: "14px 18px", borderRadius: "12px",
          background: "var(--green-50)", border: "1.5px solid var(--green-200)",
          marginBottom: "28px",
        }}>
          <img
            src={getCourtImage(court)}
            alt={court?.name}
            style={{ width: 48, height: 48, borderRadius: "9px", objectFit: "cover" }}
          />
          <div>
            <div style={{ fontWeight: 700 }}>{court?.name}</div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Time Booking · Hourly Rate</div>
          </div>
        </div>

        <div className="card" style={{ padding: "32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="form-group">
              <label className="form-label"> Date</label>
              <input className="form-input" type="date" min={new Date().toISOString().split('T')[0]} value={date} onChange={e => setDate(e.target.value)} />
            </div>
            
            <BookedTimesDisplay court={court} date={date} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label"> Start Time</label>
                <input className="form-input" type="time" value={start} onChange={e => setStart(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label"> End Time</label>
                <input className="form-input" type="time" value={end} onChange={e => setEnd(e.target.value)} />
              </div>
            </div>

            {date && start && end && (
              <div className="alert alert-success">
                 Ready to check: {date}, {start} – {end}
              </div>
            )}

            <button
              className="btn-primary"
              style={{ width: "100%", padding: "14px" }}
              onClick={() => onCheck(date, start, end, null)}
              disabled={!date || !start || !end || loading}
            >
              {loading ? "Checking..." : "Check Availability →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* PACKAGE BOOKING PAGE
   Form for selecting a fixed-duration package (e.g. 2 Hrs) + Date and Start Time. */
export function PackageBookingPage({ court, packages = [], onCheck, nav, loading }) {
  const [selected, setSelected] = useState(null);
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");

  // Debug: log packages data
  console.log('PackageBookingPage packages:', packages);

  // Filter packages strictly for the selected court
  const cName = (court?.name || "").toLowerCase().trim();
  const sportName = cName.replace(" court", "");
  const displayPackages = packages.filter(p => {
    const pCourt = (p.courtName || p.court || "").toLowerCase().trim();
    return pCourt === cName || pCourt === sportName || pCourt.includes(sportName);
  });
  return (
    <div style={{ padding: "48px 40px", maxWidth: "780px", margin: "0 auto" }}>
      <div className="animate-fade">
        <button className="btn-secondary btn-sm" onClick={() => nav("booking-type")} style={{ marginBottom: "20px" }}>← Back</button>
        <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>Select a Package</h1>

        {/* Court info */}
        <div style={{
          display: "flex", alignItems: "center", gap: "14px",
          padding: "14px 18px", borderRadius: "12px",
          background: "var(--green-50)", border: "1.5px solid var(--green-200)",
          marginBottom: "28px",
        }}>
          <img
            src={getCourtImage(court)}
            alt={court?.name}
            style={{ width: 48, height: 48, borderRadius: "9px", objectFit: "cover" }}
          />
          <div>
            <div style={{ fontWeight: 700 }}>{court?.name}</div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Package Booking · Save more with bundles</div>
          </div>
        </div>

        {/* Package cards */}
        {displayPackages.length === 0 ? (
          <div className="card" style={{ padding: "48px", textAlign: "center", marginBottom: "28px" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>📦</div>
            <h3 style={{ marginBottom: "8px" }}>No Packages Available</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
              No packages are available for <strong>{court?.name}</strong> yet. Please try Time Booking instead.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "28px" }}>
            {displayPackages.map(p => (
              <div
                key={p.id}
                onClick={() => setSelected(p)}
                style={{
                  padding: "24px 16px", borderRadius: "14px", textAlign: "center", cursor: "pointer",
                  border: selected?.id === p.id ? "2.5px solid var(--green-500)" : "1.5px solid var(--border)",
                  background: selected?.id === p.id ? "var(--green-50)" : "var(--surface)",
                  transition: "all 0.2s",
                  boxShadow: selected?.id === p.id ? "var(--shadow-md)" : "none",
                  position: "relative",
                }}
              >
                {selected?.id === p.id && (
                  <div style={{
                    position: "absolute", top: "-10px", right: "-10px",
                    width: 24, height: 24, borderRadius: "50%",
                    background: "var(--green-500)", color: "white",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "13px", fontWeight: 700,
                  }}>✓</div>
                )}
                <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "26px", color: "var(--green-700)" }}>
                  {p.duration}H
                </div>
                <div style={{ fontWeight: 700, fontSize: "18px", margin: "6px 0" }}>{p.price}/=</div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>{p.name}</div>
                {p.label && (
                  <div style={{
                    display: "inline-block", padding: "3px 10px", borderRadius: "12px",
                    background: "var(--green-100)", color: "var(--green-700)", fontSize: "11px", fontWeight: 700,
                  }}>{p.label}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Price calculation summary */}
        {selected && (
          <div className="card animate-fade" style={{
            padding: "20px 24px", marginBottom: "20px",
            background: "var(--green-50)", border: "1.5px solid var(--green-200)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600, marginBottom: "4px" }}>SELECTED PACKAGE</div>
                <div style={{ fontWeight: 700, fontSize: "16px" }}>{selected.name}</div>
                <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{selected.duration} Hours · {court?.name}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600, marginBottom: "4px" }}>TOTAL PRICE</div>
                <div style={{
                  fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "28px", color: "var(--green-700)",
                }}>{selected.price}/=</div>
                {selected.label && (
                  <div style={{
                    display: "inline-block", padding: "2px 8px", borderRadius: "10px",
                    background: "var(--green-100)", color: "var(--green-700)", fontSize: "11px", fontWeight: 700,
                  }}>{selected.label}</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Date and time */}
        <div className="card" style={{ padding: "28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
            <div className="form-group">
              <label className="form-label"> Date</label>
              <input className="form-input" type="date" min={new Date().toISOString().split('T')[0]} value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label"> Start Time</label>
              <input className="form-input" type="time" value={start} onChange={e => setStart(e.target.value)} />
            </div>
          </div>
          
          <BookedTimesDisplay court={court} date={date} />

          {!selected && (
            <div className="alert alert-warning" style={{ marginBottom: "16px" }}>
              ⚠️ Please select a package above first
            </div>
          )}

          <button
            className="btn-primary"
            style={{ width: "100%", padding: "14px" }}
            onClick={() => {
              let endStr = "";
              if (selected && selected.duration && start) {
                const [h, m] = start.split(":").map(Number);
                const d = new Date();
                d.setHours(h, m, 0);
                d.setMinutes(d.getMinutes() + selected.duration * 60);
                endStr = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
              }
              onCheck(date, start, endStr, selected);
            }}
            disabled={!selected || !date || !start || loading}
          >
            {loading ? "Checking..." : `Check Availability → ${selected ? `(${selected.price}/=)` : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}

