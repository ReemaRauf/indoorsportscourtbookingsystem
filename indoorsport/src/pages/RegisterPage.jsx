import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaArrowRight } from "react-icons/fa";

const FloatingParticle = ({ size, top, left, delay, duration }) => (
  <div style={{
    position: "absolute", width: size, height: size, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(34,197,94,0.3), transparent)",
    top, left, animation: `float ${duration}s ease-in-out ${delay}s infinite`,
    pointerEvents: "none", filter: "blur(1px)"
  }} />
);

export default function RegisterPage({ onRegister, nav }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedInput, setFocusedInput] = useState(null);
  const [hoveredImg, setHoveredImg] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const set = (k) => (e) => {
    setForm(p => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    if (!form.name.trim()) { newErrors.name = "Name is required"; isValid = false; }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = "Valid email is required"; isValid = false;
    }
    if (!form.phone.trim()) { newErrors.phone = "Phone is required"; isValid = false; }
    if (!form.password || form.password.length < 6) {
      newErrors.password = "Min. 6 characters"; isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onRegister(form);
      setSuccess(true);
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const images = [
    { src: "/court_badminton.png", alt: "Badminton Court", label: "Badminton" },
    { src: "/court_table_tennis.png", alt: "Table Tennis", label: "Table Tennis" },
    { src: "/court_cricket.png", alt: "Cricket Nets", label: "Cricket" },
  ];

  const fields = [
    { k: "name", label: "Full Name", type: "text" },
    { k: "email", label: "Email Address", type: "email" },
    { k: "phone", label: "Phone Number", type: "tel" },
  ];

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(170deg, #f0fdf4 0%, #fafffe 30%, #f5fdf8 60%, #ecfdf5 100%)",
      padding: "40px", fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden"
    }}>
      {/* Background decorative elements */}
      <div style={{ position: "absolute", top: "-200px", right: "-200px", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.08), transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-150px", left: "-150px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(22,163,74,0.06), transparent 70%)", pointerEvents: "none" }} />

      <FloatingParticle size="12px" top="15%" left="10%" delay={0} duration={7} />
      <FloatingParticle size="8px" top="70%" left="5%" delay={2} duration={5} />
      <FloatingParticle size="16px" top="25%" left="45%" delay={1} duration={8} />
      <FloatingParticle size="10px" top="80%" left="85%" delay={3} duration={6} />

      {/* Success Modal */}
      {success && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, animation: "fadeIn 0.3s ease",
        }}>
          <div style={{
            background: "linear-gradient(165deg, var(--green-950) 0%, #041a0b 100%)",
            borderRadius: "32px", padding: "56px 48px",
            maxWidth: "440px", width: "90%", textAlign: "center",
            boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset",
            color: "white", position: "relative", overflow: "hidden",
            animation: "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
          }}>
            <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "180px", height: "180px", background: "radial-gradient(circle, rgba(34,197,94,0.2), transparent 70%)", pointerEvents: "none" }} />

            <div style={{
              width: "88px", height: "88px", borderRadius: "50%",
              background: "linear-gradient(135deg, var(--green-400), var(--green-600))",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 32px", fontSize: "40px", color: "white",
              boxShadow: "0 16px 32px rgba(22,163,74,0.35)"
            }}>✓</div>
            <h2 style={{ fontSize: "32px", marginBottom: "14px", fontWeight: 800, fontFamily: "Syne, sans-serif" }}>
              Registration<br /><span style={{ color: "var(--green-400)" }}>Successful!</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "15px", lineHeight: 1.7, marginBottom: "36px" }}>
              Your account has been securely created.<br />Please sign in with your new credentials.
            </p>
            <button className="animated-btn" onClick={() => nav("login")}
              style={{
                width: "100%", padding: "18px",
                background: "linear-gradient(135deg, var(--green-500), var(--green-600), var(--green-500))",
                backgroundSize: "200% 200%",
                color: "white", border: "none", borderRadius: "16px", fontSize: "16px",
                fontWeight: 700, cursor: "pointer", transition: "all 0.4s",
                boxShadow: "0 8px 32px rgba(22,163,74,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"
              }}
              onMouseOver={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(22,163,74,0.45)"; }}
              onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(22,163,74,0.35)"; }}
            >
              Go to Sign In <FaArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      <div style={{
        maxWidth: "1280px", width: "100%", display: "flex", gap: "80px", alignItems: "center",
        flexWrap: "wrap"
      }}>

        {/* Left Side: Image Collage + Description */}
        <div style={{
          flex: "1 1 520px", display: "flex", flexDirection: "column", gap: "36px",
          opacity: isLoaded ? 1 : 0, transform: isLoaded ? "translateY(0)" : "translateY(40px)",
          transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)"
        }}>

          {/* Overlapping Collage */}
          <div style={{ position: "relative", width: "100%", height: "480px" }}>
            {/* Image 1 — Large back image */}
            <div style={{
              position: "absolute", top: 0, left: 0, width: "65%", height: "100%",
              borderRadius: "24px", overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              border: "5px solid white",
              zIndex: 1
            }}>
              <img src={images[0].src} alt={images[0].alt} style={{
                width: "100%", height: "100%", objectFit: "cover",
                transition: "transform 0.6s ease"
              }}
              onMouseOver={e => e.currentTarget.style.transform = "scale(1.03)"}
              onMouseOut={e => e.currentTarget.style.transform = "scale(1)"} />
            </div>

            {/* Image 2 — Top right overlap */}
            <div style={{
              position: "absolute", top: "20px", right: 0, width: "50%", height: "45%",
              borderRadius: "20px", overflow: "hidden",
              boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
              border: "5px solid white",
              zIndex: 2
            }}>
              <img src={images[1].src} alt={images[1].alt} style={{
                width: "100%", height: "100%", objectFit: "cover",
                transition: "transform 0.6s ease"
              }}
              onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseOut={e => e.currentTarget.style.transform = "scale(1)"} />
            </div>

            {/* Image 3 — Bottom right overlap */}
            <div style={{
              position: "absolute", bottom: "20px", right: "30px", width: "45%", height: "42%",
              borderRadius: "20px", overflow: "hidden",
              boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
              border: "5px solid white",
              zIndex: 3
            }}>
              <img src={images[2].src} alt={images[2].alt} style={{
                width: "100%", height: "100%", objectFit: "cover",
                transition: "transform 0.6s ease"
              }}
              onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseOut={e => e.currentTarget.style.transform = "scale(1)"} />
            </div>
          </div>

          {/* Description */}
          <div style={{
            paddingLeft: "8px",
            opacity: isLoaded ? 1 : 0, transform: isLoaded ? "translateY(0)" : "translateY(20px)",
            transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
              <div style={{
                width: "56px", height: "56px", borderRadius: "16px", overflow: "hidden",
                boxShadow: "0 8px 24px rgba(22,163,74,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center", background: "white"
              }}>
                <img src="/sportiva-logo.png" alt="Logo" style={{ width: "42px", height: "42px", objectFit: "contain" }} />
              </div>
              <div>
                <h1 style={{ fontSize: "38px", fontFamily: "Syne, sans-serif", fontWeight: 800, color: "var(--green-950)", letterSpacing: "-1px", lineHeight: 1 }}>
                  SPORTIVA
                </h1>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--green-600)", letterSpacing: "3px", textTransform: "uppercase" }}>Premium Indoor Courts</span>
              </div>
            </div>
            <p style={{ color: "var(--green-900)", fontSize: "16px", lineHeight: 1.8, maxWidth: "460px", fontWeight: 500, opacity: 0.85 }}>
              Elevate your game in world-class facilities. Experience pristine courts, professional-grade equipment, and a seamless booking process designed for athletes who demand the best.
            </p>
          </div>

        </div>

        {/* Right Side: Form Card */}
        <div style={{
          flex: "0 1 480px", margin: "0 auto",
          opacity: isLoaded ? 1 : 0, transform: isLoaded ? "translateX(0)" : "translateX(40px)",
          transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s"
        }}>
          <div style={{
            background: "linear-gradient(165deg, var(--green-950) 0%, #06200f 50%, #041a0b 100%)",
            borderRadius: "32px", padding: "44px 44px", color: "white",
            boxShadow: "0 40px 80px rgba(5,46,22,0.25), 0 0 0 1px rgba(255,255,255,0.05) inset",
            position: "relative", overflow: "hidden"
          }}>

            <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "200px", height: "200px", background: "radial-gradient(circle, rgba(34,197,94,0.2), transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "180px", height: "180px", background: "radial-gradient(circle, rgba(74,222,128,0.08), transparent 70%)", pointerEvents: "none" }} />

            {/* Tabs */}
            <div style={{ display: "flex", gap: "32px", marginBottom: "40px", position: "relative" }}>
              <div onClick={() => nav("login")} style={{
                fontSize: "13px", fontWeight: 600, letterSpacing: "1.5px", color: "rgba(255,255,255,0.35)",
                cursor: "pointer", textTransform: "uppercase", paddingBottom: "14px",
                borderBottom: "2px solid transparent", transition: "all 0.3s"
              }}
                onMouseOver={e => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                onMouseOut={e => { e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
              >
                Sign In
              </div>
              <div style={{
                fontSize: "13px", fontWeight: 700, letterSpacing: "1.5px", color: "var(--green-400)",
                cursor: "pointer", textTransform: "uppercase", paddingBottom: "14px",
                borderBottom: "2px solid var(--green-400)", transition: "all 0.3s"
              }}>
                Create Account
              </div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "rgba(255,255,255,0.06)" }} />
            </div>

            {/* Header */}
            <div style={{ marginBottom: "28px" }}>
              <h2 style={{ fontSize: "30px", marginBottom: "10px", fontFamily: "Syne, sans-serif", fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.2 }}>
                Create Your<br />
                <span style={{ color: "var(--green-400)" }}>Account</span>
              </h2>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", lineHeight: 1.6 }}>Join us to book your favourite courts.</p>
            </div>

            {/* Form */}
            <form onSubmit={e => { e.preventDefault(); handleSubmit(); }} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

              {fields.map(f => (
                <div key={f.k} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "1.5px", color: "rgba(255,255,255,0.7)", textTransform: "uppercase" }}>{f.label}</label>
                  <input type={f.type} value={form[f.k]} onChange={set(f.k)}
                    style={{
                      width: "100%", padding: "16px 18px",
                      background: focusedInput === f.k ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
                      border: errors[f.k] ? "1.5px solid #ef4444" : focusedInput === f.k ? "1.5px solid var(--green-400)" : "1.5px solid rgba(255,255,255,0.08)",
                      borderRadius: "14px", color: "white", fontSize: "14px", outline: "none",
                      transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                      boxShadow: focusedInput === f.k ? "0 0 0 4px rgba(34,197,94,0.12), 0 4px 16px rgba(34,197,94,0.08)" : "none"
                    }}
                    onFocus={() => setFocusedInput(f.k)}
                    onBlur={() => setFocusedInput(null)}
                  />
                  {errors[f.k] && <div style={{ color: "#ef4444", fontSize: "12px", fontWeight: 600 }}>⚠ {errors[f.k]}</div>}
                </div>
              ))}

              {/* Password */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "1.5px", color: "rgba(255,255,255,0.7)", textTransform: "uppercase" }}>Password</label>
                <div style={{ position: "relative" }}>
                  <input type={showPassword ? "text" : "password"} value={form.password} onChange={set("password")}
                    style={{
                      width: "100%", padding: "16px 18px",
                      background: focusedInput === 'password' ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
                      border: errors.password ? "1.5px solid #ef4444" : focusedInput === 'password' ? "1.5px solid var(--green-400)" : "1.5px solid rgba(255,255,255,0.08)",
                      borderRadius: "14px", color: "white", fontSize: "14px", outline: "none",
                      paddingRight: "54px",
                      transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                      boxShadow: focusedInput === 'password' ? "0 0 0 4px rgba(34,197,94,0.12), 0 4px 16px rgba(34,197,94,0.08)" : "none"
                    }}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer",
                      display: "flex", alignItems: "center", transition: "color 0.2s"
                    }}
                    onMouseOver={e => e.currentTarget.style.color = "rgba(255,255,255,0.8)"}
                    onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
                {errors.password && <div style={{ color: "#ef4444", fontSize: "12px", fontWeight: 600 }}>⚠ {errors.password}</div>}
              </div>

              <button
                type="submit" disabled={isSubmitting} className="animated-btn"
                style={{
                  width: "100%", padding: "18px", marginTop: "12px",
                  background: "linear-gradient(135deg, var(--green-500), var(--green-600), var(--green-500))",
                  backgroundSize: "200% 200%",
                  color: "white", border: "none", borderRadius: "16px", fontSize: "16px",
                  fontWeight: 700, cursor: isSubmitting ? "not-allowed" : "pointer",
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: "0 8px 32px rgba(22,163,74,0.35)", opacity: isSubmitting ? 0.7 : 1,
                  letterSpacing: "0.5px",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"
                }}
                onMouseOver={e => { if (!isSubmitting) { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(22,163,74,0.45)"; } }}
                onMouseOut={e => { if (!isSubmitting) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(22,163,74,0.35)"; } }}
              >
                {isSubmitting ? "Creating..." : <>Create Account <FaArrowRight size={14} /></>}
              </button>

              <p style={{ textAlign: "center", fontSize: "14px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
                Already have an account?{" "}
                <span onClick={() => nav("login")} style={{ color: "var(--green-400)", fontWeight: 700, cursor: "pointer", transition: "opacity 0.2s" }}
                  onMouseOver={e => e.currentTarget.style.opacity = "0.7"} onMouseOut={e => e.currentTarget.style.opacity = "1"}
                >Sign In</span>
              </p>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
}
