import { useState } from "react";
import Footer from "../components/Footer";
import CallToAction from "../components/CallToAction";

import { FaSun, FaRegClock, FaCloudSun, FaShieldAlt, FaLightbulb, FaBolt, FaTicketAlt } from "react-icons/fa";
import { MdSportsTennis } from "react-icons/md";
export default function AboutPage({ nav }) {
  const [activeTab, setActiveTab] = useState("story");

  const stats = [
    { value: "3", label: "Premium Sports", icon: <MdSportsTennis color="#4ade80" /> },
  
    { value: "100%", label: "Weatherproof Courts", icon: <FaSun color="#4ade80" /> },
    { value: "24 Hours", label: "Open Daily", icon: <FaRegClock color="#4ade80" /> }
  ];

  const galleryItems = [
   
    { src: "/sl_badminton.png", title: "Badminton", desc: "Professional shock-absorbing wooden flooring." },
    { src: "/sl_table_tennis.png", title: "Table Tennis", desc: "Top-tier tables with optimal non-slip flooring." },
    { src: "/sl_cricket.png", title: "Cricket", desc: "Premium synthetic turf with high-quality nets." }
  ];

  const benefits = [
    { title: "All-Weather Play", desc: "Completely climate-controlled indoor arena. Never let rain, wind, or midday sun cancel your game.", icon: <FaCloudSun color="#16a34a" /> },
    { title: "Premium Surface Quality", desc: "Our courts feature advanced impact-absorbing underlays to reduce joint strain and improve player safety.", icon: <FaShieldAlt color="#16a34a" /> },
    { title: "Professional LED Lighting", desc: "Shadow-free, high-intensity LED systems designed specifically for high-speed sports visibility.", icon: <FaLightbulb color="#16a34a" /> },
    { title: "Seamless Smart Booking", desc: "Check live slot availability, lock in your package, and receive instant confirmation within minutes.", icon: <FaBolt color="#16a34a" /> },
    
    { title: "Flexible Packages", desc: "Choose from hourly slots, multi-session passes, or corporate bookings with cost-effective pricing.", icon: <FaTicketAlt color="#16a34a" /> }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface)", paddingTop: "40px", overflowX: "hidden" }}>
      
      {/* ─── Hero / Header Section ─── */}
      <div className="animate-fade" style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 60px", padding: "0 24px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "6px 16px", borderRadius: "20px",
          background: "var(--green-50)", border: "1.5px solid var(--border)",
          marginBottom: "20px"
        }}>
          <span style={{ fontSize: "11px", color: "var(--green-700)", fontWeight: 700, letterSpacing: "1.5px", fontFamily: "Syne, sans-serif" }}>
            MEET SPORTIVA
          </span>
        </div>
        <h1 style={{ fontSize: "52px", color: "var(--green-950)", marginBottom: "20px", fontFamily: "Syne, sans-serif", fontWeight: 800, lineHeight: 1.1 }}>
          Elevating Your Indoor <br/>
          <span style={{ background: "linear-gradient(135deg, var(--green-600), var(--green-800))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Sports Experience
          </span>
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "16px", lineHeight: 1.8, maxWidth: "640px", margin: "0 auto" }}>
          SPORTIVA stands as Sri Lanka's premier indoor athletic facility. We design and deliver top-tier, international-standard arenas to foster passion, performance, and play for everyone.
        </p>
      </div>

      {/* ─── Stats Grid ─── */}
      <div className="animate-scale" style={{ maxWidth: "1100px", margin: "0 auto 80px", padding: "0 24px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "24px",
          background: "linear-gradient(135deg, var(--green-900), var(--green-950))",
          borderRadius: "24px",
          padding: "48px 32px",
          boxShadow: "var(--shadow-xl)"
        }}>
          {stats.map((s, idx) => (
            <div key={idx} style={{ textAlign: "center", position: "relative" }}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>{s.icon}</div>
              <div style={{ fontSize: "38px", color: "white", fontFamily: "Syne, sans-serif", fontWeight: 800, marginBottom: "4px" }}>
                {s.value}
              </div>
              <div style={{ fontSize: "14px", color: "var(--green-200)", fontWeight: 600, letterSpacing: "0.5px" }}>
                {s.label}
              </div>
              {idx < stats.length - 1 && (
                <div style={{
                  position: "absolute", right: "-12px", top: "20%", bottom: "20%",
                  width: "1.5px", background: "rgba(255,255,255,0.15)",
                  display: "var(--display-desktop, block)"
                }} className="stats-divider" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Interactive Tabbed Story / Mission Section ─── */}
      <div className="animate-fade delay-1" style={{ maxWidth: "1100px", margin: "0 auto 100px", padding: "0 24px" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "40px" }}>
          {[
            { id: "story", label: "Our Story" },
            { id: "mission", label: "Our Mission" },
            { id: "standards", label: "Facility Standards" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "12px 28px",
                borderRadius: "30px",
                border: activeTab === tab.id ? "none" : "1.5px solid var(--border)",
                background: activeTab === tab.id ? "var(--green-600)" : "transparent",
                color: activeTab === tab.id ? "white" : "var(--text-secondary)",
                fontSize: "14px",
                fontWeight: 700,
                fontFamily: "DM Sans, sans-serif",
                cursor: "pointer",
                transition: "all 0.25s ease",
                boxShadow: activeTab === tab.id ? "var(--shadow-md)" : "none"
              }}
              onMouseEnter={e => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.borderColor = "var(--green-400)";
                  e.currentTarget.style.background = "var(--green-50)";
                }
              }}
              onMouseLeave={e => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{
          background: "var(--surface-2)",
          border: "1.5px solid var(--border)",
          borderRadius: "24px",
          padding: "48px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "48px",
          alignItems: "center",
          boxShadow: "var(--shadow-sm)"
        }}>
          <div>
            {activeTab === "story" && (
              <div className="animate-fade">
                <h2 style={{ fontSize: "36px", color: "var(--green-950)", marginBottom: "20px", fontFamily: "Syne, sans-serif" }}>
                  Founded on a Love for the Indoor Sports
                </h2>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "15px", marginBottom: "20px" }}>
                  SPORTIVA was born in 2026 out of a simple frustration: weather interruptions. Our founders, a team of local sport enthusiasts, realized how often tropical rains or high temperatures disrupted training,  and social sports.
                </p>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "15px" }}>
                  We set out to build a venue that removes all uncertainties. Today, ranging from weekend warriors to professional squads perfecting their craft.
                </p>
              </div>
            )}
            {activeTab === "mission" && (
              <div className="animate-fade">
                <h2 style={{ fontSize: "36px", color: "var(--green-950)", marginBottom: "20px", fontFamily: "Syne, sans-serif" }}>
                  Fostering Active & Healthy Communities
                </h2>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "15px", marginBottom: "20px" }}>
                  Our mission is to make active living highly accessible, structured, and enjoyable. We believe that professional-grade facilities shouldn't be locked behind exclusive club memberships.
                </p>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "15px" }}>
                  By providing a fully digitized booking platform and state-of-the-art courts, we break down barriers so you can focus entirely on staying fit, building friendships, and improving your sports.
                </p>
              </div>
            )}
            {activeTab === "standards" && (
              <div className="animate-fade">
                <h2 style={{ fontSize: "36px", color: "var(--green-950)", marginBottom: "20px", fontFamily: "Syne, sans-serif" }}>
                  Uncompromising Facility Standards
                </h2>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "15px", marginBottom: "20px" }}>
                  We partner with globally recognized court designers to implement high-quality flooring systems. From shock-absorbent acrylic surfaces to certified hardwood layouts, we build with your physical safety in mind.
                </p>
               
              </div>
            )}

            <div style={{ marginTop: "32px", display: "flex", gap: "10px", alignItems: "center" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--green-600)" }} />
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--green-800)" }}>Opening Hours:</div>
              <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                24/7 Access with Online Booking
              </div>
            </div>
          </div>

          <div style={{ borderRadius: "20px", overflow: "hidden", height: "350px", position: "relative", boxShadow: "var(--shadow-md)" }}>
            <img
              src={
                activeTab === "story"
                  ? "/story_showcase.png"
                  : activeTab === "mission"
                  ? "/community_showcase.png"
                  : "https://images.unsplash.com/photo-1545809074-59472b3f5ecc?w=800&q=80"
              }
              alt="Facility Showcase"
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)"
            }} />
          </div>
        </div>
      </div>

      {/* ─── Premium Sports Gallery ─── */}
      <div className="animate-fade delay-2" style={{ background: "var(--surface-2)", padding: "80px 0", borderTop: "1.5px solid var(--border)", borderBottom: "1.5px solid var(--border)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{ fontSize: "38px", color: "var(--green-950)", marginBottom: "12px", fontFamily: "Syne, sans-serif" }}>
              Explore Our Arenas
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "15px", maxWidth: "500px", margin: "0 auto" }}>
              Individually engineered courts designed to optimize play for each specific sport.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "24px"
          }}>
            {galleryItems.map((item, index) => (
              <div
                key={index}
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  background: "var(--surface)",
                  border: "1.5px solid var(--border)",
                  boxShadow: "var(--shadow-sm)",
                  transition: "all 0.3s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                  e.currentTarget.style.borderColor = "var(--green-400)";
                  e.currentTarget.querySelector("img").style.transform = "scale(1.06)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.querySelector("img").style.transform = "scale(1)";
                }}
                onClick={() => nav("courts")}
              >
                <div style={{ height: "180px", overflow: "hidden", position: "relative" }}>
                  <img
                    src={item.src}
                    alt={item.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                  />
                  <div style={{
                    position: "absolute", top: "12px", left: "12px",
                    background: "rgba(255,255,255,0.9)", backdropFilter: "blur(4px)",
                    padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 700,
                    color: "var(--green-800)", border: "1px solid var(--border)"
                  }}>
                    {item.title + ' Court'}
                  </div>
                </div>
                <div style={{ padding: "20px" }}>
                  <h4 style={{ fontSize: "18px", color: "var(--green-950)", marginBottom: "6px", fontFamily: "Syne, sans-serif" }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Benefits Section ─── */}
      <div className="animate-fade delay-3" style={{ maxWidth: "1100px", margin: "100px auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2 style={{ fontSize: "38px", color: "var(--green-950)", marginBottom: "12px", fontFamily: "Syne, sans-serif" }}>
            The SPORTIVA Advantage
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "15px", maxWidth: "550px", margin: "0 auto" }}>
            We've set a new standard for recreational play. Experience sport with the convenience, protection, and premium amenities you deserve.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px"
        }}>
          {benefits.map((b, idx) => (
            <div
              key={idx}
              className="card"
              style={{
                border: "1.5px solid var(--border)",
                transition: "all 0.25s ease"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--green-400)";
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                e.currentTarget.style.transform = "none";
              }}
            >
              <div style={{
                width: "48px", height: "48px", borderRadius: "12px",
                background: "var(--green-50)", border: "1.5px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "24px", marginBottom: "20px"
              }}>
                {b.icon}
              </div>
              <h4 style={{ fontSize: "18px", color: "var(--green-950)", marginBottom: "10px", fontFamily: "Syne, sans-serif" }}>
                {b.title}
              </h4>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </div>



      {/* ─── Call To Action Section ─── */}
      <CallToAction nav={nav} />

      {/* ─── Footer ─── */}
      <Footer nav={nav} />
    </div>
  );
}
