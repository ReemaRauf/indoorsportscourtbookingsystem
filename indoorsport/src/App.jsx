import { useState, useEffect } from "react";
import "./index.css";
import api from "./api";

// ─── Pages & Components ───────────────────────────────────────────────────────
import Navbar from "./components/Navbar";
import AdminSidebar from "./components/AdminSidebar";

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import CourtsPage from "./pages/CourtsPage";
import BookingTypePage from "./pages/BookingTypePage";
import TimeBookingPage from "./pages/TimeBookingPage";
import PackageBookingPage from "./pages/PackageBookingPage";
import AvailabilityResultPage from "./pages/AvailabilityResultPage";
import { BookingCoachPage, BookingEquipmentPage, BookingFormPage } from "./pages/UserPages";
import ConfirmationPage from "./pages/ConfirmationPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import EquipmentsPage from "./pages/EquipmentsPage";
import CoachesPage from "./pages/CoachesPage";
import ProfilePage from "./pages/ProfilePage";

import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageCourts from "./pages/admin/ManageCourts";
import ManagePackages from "./pages/admin/ManagePackages";
import ManageAvailability from "./pages/admin/ManageAvailability";
import ManageBookings from "./pages/admin/ManageBookings";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageEquipments from "./pages/admin/ManageEquipments";
import ManageCoaches from "./pages/admin/ManageCoaches";
import ManageCoachLeaves from "./pages/admin/ManageCoachLeaves";
import ManagePayments from "./pages/admin/ManagePayments";
import AdminReports from "./pages/admin/AdminReports";

export default function App() {
  // Auth state
  const [user, setUser] = useState(null);           // logged-in user
  const [page, setPage] = useState("home");         // current page/route
  const [loading, setLoading] = useState(true);

  // Booking flow state
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [bookingType, setBookingType] = useState(null);  // "time" | "package"
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [availabilityResult, setAvailabilityResult] = useState(null); // "available" | "not-available"
  const [bookingAddons, setBookingAddons] = useState({ coach: null, equipments: {} });
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);

  // App data
  const [courts, setCourts] = useState([]);
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [equipments, setEquipments] = useState([]);

  // Restore session
  useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    
    if (token && savedUser) {
      setTimeout(() => {
        if (mounted) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setPage(parsedUser.role === "admin" ? "admin-dashboard" : "home");
          setLoading(false);
        }
      }, 0);
    } else {
      setTimeout(() => {
        if (mounted) setLoading(false);
      }, 0);
    }
    
    return () => { mounted = false; };
  }, []);

  // Fetch Data
  const fetchAllData = async (currentUser) => {
    try {
      const courtsRes = await api.get("/courts");
      const pkgsRes = await api.get("/packages");
      const coachesRes = await api.get("/coaches");
      const equipmentsRes = await api.get("/equipments");
      
      let bookingsResData = [];
      if (currentUser) {
        const bookingsRes = await api.get("/bookings");
        bookingsResData = bookingsRes.data;
        
        try {
          const meRes = await api.get("/auth/me");
          setUser(prev => ({ ...prev, ...meRes.data }));
        } catch (e) {
          console.error("Failed to fetch user profile", e);
        }
      }

      let usersResData = [];
      if (currentUser?.role === "admin") {
        const usersRes = await api.get("/users");
        usersResData = usersRes.data;
      }

      setCourts(courtsRes.data);
      setPackages(pkgsRes.data);
      setCoaches(coachesRes.data);
      setEquipments(equipmentsRes.data);
      if (currentUser) setBookings(bookingsResData);
      if (currentUser?.role === "admin") setUsersList(usersResData);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchAllData(user);
    };

    if (!loading) {
      load();
    }
  }, [loading, user?.id]);

  // ── Navigation helper ──────────────────────────────────────────────────────
  const nav = (p) => setPage(p);

  // ── Auth ───────────────────────────────────────────────────────────────────
  const handleRegister = async (data) => {
    const res = await api.post("/auth/register", data);
    // Don't auto-login — let RegisterPage show success and redirect to login
    return res;
  };

  const handleLogin = async (data) => {
    try {
      const res = await api.post("/auth/login", data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      setBookingAddons({ coach: null, equipments: {} });
      nav("home");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setBookingAddons({ coach: null, equipments: {} });
    nav("login");
  };

  const handleAdminLogin = async (data) => {
    try {
      const res = await api.post("/auth/admin-login", data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      nav("admin-dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Admin Login failed");
    }
  };

  // ── Booking flow ───────────────────────────────────────────────────────────
  const handleSelectCourt = (court) => { 
    if (!user) { nav("login"); return; }
    setSelectedCourt(court); 
    setBookingAddons({ coach: null, equipments: {} });
    nav("booking-type"); 
  };
  const handleSelectType = (type) => { setBookingType(type); nav(type === "time" ? "time-booking" : "package-booking"); };
  
  const handleCheckAvailability = async (date, start, end, pkg) => {
    setBookingDate(date); setStartTime(start); setEndTime(end); setSelectedPackage(pkg);
    setApiLoading(true);
    try {
      const res = await api.post("/availability/check", {
        courtId: selectedCourt.id,
        courtName: selectedCourt.name,
        date,
        startTime: start,
        endTime: end || "",
        time: `${start} – ${end || ""}`
      });
      setAvailabilityResult(res.data.available ? "available" : "not-available");
      nav("availability-result");
    } catch (err) {
      console.error(err);
      alert("Error checking availability");
    } finally {
      setApiLoading(false);
    }
  };

  const handleProceedToForm = () => { nav("booking-form"); };
  
  const handleConfirmBooking = async (formData, formPrice, addOns) => {
    try {
      const bookingData = {
        court: selectedCourt?.name,
        date: bookingDate,
        time: `${startTime} – ${endTime || ""}`,
        type: bookingType === "time" ? "Time Booking" : "Package Booking",
        price: formPrice,
        user: formData.name,
        phone: formData.phone,
        pkg: selectedPackage ? selectedPackage.name : "—",
        coach: addOns?.coach || bookingAddons?.coach?.name || "",
        equipments: addOns?.equipments || bookingAddons?.equipments || [],
        advancePaid: addOns?.advancePaid || 0,
        paymentStatus: addOns?.paymentStatus || "Unpaid",
        status: addOns?.status || "Pending",
        useWallet: addOns?.useWallet || false,
        walletAmountUsed: addOns?.walletAmountUsed || 0
      };

      const res = await api.post("/bookings", bookingData);
      setConfirmedBooking(res.data);
      setBookingAddons({ coach: null, equipments: {} });
      fetchAllData(user); // Refresh bookings
      nav("confirmation");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  const handleCancelBooking = async (id) => {
    try {
      await api.put(`/bookings/${id}/status`, { status: "Cancelled" });
      fetchAllData(user);
    } catch (err) {
      console.error(err);
      alert("Failed to cancel");
    }
  };

  // ── Admin actions ──────────────────────────────────────────────────────────
  const handleApproveBooking = async (id) => {
    try {
      await api.put(`/bookings/${id}/status`, { status: "Confirmed" });
      fetchAllData(user);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelBookingAdmin = async (id, reason) => {
    try {
      await api.put(`/bookings/${id}/status`, { status: "Cancelled", reason });
      fetchAllData(user);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectBooking = async (id, reason) => {
    try {
      await api.put(`/bookings/${id}/status`, { status: "Rejected", reason });
      fetchAllData(user);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCourt = async (court) => {
    try {
      await api.post("/courts", court);
      fetchAllData(user);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditCourt = async (id, data) => {
    try {
      await api.put(`/courts/${id}`, data);
      fetchAllData(user);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCourt = async (id) => {
    try {
      await api.delete(`/courts/${id}`);
      fetchAllData(user);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPackage = async (pkg) => {
    try {
      await api.post("/packages", pkg);
      fetchAllData(user);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditPackage = async (id, data) => {
    try {
      await api.put(`/packages/${id}`, data);
      fetchAllData(user);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePackage = async (id) => {
    try {
      await api.delete(`/packages/${id}`);
      fetchAllData(user);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCoach = async (coach) => {
    try {
      await api.post("/coaches", coach);
      fetchAllData(user);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditCoach = async (id, data) => {
    try {
      await api.put(`/coaches/${id}`, data);
      fetchAllData(user);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCoach = async (id) => {
    try {
      await api.delete(`/coaches/${id}`);
      fetchAllData(user);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddEquipment = async (eq) => {
    try {
      await api.post("/equipments", eq);
      fetchAllData(user);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditEquipment = async (id, data) => {
    try {
      await api.put(`/equipments/${id}`, data);
      fetchAllData(user);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEquipment = async (id) => {
    try {
      await api.delete(`/equipments/${id}`);
      fetchAllData(user);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      fetchAllData(user);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleMarkPaid = async (id) => {
    try {
      await api.put(`/bookings/mark-paid/${id}`);
      fetchAllData(user);
    } catch (err) {
      console.error(err);
      alert("Failed to mark as paid");
    }
  };

  // ── Shared props ───────────────────────────────────────────────────────────
  const sharedProps = { nav, user, courts, packages, coaches, equipments, bookings, selectedCourt, bookingType, bookingDate, startTime, endTime, selectedPackage, availabilityResult, confirmedBooking, loading: apiLoading, bookingAddons, setBookingAddons };

  if (loading) return <div>Loading...</div>;

  // ── Admin layout wrapper ───────────────────────────────────────────────────
  const isAdminPage = page.startsWith("admin") && page !== "admin-login";

  if (page === "admin-login") return <AdminLoginPage onLogin={handleAdminLogin} nav={nav} />;

  if (isAdminPage) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", background: "var(--surface-2)" }}>
        <AdminSidebar page={page} nav={nav} onLogout={handleLogout} />
        <div style={{ flex: 1, overflow: "auto" }}>
          {page === "admin-dashboard" && <AdminDashboard bookings={bookings} nav={nav} />}
          {page === "admin-courts" && <ManageCourts courts={courts} onAdd={handleAddCourt} onEdit={handleEditCourt} onDelete={handleDeleteCourt} />}
          {page === "admin-packages" && <ManagePackages packages={packages} courts={courts} onAdd={handleAddPackage} onEdit={handleEditPackage} onDelete={handleDeletePackage} />}
          {page === "admin-availability" && <ManageAvailability courts={courts} />}
          {page === "admin-bookings" && <ManageBookings bookings={bookings} onApprove={handleApproveBooking} onCancel={handleCancelBookingAdmin} onReject={handleRejectBooking} />}
          {page === "admin-users" && <ManageUsers users={usersList} bookings={bookings} onDelete={handleDeleteUser} onRefresh={() => fetchAllData(user)} />}
          {page === "admin-equipments" && <ManageEquipments equipments={equipments} onAdd={handleAddEquipment} onEdit={handleEditEquipment} onDelete={handleDeleteEquipment} />}
          {page === "admin-coaches" && <ManageCoaches coaches={coaches} onAdd={handleAddCoach} onEdit={handleEditCoach} onDelete={handleDeleteCoach} />}
          {page === "admin-coach-leaves" && <ManageCoachLeaves coaches={coaches} />}
          {page === "admin-payments" && <ManagePayments bookings={bookings} onMarkPaid={handleMarkPaid} />}
          {page === "admin-reports" && <AdminReports bookings={bookings} coaches={coaches} equipments={equipments} />}
        </div>
      </div>
    );
  }

  const renderProtectedPage = (pageName, Component) => {
    if (!user) {
      return <LoginPage onLogin={handleLogin} nav={nav} />;
    }
    return Component;
  };

  const isAuthPage = page === "login" || page === "register";

  return (
    <div className="page-wrapper">
      {!isAuthPage && <Navbar user={user} page={page} nav={nav} onLogout={handleLogout} />}
      <div style={{ paddingTop: isAuthPage ? "0px" : "72px" }}>
        {page === "login" && <LoginPage onLogin={handleLogin} nav={nav} />}
        {page === "register" && <RegisterPage onRegister={handleRegister} nav={nav} />}
        {page === "home" && <HomePage nav={nav} user={user} />}
        {page === "profile" && <ProfilePage user={user} setUser={setUser} />}
        {page === "about" && <AboutPage nav={nav} />}
        {page === "courts" && <CourtsPage courts={courts} onSelect={handleSelectCourt} nav={nav} />}
        {page === "booking-type" && renderProtectedPage("booking-type", <BookingTypePage court={selectedCourt} onSelect={handleSelectType} nav={nav} />)}
        {page === "time-booking" && renderProtectedPage("time-booking", <TimeBookingPage court={selectedCourt} onCheck={handleCheckAvailability} nav={nav} loading={apiLoading} />)}
        {page === "package-booking" && renderProtectedPage("package-booking", <PackageBookingPage court={selectedCourt} packages={packages} onCheck={handleCheckAvailability} nav={nav} loading={apiLoading} />)}
        {page === "availability-result" && renderProtectedPage("availability-result", <AvailabilityResultPage {...sharedProps} />)}
        {page === "booking-coach" && renderProtectedPage("booking-coach", <BookingCoachPage {...sharedProps} />)}
        {page === "booking-equipment" && renderProtectedPage("booking-equipment", <BookingEquipmentPage {...sharedProps} />)}
        {page === "booking-form" && renderProtectedPage("booking-form", <BookingFormPage {...sharedProps} addons={bookingAddons} user={user} onConfirm={handleConfirmBooking} />)}
        {page === "confirmation" && renderProtectedPage("confirmation", <ConfirmationPage booking={confirmedBooking} nav={nav} />)}
        {page === "my-bookings" && renderProtectedPage("my-bookings", <MyBookingsPage bookings={bookings} onCancel={handleCancelBooking} nav={nav} />)}
        {page === "equipments" && <EquipmentsPage nav={nav} equipments={equipments} />}
        {page === "coaches" && <CoachesPage nav={nav} coaches={coaches} />}
      </div>
    </div>
  );
}
