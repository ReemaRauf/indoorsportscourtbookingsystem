import { useState, useEffect } from "react";
import api from "../api";

export default function ProfilePage({ user, setUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || "", phone: user.phone || "" });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await api.put(`/auth/users/${user.id}`, formData);
      if (setUser) {
        const updatedUser = { ...user, name: res.data.name, phone: res.data.phone };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Failed to update profile." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>;

  return (
    <div style={{ padding: "48px 40px", maxWidth: "700px", margin: "0 auto", minHeight: "calc(100vh - 300px)" }}>
      <div className="animate-fade">
        <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>My Profile</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "32px" }}>Manage your personal information</p>

        {message.text && (
          <div className={`alert alert-${message.type === 'error' ? 'warning' : 'success'}`} style={{ marginBottom: "20px" }}>
            {message.text}
          </div>
        )}

        <div className="card" style={{ padding: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "32px", paddingBottom: "24px", borderBottom: "1px solid var(--border)" }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--green-500), var(--green-700))",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 800, fontSize: "32px",
              boxShadow: "0 8px 16px rgba(22, 163, 74, 0.2)"
            }}>{user.name?.charAt(0) || "U"}</div>
            <div>
              <h2 style={{ fontSize: "28px", marginBottom: "4px", fontWeight: 800 }}>{user.name}</h2>
              <div style={{ color: "var(--text-muted)", fontSize: "15px" }}>{user.email}</div>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }} className="animate-fade">
              <div>
                <label className="form-label" style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1.5px solid var(--border)", fontSize: "15px" }}
                />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1.5px solid var(--border)", fontSize: "15px" }}
                />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Email (Read Only)</label>
                <input
                  type="email"
                  className="form-input"
                  value={user.email}
                  disabled
                  style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1.5px solid var(--border)", background: "var(--surface-3)", color: "var(--text-muted)", cursor: "not-allowed", fontSize: "15px" }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ padding: "12px 24px", fontSize: "15px" }}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
                <button type="button" className="btn-secondary" onClick={() => { setIsEditing(false); setFormData({ name: user.name || "", phone: user.phone || "" }); }} disabled={isSubmitting} style={{ padding: "12px 24px", fontSize: "15px" }}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }} className="animate-fade">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                <div style={{ padding: "16px", borderRadius: "12px", background: "var(--surface-3)", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>Phone Number</div>
                  <div style={{ fontWeight: 700, fontSize: "16px" }}>{user.phone || "Not provided"}</div>
                </div>
                <div style={{ padding: "16px", borderRadius: "12px", background: "linear-gradient(135deg, var(--green-50), #dcfce7)", border: "1px solid var(--green-200)" }}>
                  <div style={{ fontSize: "11px", color: "var(--green-700)", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>Wallet Balance</div>
                  <div style={{ fontWeight: 800, fontSize: "20px", color: "var(--green-800)" }}>Rs. {user.walletBalance || 0}/=</div>
                </div>
              </div>
              <button className="btn-primary" style={{ alignSelf: "flex-start", padding: "12px 24px", fontSize: "15px" }} onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
