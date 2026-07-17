export default function CallToAction({ nav }) {
  return (
    <div style={{
      margin: "80px auto",
      maxWidth: "1100px",
      padding: "0 24px"
    }}>
      <div style={{
        background: "linear-gradient(135deg, var(--green-700), var(--green-950))",
        borderRadius: "24px",
        padding: "64px 32px",
        textAlign: "center",
        boxShadow: "var(--shadow-xl)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Decorative shapes */}
        <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-30px", left: "10%", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(255,255,255,0.02)", pointerEvents: "none" }} />
        
        <h2 style={{ fontSize: "36px", color: "white", marginBottom: "16px", fontFamily: "Syne, sans-serif" }}>
          Ready to Experience SPORTIVA?
        </h2>
        <p style={{ color: "var(--green-100)", marginBottom: "32px", fontSize: "16px", maxWidth: "500px", margin: "0 auto 32px", lineHeight: 1.6 }}>
          Claim your court, select your plan, and play in Sri Lanka's finest indoor facility without weather limits.
        </p>
        <button
          className="btn-primary"
          style={{ background: "white", color: "var(--green-800)", padding: "16px 40px", fontSize: "16px", borderRadius: "30px", fontWeight: 700 }}
          onClick={() => nav("courts")}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
        >
          Start Booking Now
        </button>
      </div>
    </div>
  );
}
