import { useState, useEffect } from "react";
import api from "../../api";
import { FaChartBar, FaFilePdf, FaBookOpen, FaMoneyBillWave, FaDumbbell, FaGraduationCap, FaChartLine } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

const TABS = [
  { key: "overview",   label: "Overview",   icon: <MdDashboard /> },
  { key: "booking",    label: "Booking",    icon: <FaBookOpen /> },
  { key: "payment",    label: "Payment",    icon: <FaMoneyBillWave /> },
  { key: "revenue",    label: "Revenue",    icon: <FaChartLine /> },
  { key: "coach",      label: "Coach",      icon: <FaGraduationCap /> },
  { key: "equipment",  label: "Equipment",  icon: <FaDumbbell /> },
];

export default function AdminReports({ bookings = [], coaches = [], equipments = [] }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSport, setSelectedSport] = useState("All");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentYear = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState("all");

  const years = Array.from(new Array(5), (_, i) => (parseInt(currentYear) - i).toString());
  const months = [
    { value: "01", label: "January" }, { value: "02", label: "February" },
    { value: "03", label: "March" },   { value: "04", label: "April" },
    { value: "05", label: "May" },     { value: "06", label: "June" },
    { value: "07", label: "July" },    { value: "08", label: "August" },
    { value: "09", label: "September" },{ value: "10", label: "October" },
    { value: "11", label: "November" },{ value: "12", label: "December" },
  ];

  useEffect(() => { fetchReports(); }, [selectedYear, selectedMonth]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/reports/detailed?year=${selectedYear}&month=${selectedMonth}`);
      setReports(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  // ── Sport detection helper ────────────────────────────────────────────
  const SPORTS = ["All", "Badminton", "Cricket", "Table Tennis"];

  const getSport = (courtName) => {
    if (!courtName) return "Other";
    const c = courtName.toLowerCase();
    if (c.includes("badminton")) return "Badminton";
    if (c.includes("cricket")) return "Cricket";
    if (c.includes("table tennis")) return "Table Tennis";
    return "Other";
  };

  // ── Filter bookings by sport and date ─────────────────────────────────
  const filteredBookings = bookings.filter(b => {
    // 1. Filter by Sport
    if (selectedSport !== "All" && getSport(b.court) !== selectedSport) return false;
    
    // 2. Filter by Date (Year and Month)
    if (!b.date) return false;
    const [y, m] = b.date.split("-");
    if (y !== selectedYear) return false;
    if (selectedMonth !== "all" && m !== selectedMonth) return false;

    return true;
  });
  // ── Derived Stats (from filtered bookings) ────────────────────────────
  const confirmed = filteredBookings.filter(b => b.status === "Confirmed");
  const cancelled = filteredBookings.filter(b => b.status === "Cancelled" || b.status === "Rejected");
  const pending   = filteredBookings.filter(b => b.status === "Pending");
  const fullyPaid = confirmed.filter(b => b.paymentStatus === "Fully Paid");

  const totalRevenue    = confirmed.reduce((s, b) => s + (b.price || 0), 0);
  const totalAdvance    = confirmed.reduce((s, b) => s + (b.advancePaid || 0), 0);
  const totalBalanceDue = confirmed.reduce((s, b) => {
    if (b.paymentStatus === "Fully Paid") return s;
    return s + ((b.price || 0) - (b.advancePaid || 0));
  }, 0);

  const courtStats = {};
  filteredBookings.forEach(b => {
    if (!b.court) return;
    if (!courtStats[b.court]) courtStats[b.court] = { total: 0, confirmed: 0, cancelled: 0, revenue: 0, advance: 0 };
    courtStats[b.court].total++;
    if (b.status === "Confirmed") { courtStats[b.court].confirmed++; courtStats[b.court].revenue += b.price || 0; courtStats[b.court].advance += b.advancePaid || 0; }
    if (b.status === "Cancelled" || b.status === "Rejected") courtStats[b.court].cancelled++;
  });

  const coachStats = {};
  filteredBookings.forEach(b => {
    if (!b.coach) return;
    if (!coachStats[b.coach]) coachStats[b.coach] = { bookings: 0 };
    coachStats[b.coach].bookings++;
  });

  const equipStats = {};
  filteredBookings.forEach(b => {
    (b.equipments || []).forEach(eq => {
      if (!equipStats[eq.name]) equipStats[eq.name] = { timesRented: 0, totalQty: 0 };
      equipStats[eq.name].timesRented++;
      equipStats[eq.name].totalQty += eq.quantity || 1;
    });
  });

  // Filter reports by sport too
  const filteredReports = selectedSport === "All" ? reports : reports.filter(r => r.sport === selectedSport);

  const periodLabel = selectedMonth === "all"
    ? `Year ${selectedYear}`
    : `${months.find(m => m.value === selectedMonth)?.label} ${selectedYear}`;

  // ── Reusable Components ───────────────────────────────────────────────
  const StatCard = ({ label, value, color = "var(--green-700)", border = "var(--green-500)", sub }) => (
    <div className="card" style={{ padding: "18px 22px", borderLeft: `4px solid ${border}` }}>
      <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>{label}</div>
      <div style={{ fontSize: "24px", fontWeight: 800, color }}>{value}</div>
      {sub && <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>{sub}</div>}
    </div>
  );

  const TableCard = ({ title, headers, children }) => (
    <div className="card animate-fade report-card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "14px 22px", borderBottom: "1.5px solid var(--border)", background: "var(--surface-3)" }}>
        <h3 style={{ fontSize: "15px" }}>{title}</h3>
      </div>
      <div className="table-wrapper">
        <table>
          <thead><tr>{headers.map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );

  const EmptyRow = ({ cols, msg = "No data found." }) => (
    <tr><td colSpan={cols} style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>{msg}</td></tr>
  );

  return (
    <div className="report-container" style={{ padding: "40px" }}>
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="no-print animate-fade" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", marginBottom: "6px", display: "flex", alignItems: "center", gap: "10px" }}>
            <FaChartBar /> Reports & Analytics
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Complete business overview of your indoor sports complex.</p>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-end", flexWrap: "wrap" }}>
          <div>
            <label style={{ display: "block", fontSize: "11px", marginBottom: "4px", color: "var(--text-muted)", fontWeight: 700 }}>Year</label>
            <select className="form-input" value={selectedYear} onChange={e => setSelectedYear(e.target.value)} style={{ padding: "8px 12px", minWidth: "90px" }}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "11px", marginBottom: "4px", color: "var(--text-muted)", fontWeight: 700 }}>Month</label>
            <select className="form-input" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} style={{ padding: "8px 12px", minWidth: "130px" }}>
              <option value="all">All Months</option>
              {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          <button onClick={() => window.print()} style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "9px 18px", borderRadius: "8px", border: "none",
            background: "#ef4444", color: "white", fontWeight: 700, cursor: "pointer", fontSize: "13px"
          }}>
            <FaFilePdf /> Export PDF
          </button>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────────────── */}
      <div className="no-print" style={{ display: "flex", gap: "6px", marginBottom: "28px", flexWrap: "wrap" }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            display: "flex", alignItems: "center", gap: "7px",
            padding: "9px 18px", borderRadius: "8px", border: "1.5px solid",
            borderColor: activeTab === t.key ? "var(--green-500)" : "var(--border)",
            background: activeTab === t.key ? "var(--green-50)" : "var(--surface)",
            color: activeTab === t.key ? "var(--green-700)" : "var(--text-muted)",
            fontWeight: 700, fontSize: "13px", cursor: "pointer", transition: "all 0.2s"
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── Sport Filter ─────────────────────────────────────────────────── */}
      <div className="no-print" style={{ display: "flex", gap: "6px", marginBottom: "28px", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-muted)", marginRight: "6px" }}>Sport:</span>
        {SPORTS.map(s => (
          <button key={s} onClick={() => setSelectedSport(s)} style={{
            padding: "7px 16px", borderRadius: "20px", border: "1.5px solid",
            borderColor: selectedSport === s ? "var(--green-500)" : "var(--border)",
            background: selectedSport === s ? "var(--green-600)" : "transparent",
            color: selectedSport === s ? "white" : "var(--text-secondary)",
            fontWeight: 700, fontSize: "12px", cursor: "pointer", transition: "all 0.2s"
          }}>
            {s}
          </button>
        ))}
      </div>

      {/* Print header */}
      <div className="print-only" style={{ display: "none", textAlign: "center", marginBottom: "30px" }}>
        <h2 style={{ marginBottom: "4px" }}>Sportiva Indoor Sports Complex</h2>
        <p style={{ fontSize: "16px", color: "#475569" }}>Business Report — {periodLabel}{selectedSport !== "All" ? ` — ${selectedSport}` : ""}</p>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          OVERVIEW TAB
      ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === "overview" && (
        <div className="animate-fade">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "16px", marginBottom: "28px" }}>
            <StatCard label="Total Bookings" value={filteredBookings.length} sub={`${confirmed.length} confirmed`} />
            <StatCard label="Total Revenue" value={`Rs. ${totalRevenue.toLocaleString()}/=`} sub="From confirmed bookings" />
            <StatCard label="Advance Collected" value={`Rs. ${totalAdvance.toLocaleString()}/=`} color="#2563eb" border="#3b82f6" sub="Online advance payments" />
            <StatCard label="Balance to Collect" value={`Rs. ${totalBalanceDue.toLocaleString()}/=`} color="#d97706" border="#f59e0b" sub={`${confirmed.length - fullyPaid.length} bookings pending`} />
            <StatCard label="Cancelled / Rejected" value={cancelled.length} color="#dc2626" border="#ef4444" />
            <StatCard label="Fully Paid" value={fullyPaid.length} color="#16a34a" border="#22c55e" sub={`Out of ${confirmed.length} confirmed`} />
          </div>

          <TableCard title={`Revenue by Sport — ${periodLabel}${selectedSport !== "All" ? " — " + selectedSport : ""}`} headers={["Sport", "Bookings", "Cancelled", "Revenue", "Advance Paid", "Balance Due"]}>
            {loading ? <EmptyRow cols={6} msg="Loading..." /> : filteredReports.length === 0 ? <EmptyRow cols={6} msg={`No data for ${periodLabel}.`} /> : (
              <>
                {filteredReports.map(r => (
                  <tr key={r.sport}>
                    <td style={{ fontWeight: 700, color: "var(--green-700)" }}>{r.sport}</td>
                    <td>{r.totalBookings}</td>
                    <td style={{ color: "#dc2626" }}>{r.cancelledBookings}</td>
                    <td style={{ fontWeight: 700, color: "var(--green-600)" }}>Rs. {r.totalRevenue.toLocaleString()}/=</td>
                    <td style={{ color: "#2563eb" }}>Rs. {r.advancePaid.toLocaleString()}/=</td>
                    <td style={{ color: "#d97706" }}>Rs. {(r.totalRevenue - r.advancePaid).toLocaleString()}/=</td>
                  </tr>
                ))}
                <tr style={{ background: "var(--surface-3)", fontWeight: 800 }}>
                  <td>TOTAL</td>
                  <td>{filteredReports.reduce((s, r) => s + r.totalBookings, 0)}</td>
                  <td style={{ color: "#dc2626" }}>{filteredReports.reduce((s, r) => s + r.cancelledBookings, 0)}</td>
                  <td style={{ color: "var(--green-700)" }}>Rs. {filteredReports.reduce((s, r) => s + r.totalRevenue, 0).toLocaleString()}/=</td>
                  <td style={{ color: "#2563eb" }}>Rs. {filteredReports.reduce((s, r) => s + r.advancePaid, 0).toLocaleString()}/=</td>
                  <td style={{ color: "#d97706" }}>Rs. {filteredReports.reduce((s, r) => s + r.totalRevenue - r.advancePaid, 0).toLocaleString()}/=</td>
                </tr>
              </>
            )}
          </TableCard>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          BOOKING TAB
      ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === "booking" && (
        <div className="animate-fade">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "16px", marginBottom: "28px" }}>
            <StatCard label="Total Bookings" value={filteredBookings.length} />
            <StatCard label="Confirmed" value={confirmed.length} color="#16a34a" border="#22c55e" />
            <StatCard label="Cancelled / Rejected" value={cancelled.length} color="#dc2626" border="#ef4444" />
          </div>

          <TableCard title="Bookings by Court" headers={["Court", "Total Bookings", "Confirmed", "Cancelled", "Revenue", "Advance Collected"]}>
            {Object.keys(courtStats).length === 0 ? <EmptyRow cols={6} msg="No bookings found." /> :
              Object.entries(courtStats).map(([court, v]) => (
                <tr key={court}>
                  <td style={{ fontWeight: 700 }}>{court}</td>
                  <td>{v.total}</td>
                  <td style={{ color: "#16a34a" }}>{v.confirmed}</td>
                  <td style={{ color: "#dc2626" }}>{v.cancelled}</td>
                  <td style={{ fontWeight: 700, color: "var(--green-600)" }}>Rs. {v.revenue.toLocaleString()}/=</td>
                  <td style={{ color: "#2563eb" }}>Rs. {v.advance.toLocaleString()}/=</td>
                </tr>
              ))
            }
          </TableCard>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          PAYMENT TAB
      ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === "payment" && (
        <div className="animate-fade">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "16px", marginBottom: "28px" }}>
            <StatCard label="Total Advance Collected" value={`Rs. ${totalAdvance.toLocaleString()}/=`} color="#2563eb" border="#3b82f6" />
            <StatCard label="Fully Paid Bookings" value={fullyPaid.length} color="#16a34a" border="#22c55e" />
          </div>

          <TableCard title="Payment Details (Confirmed Bookings)" headers={["Booking ID", "Customer", "Court", "Total Price", "Advance Paid", "Balance Due", "Payment Status"]}>
            {confirmed.length === 0 ? <EmptyRow cols={7} msg="No confirmed bookings." /> :
              confirmed.map(b => {
                const balance = b.paymentStatus === "Fully Paid" ? 0 : (b.price - (b.advancePaid || 0));
                return (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 700, color: "var(--green-700)" }}>{b.id}</td>
                    <td>{b.user}</td>
                    <td>{b.court}</td>
                    <td>Rs. {b.price}/=</td>
                    <td style={{ color: "#2563eb" }}>Rs. {b.advancePaid || 0}/=</td>
                    <td style={{ color: balance > 0 ? "#d97706" : "var(--text-muted)", fontWeight: balance > 0 ? 700 : 400 }}>Rs. {balance}/=</td>
                    <td>
                      {balance === 0 || b.paymentStatus === "Fully Paid"
                        ? <span className="badge badge-confirmed">Fully Paid</span>
                        : <span className="badge badge-pending" style={{ background: "#fef3c7", color: "#d97706" }}>Balance Pending</span>
                      }
                    </td>
                  </tr>
                );
              })
            }
          </TableCard>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          REVENUE TAB
      ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === "revenue" && (
        <div className="animate-fade">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "16px", marginBottom: "28px" }}>
            <StatCard label="Total Revenue" value={`Rs. ${totalRevenue.toLocaleString()}/=`} />
            <StatCard label="Advance Collected" value={`Rs. ${totalAdvance.toLocaleString()}/=`} color="#2563eb" border="#3b82f6" />
            <StatCard label="Balance Still Due" value={`Rs. ${totalBalanceDue.toLocaleString()}/=`} color="#d97706" border="#f59e0b" />
            <StatCard label="Confirmed Bookings" value={confirmed.length} color="#16a34a" border="#22c55e" />
          </div>

          <TableCard title={`Revenue by Sport — ${periodLabel}${selectedSport !== "All" ? " — " + selectedSport : ""}`} headers={["Sport", "Bookings", "Revenue", "Advance Paid", "Balance Due"]}>
            {loading ? <EmptyRow cols={5} msg="Loading..." /> : filteredReports.length === 0 ? <EmptyRow cols={5} msg="No data found." /> : (
              <>
                {filteredReports.map(r => (
                  <tr key={r.sport}>
                    <td style={{ fontWeight: 700, color: "var(--green-700)" }}>{r.sport}</td>
                    <td>{r.totalBookings - r.cancelledBookings}</td>
                    <td style={{ fontWeight: 700, color: "var(--green-600)" }}>Rs. {r.totalRevenue.toLocaleString()}/=</td>
                    <td style={{ color: "#2563eb" }}>Rs. {r.advancePaid.toLocaleString()}/=</td>
                    <td style={{ color: "#d97706" }}>Rs. {(r.totalRevenue - r.advancePaid).toLocaleString()}/=</td>
                  </tr>
                ))}
                <tr style={{ background: "var(--surface-3)", fontWeight: 800 }}>
                  <td>TOTAL</td>
                  <td>{filteredReports.reduce((s, r) => s + r.totalBookings - r.cancelledBookings, 0)}</td>
                  <td style={{ color: "var(--green-700)" }}>Rs. {filteredReports.reduce((s, r) => s + r.totalRevenue, 0).toLocaleString()}/=</td>
                  <td style={{ color: "#2563eb" }}>Rs. {filteredReports.reduce((s, r) => s + r.advancePaid, 0).toLocaleString()}/=</td>
                  <td style={{ color: "#d97706" }}>Rs. {filteredReports.reduce((s, r) => s + r.totalRevenue - r.advancePaid, 0).toLocaleString()}/=</td>
                </tr>
              </>
            )}
          </TableCard>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          COACH TAB
      ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === "coach" && (
        <div className="animate-fade">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "16px", marginBottom: "28px" }}>
            <StatCard label="Total Coaches" value={coaches.length} />
            <StatCard label="Coaches Booked" value={Object.keys(coachStats).length} color="#2563eb" border="#3b82f6" />
            <StatCard label="Total Coach Bookings" value={Object.values(coachStats).reduce((s, v) => s + v.bookings, 0)} color="#d97706" border="#f59e0b" />
          </div>

          <TableCard title={`Coach Performance${selectedSport !== "All" ? " — " + selectedSport : ""}`} headers={["Coach Name", "Sport", "Role", "Price / Hour", "Times Booked"]}>
            {(selectedSport === "All" ? coaches : coaches.filter(c => c.sport === selectedSport)).length === 0 ? <EmptyRow cols={5} msg="No coaches registered." /> :
              (selectedSport === "All" ? coaches : coaches.filter(c => c.sport === selectedSport)).map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 700 }}>{c.name}</td>
                  <td>{c.sport}</td>
                  <td>{c.role}</td>
                  <td>Rs. {c.price || 500}/=</td>
                  <td style={{ fontWeight: 700, color: (coachStats[c.name]?.bookings || 0) > 0 ? "var(--green-700)" : "var(--text-muted)" }}>
                    {coachStats[c.name]?.bookings || 0}
                  </td>
                </tr>
              ))
            }
          </TableCard>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          EQUIPMENT TAB
      ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === "equipment" && (
        <div className="animate-fade">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "16px", marginBottom: "28px" }}>
            <StatCard label="Total Equipment Types" value={equipments.length} />
            <StatCard label="Equipment Rented" value={Object.keys(equipStats).length} color="#2563eb" border="#3b82f6" sub="Unique types rented" />
            <StatCard label="Total Qty Rented" value={Object.values(equipStats).reduce((s, v) => s + v.totalQty, 0)} color="#d97706" border="#f59e0b" />
          </div>

          <TableCard title="Equipment Usage Report" headers={["Equipment", "Available Stock", "Price / Hour", "Times Rented", "Total Qty Rented"]}>
            {equipments.length === 0 ? <EmptyRow cols={5} msg="No equipment registered." /> :
              equipments.map(eq => (
                <tr key={eq.id}>
                  <td style={{ fontWeight: 700 }}>{eq.name}</td>
                  <td>{eq.quantity}</td>
                  <td>Rs. {eq.price}/=</td>
                  <td style={{ fontWeight: 700, color: (equipStats[eq.name]?.timesRented || 0) > 0 ? "var(--green-700)" : "var(--text-muted)" }}>
                    {equipStats[eq.name]?.timesRented || 0}
                  </td>
                  <td style={{ fontWeight: 700, color: (equipStats[eq.name]?.totalQty || 0) > 0 ? "#2563eb" : "var(--text-muted)" }}>
                    {equipStats[eq.name]?.totalQty || 0}
                  </td>
                </tr>
              ))
            }
          </TableCard>
        </div>
      )}

      {/* Print footer */}
      <div className="print-only" style={{ display: "none", marginTop: "40px", textAlign: "center", fontSize: "12px", color: "#64748b" }}>
        <p>Generated on {new Date().toLocaleString()}</p>
        <p>© Sportiva Indoor Sports Complex</p>
      </div>
    </div>
  );
}
