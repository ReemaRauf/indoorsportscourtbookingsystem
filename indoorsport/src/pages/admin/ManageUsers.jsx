import { useState } from "react";
import { FaTrash, FaSearch, FaTimes, FaWallet, FaChartPie, FaCalendarAlt, FaEnvelope, FaUserShield, FaUser } from "react-icons/fa";
import api from "../../api";

export default function ManageUsers({ users = [], bookings = [], onDelete, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Wallet update state
  const [walletAmount, setWalletAmount] = useState("");
  const [isUpdatingWallet, setIsUpdatingWallet] = useState(false);

  // ── Derived Stats & Helpers ───────────────────────────────────────────
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const getUserBookings = (userName) => {
    return bookings.filter(b => b.user === userName);
  };

  const isActive = (userName) => {
    const userBookings = getUserBookings(userName);
    return userBookings.some(b => b.date && new Date(b.date) > thirtyDaysAgo);
  };

  const getFavoriteSport = (userName) => {
    const userBookings = getUserBookings(userName);
    if (userBookings.length === 0) return "—";
    
    const counts = {};
    userBookings.forEach(b => {
      let sport = "Other";
      if (b.court?.toLowerCase().includes("badminton")) sport = "Badminton";
      if (b.court?.toLowerCase().includes("cricket")) sport = "Cricket";
      if (b.court?.toLowerCase().includes("table tennis")) sport = "Table Tennis";
      counts[sport] = (counts[sport] || 0) + 1;
    });

    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone?.includes(searchTerm)
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  // ── API Actions ───────────────────────────────────────────────────────
  const handleRoleToggle = async (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    if (!window.confirm(`Change ${user.name}'s role to ${newRole.toUpperCase()}?`)) return;
    
    try {
      await api.put(`/auth/users/${user.id}/role`, { role: newRole });
      onRefresh();
      setSelectedUser({ ...user, role: newRole }); // update local panel state
    } catch (err) {
      alert("Failed to update role");
    }
  };

  const handleWalletUpdate = async (action) => {
    if (!walletAmount || isNaN(walletAmount) || walletAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    
    setIsUpdatingWallet(true);
    try {
      const res = await api.put(`/auth/users/${selectedUser.id}/wallet`, {
        action,
        amount: parseFloat(walletAmount)
      });
      onRefresh();
      setSelectedUser({ ...selectedUser, walletBalance: res.data.walletBalance });
      setWalletAmount("");
      alert(`Wallet successfully ${action === "add" ? "credited" : "debited"}!`);
    } catch (err) {
      alert("Failed to update wallet");
    } finally {
      setIsUpdatingWallet(false);
    }
  };

  return (
    <div style={{ padding: "40px", display: "flex", position: "relative", minHeight: "100vh" }}>
      {/* ── Main Content Area ─────────────────────────────────────────── */}
      <div style={{ flex: 1, paddingRight: selectedUser ? "400px" : "0", transition: "padding-right 0.3s ease" }}>
        
        <div className="animate-fade" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
          <div>
            <h1 style={{ fontSize: "28px", marginBottom: "6px" }}>Manage Users</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>View and manage registered users</p>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "10px 16px", borderRadius: "10px",
            background: "var(--surface)", border: "1.5px solid var(--border)",
          }}>
            <FaSearch style={{ fontSize: "16px", color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                border: "none", outline: "none", background: "transparent",
                fontFamily: "DM Sans, sans-serif", fontSize: "14px",
                color: "var(--text-primary)", width: "200px",
              }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="animate-fade" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
          <div className="card" style={{ padding: "20px", textAlign: "center", borderBottom: "4px solid var(--green-500)" }}>
            <div style={{ fontSize: "32px", fontWeight: 800, color: "var(--green-700)" }}>{users.length}</div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 700, marginTop: "4px" }}>TOTAL USERS</div>
          </div>
          <div className="card" style={{ padding: "20px", textAlign: "center", borderBottom: "4px solid #3b82f6" }}>
            <div style={{ fontSize: "32px", fontWeight: 800, color: "#2563eb" }}>{users.filter(u => isActive(u.name)).length}</div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 700, marginTop: "4px" }}>ACTIVE USERS (30d)</div>
          </div>
          <div className="card" style={{ padding: "20px", textAlign: "center", borderBottom: "4px solid #f59e0b" }}>
            <div style={{ fontSize: "32px", fontWeight: 800, color: "#d97706" }}>{users.filter(u => u.role === "admin").length}</div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 700, marginTop: "4px" }}>ADMINS</div>
          </div>
          <div className="card" style={{ padding: "20px", textAlign: "center", borderBottom: "4px solid #8b5cf6" }}>
            <div style={{ fontSize: "32px", fontWeight: 800, color: "#7c3aed" }}>
              Rs. {users.reduce((s, u) => s + (u.walletBalance || 0), 0).toLocaleString()}/=
            </div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 700, marginTop: "4px" }}>TOTAL WALLET BAL.</div>
          </div>
        </div>

        {/* Table */}
        <div className="card animate-fade" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 24px", borderBottom: "1.5px solid var(--border)", background: "var(--surface-3)" }}>
            <h3 style={{ fontSize: "15px" }}>All Users ({filtered.length})</h3>
          </div>
          <table style={{ width: "100%" }}>
            <thead>
              <tr>{["Name", "Email", "Status", "Wallet", "Role", "Action"].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                    {searchTerm ? "No users match your search" : "No users found"}
                  </td>
                </tr>
              ) : (
                filtered.map(u => {
                  const active = isActive(u.name);
                  return (
                    <tr 
                      key={u.id} 
                      onClick={() => setSelectedUser(u)}
                      style={{ 
                        cursor: "pointer", 
                        background: selectedUser?.id === u.id ? "var(--green-50)" : "transparent",
                        transition: "background 0.2s"
                      }}
                    >
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: "50%",
                            background: u.role === "admin"
                              ? "linear-gradient(135deg, #f59e0b, #d97706)"
                              : "linear-gradient(135deg, var(--green-400), var(--green-600))",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "white", fontWeight: 700, fontSize: "14px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                          }}>
                            {u.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{u.name}</div>
                            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{u.phone || "No phone"}</div>
                          </div>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        {active ? (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--green-600)", fontWeight: 700, fontSize: "12px", background: "var(--green-50)", padding: "4px 10px", borderRadius: "20px" }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green-500)" }}></div> Active
                          </span>
                        ) : (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontWeight: 600, fontSize: "12px", background: "var(--surface-3)", padding: "4px 10px", borderRadius: "20px" }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--text-muted)" }}></div> Inactive
                          </span>
                        )}
                      </td>
                      <td style={{ fontWeight: 700, color: (u.walletBalance || 0) > 0 ? "var(--green-600)" : "var(--text-muted)" }}>
                        Rs. {u.walletBalance || 0}/=
                      </td>
                      <td>
                        <span style={{
                          padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 700,
                          background: u.role === "admin" ? "#fef3c7" : "var(--green-50)",
                          color: u.role === "admin" ? "#d97706" : "var(--green-700)",
                        }}>
                          {u.role === "admin" ? "Admin" : "User"}
                        </span>
                      </td>
                      <td>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(u.id); }} style={{
                          background: "#fee2e2", color: "#ef4444", border: "none",
                          width: "32px", height: "32px", borderRadius: "8px",
                          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                        }} title="Delete User">
                          <FaTrash size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── User Detail Side Panel ─────────────────────────────────────── */}
      <div style={{
        position: "fixed", top: 0, right: selectedUser ? 0 : "-400px",
        width: "400px", height: "100vh", background: "var(--surface)",
        boxShadow: "-4px 0 24px rgba(0,0,0,0.1)", transition: "right 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        zIndex: 100, display: "flex", flexDirection: "column", borderLeft: "1px solid var(--border)"
      }}>
        {selectedUser && (
          <>
            {/* Panel Header */}
            <div style={{ padding: "24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", background: "var(--green-50)" }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: selectedUser.role === "admin"
                    ? "linear-gradient(135deg, #f59e0b, #d97706)"
                    : "linear-gradient(135deg, var(--green-500), var(--green-700))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", fontWeight: 800, fontSize: "24px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                }}>
                  {selectedUser.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <h2 style={{ fontSize: "20px", marginBottom: "4px" }}>{selectedUser.name}</h2>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{
                      padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 800, textTransform: "uppercase",
                      background: selectedUser.role === "admin" ? "#f59e0b" : "var(--green-600)", color: "white"
                    }}>
                      {selectedUser.role}
                    </span>
                    <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Member since {formatDate(selectedUser.createdAt)}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} style={{ background: "transparent", border: "none", fontSize: "20px", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}>
                <FaTimes />
              </button>
            </div>

            {/* Panel Content (Scrollable) */}
            <div style={{ padding: "24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* Contact Info */}
              <div style={{ display: "grid", gap: "12px", background: "var(--surface-3)", padding: "16px", borderRadius: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-secondary)", fontSize: "14px" }}>
                  <FaEnvelope color="var(--green-600)" /> {selectedUser.email}
                </div>
                {selectedUser.phone && (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-secondary)", fontSize: "14px" }}>
                    <FaUser color="var(--green-600)" /> {selectedUser.phone}
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-secondary)", fontSize: "14px" }}>
                  <FaUserShield color={selectedUser.role === "admin" ? "#f59e0b" : "var(--green-600)"} /> 
                  <button onClick={() => handleRoleToggle(selectedUser)} style={{
                    background: "transparent", border: "none", color: "#3b82f6", fontWeight: 600, cursor: "pointer", textDecoration: "underline", padding: 0
                  }}>
                    {selectedUser.role === "admin" ? "Demote to User" : "Promote to Admin"}
                  </button>
                </div>
              </div>

              {/* CRM Stats */}
              <div>
                <h4 style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "1px", marginBottom: "12px" }}>Activity Overview</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div style={{ padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--surface)" }}>
                    <FaCalendarAlt color="var(--green-600)" style={{ marginBottom: "8px", fontSize: "18px" }} />
                    <div style={{ fontSize: "20px", fontWeight: 800 }}>{getUserBookings(selectedUser.name).length}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Total Bookings</div>
                  </div>
                  <div style={{ padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--surface)" }}>
                    <FaChartPie color="#3b82f6" style={{ marginBottom: "8px", fontSize: "18px" }} />
                    <div style={{ fontSize: "16px", fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {getFavoriteSport(selectedUser.name)}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Favorite Sport</div>
                  </div>
                </div>
              </div>

              {/* Wallet Management */}
              <div>
                <h4 style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "1px", marginBottom: "12px" }}>Wallet Management</h4>
                <div style={{ padding: "20px", borderRadius: "16px", background: "linear-gradient(135deg, var(--green-600), var(--green-800))", color: "white", boxShadow: "0 8px 24px rgba(22, 163, 74, 0.25)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <div>
                      <div style={{ fontSize: "12px", opacity: 0.9, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Current Balance</div>
                      <div style={{ fontSize: "32px", fontWeight: 800 }}>Rs. {selectedUser.walletBalance || 0}</div>
                    </div>
                    <FaWallet size={32} style={{ opacity: 0.2 }} />
                  </div>
                  
                  <div style={{ display: "flex", gap: "8px" }}>
                    <div style={{ position: "relative", flex: 1 }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#475569", fontWeight: 700 }}>Rs.</span>
                      <input 
                        type="number" 
                        placeholder="Amount" 
                        value={walletAmount}
                        onChange={e => setWalletAmount(e.target.value)}
                        style={{ width: "100%", padding: "10px 10px 10px 40px", borderRadius: "8px", border: "none", outline: "none", fontWeight: 600, color: "#0f172a" }}
                      />
                    </div>
                    <button onClick={() => handleWalletUpdate("add")} disabled={isUpdatingWallet} style={{
                      padding: "10px 16px", borderRadius: "8px", border: "none", background: "white", color: "var(--green-700)", fontWeight: 800, cursor: "pointer"
                    }}>
                      Add
                    </button>
                    <button onClick={() => handleWalletUpdate("deduct")} disabled={isUpdatingWallet} style={{
                      padding: "10px 16px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.3)", background: "transparent", color: "white", fontWeight: 800, cursor: "pointer"
                    }}>
                      Deduct
                    </button>
                  </div>
                </div>
              </div>


            </div>
          </>
        )}
      </div>
      
      {/* Overlay when panel is open on smaller screens (optional, but good for focus) */}
      {selectedUser && (
        <div 
          onClick={() => setSelectedUser(null)}
          style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            background: "rgba(0,0,0,0.2)", zIndex: 99, cursor: "pointer",
            animation: "fadeIn 0.3s"
          }}
        />
      )}
    </div>
  );
}
