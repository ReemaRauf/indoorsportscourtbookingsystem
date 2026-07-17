import Footer from "../components/Footer";
import CallToAction from "../components/CallToAction";
import { FaCalendarCheck } from "react-icons/fa";
import { MdOutlineAccessTime, MdVerified, MdSportsHandball, MdBookOnline, MdSportsTennis, MdBuild } from "react-icons/md";

export default function HomePage({ nav, user }) {
  const features = [
    { icon: <FaCalendarCheck size={26} color="#16a34a" />, title: "Easy Booking", desc: "Book your court in under 2 minutes with our streamlined flow." },
    { icon: <MdOutlineAccessTime size={28} color="#16a34a" />, title: "Real-time Availability", desc: "See live slot availability and never double-book again." },
    { icon: <MdVerified size={28} color="#16a34a" />, title: "Instant Confirmation", desc: "Get email confirmation the moment admin approves your booking." },
  ];

  const sports = [
    { image: "/court_badminton.png", name: "Badminton", courts: 1 },
    { image: "/court_cricket.png", name: "Cricket", courts: 1 },
    { image: "/court_table_tennis.png", name: "Table Tennis", courts: 1 },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero */}
      <section style={{
        background: "linear-gradient(to bottom, rgba(6, 78, 59, 0.75), rgba(6, 78, 59, 0.9)), url('https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=1600&q=80') center/cover no-repeat",
        padding: "80px 40px 100px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{
          position: "absolute", top: "-80px", right: "-80px",
          width: "400px", height: "400px", borderRadius: "50%",
          background: "rgba(255,255,255,0.04)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-120px", left: "30%",
          width: "300px", height: "300px", borderRadius: "50%",
          background: "rgba(255,255,255,0.03)", pointerEvents: "none",
        }} />

        <div className="animate-fade" style={{ maxWidth: "1100px", margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "8px 16px", borderRadius: "20px",
            background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.3)",
            marginBottom: "28px",
          }}>
            <span style={{ fontSize: "12px", color: "var(--green-300)", fontWeight: 600, letterSpacing: "1px" }}>
               SRI LANKA'S PREMIER INDOOR SPORTS BOOKING
            </span>
          </div>
          <h1 style={{
            fontSize: "64px", fontFamily: "Syne, sans-serif", fontWeight: 800,
            color: "white", lineHeight: 1.05, marginBottom: "24px",
          }}>
            Welcome to<br />
            <span style={{ color: "var(--green-300)" }}>SPORTIVA</span><br />
            Booking System
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: "40px", maxWidth: "580px", margin: "0 auto 40px" }}>
            Book your favourite indoor courts easily and fast. Real-time availability, instant confirmation, and hassle-free management.
          </p>
          <button className="btn-primary" style={{
            padding: "18px 48px", fontSize: "18px", borderRadius: "14px",
            background: "white", color: "var(--green-800)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }} onClick={() => nav(user ? "courts" : "login")}>
            Start Booking Now →
          </button>
        </div>
      </section>

      {/* Sports cards */}
      <section style={{ padding: "64px 40px", background: "var(--surface-2)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "32px", marginBottom: "8px" }}>Available Courts</h2>
          <p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: "40px" }}>Choose from our premium indoor sports facilities</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {sports.map((s, i) => (
              <div key={s.name} className={`animate-fade delay-${i + 1}`}
                onClick={() => nav("courts")}
                style={{
                  borderRadius: "16px", overflow: "hidden", cursor: "pointer",
                  background: "var(--surface)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)", transition: "all 0.25s",
                  border: "1px solid rgba(0,0,0,0.05)",
                  display: "flex", flexDirection: "column"
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)"; }}
              >
                <div style={{ position: "relative", height: "160px", overflow: "hidden" }}>
                  <img src={s.image} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }} 
                       onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
                       onMouseLeave={e => e.target.style.transform = "scale(1)"} />
                </div>
                <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "20px", marginBottom: "8px", color: "#064e3b" }}>{s.name}</h3>
                  <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>{s.courts} Courts Available</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "64px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "32px", marginBottom: "8px" }}>Why Choose Us</h2>
          <p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: "48px" }}>Everything you need to book your perfect court</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            {features.map((f, i) => (
              <div key={f.title} className={`card animate-fade delay-${i + 1}`}
                style={{ textAlign: "center", border: "1.5px solid var(--border)" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "14px", margin: "0 auto 16px",
                  background: "linear-gradient(135deg, var(--green-100), var(--green-200))",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px",
                }}>{f.icon}</div>
                <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>{f.title}</h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CallToAction nav={nav} />

      {/* About Us */}
      <section style={{ padding: "80px 40px", background: "var(--surface)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "64px", alignItems: "center" }}>
          
          {/* Text Content */}
          <div className="animate-fade" style={{ flex: "1 1 440px" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "6px 14px", borderRadius: "20px",
              background: "var(--green-100)", border: "1px solid var(--green-200)",
              marginBottom: "20px",
            }}>
              <span style={{ fontSize: "12px", color: "var(--green-800)", fontWeight: 700, letterSpacing: "1px" }}>
                ABOUT SPORTIVA
              </span>
            </div>
            
            <h2 style={{ 
              fontSize: "40px", fontWeight: 800, 
              color: "var(--text-primary)", lineHeight: 1.2, marginBottom: "24px",
              letterSpacing: "-1px"
            }}>
              Elevating Your <span style={{ color: "var(--green-600)" }}>Indoor Sports</span> Experience.
            </h2>
            
            <p style={{ 
              color: "var(--text-secondary)", fontSize: "16px", lineHeight: 1.8, marginBottom: "32px",
              borderLeft: "4px solid var(--green-400)", paddingLeft: "16px",
              background: "linear-gradient(90deg, rgba(34,197,94,0.05) 0%, transparent 100%)",
              padding: "16px", borderRadius: "0 12px 12px 0"
            }}>
              Sportiva is Sri Lanka's premier indoor sports booking platform. We provide state-of-the-art facilities for Badminton, Tennis, Cricket, and Table Tennis enthusiasts. Our mission is to make sports accessible to everyone by offering a seamless booking experience and top-tier courts.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "36px" }}>
              {[
                { icon: <MdSportsHandball size={20} color="#16a34a" />, text: "Professional Coaching" },
                { icon: <MdBookOnline size={20} color="#16a34a" />, text: "Instant Online Booking" },
                { icon: <MdOutlineAccessTime size={20} color="#16a34a" />, text: "Real-time Availability" },
                { icon: <MdSportsTennis size={20} color="#16a34a" />, text: "Professional Equipment" }
              ].map(item => (
                <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "10px",
                    background: "var(--surface-2)", border: "1px solid var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "16px"
                  }}>{item.icon}</div>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>{item.text}</span>
                </div>
              ))}
            </div>
            
            <button className="btn-primary" style={{ padding: "14px 32px", borderRadius: "12px", fontSize: "15px" }} onClick={() => nav("about")}>
              Discover Our Story →
            </button>
          </div>

          {/* Image Content (Collage) */}
          <div className="animate-slide" style={{ flex: "1 1 400px", position: "relative", minHeight: "460px" }}>
            {/* Top Left Image */}
            <div style={{ 
              position: "absolute", top: "0", left: "0", width: "60%", height: "260px",
              borderRadius: "24px", overflow: "hidden", boxShadow: "var(--shadow-lg)",
              zIndex: 2, border: "6px solid var(--surface)"
            }}>
              <img src="/court_badminton.png" alt="Badminton" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            
            {/* Bottom Right Image */}
            <div style={{ 
              position: "absolute", bottom: "40px", right: "0", width: "65%", height: "280px",
              borderRadius: "24px", overflow: "hidden", boxShadow: "var(--shadow-xl)",
              zIndex: 1, border: "6px solid var(--surface)"
            }}>
              <img src="/sl_tennis.png" alt="Tennis" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>

            {/* Decorative Element */}
            <div style={{
              position: "absolute", top: "180px", right: "20%", width: "120px", height: "120px",
              borderRadius: "50%", background: "var(--green-200)", filter: "blur(40px)", zIndex: 0
            }} />
            
          </div>
          
        </div>
      </section>

      {/* Footer */}
      <Footer nav={nav} />
    </div>
  );
}
