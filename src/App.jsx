import { BrowserRouter as Router, Routes, Route, useLocation, useMatch } from "react-router-dom";
import { useState, useEffect } from "react";
import Calendar from "./components/Calendar";
import Navbarhome from "./components/Navbarhome";
import Footer from "./components/Footer";
import Home from "./components/home";
import Carousell from "./components/Carousell";
import Login from "./components/Login";
import Register from "./components/Reg";
import AdminPage from "./components/admin";
import Putcar from "./components/putcar";
import CarRentalForm from "./components/formbookingcar";
import AddCarForm from "./components/Addcar";
import Sidebar from "./components/Navbaradmin";
import VehicleTable from "./components/VehicleTable";
import EditCarForm from "./components/EditCarForm";
import RentalTable from "./components/RentalTable";

function AppContent({ user, setUser }) {
  const location = useLocation();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, [setUser]);

  const hideNavbarPages = ["/admin", "/incar", "/Tablecar", "/addcar","/TableRental"];
  const hideFooterPages = ["/Login", "/incar", "/admin", "/Tablecar", "/addcar","/TableRental"];

  // Use useMatch instead of matchPath
  const isEditCarPage = useMatch("/editcar/:carId");
  const isAdminPage = ["/admin", "/Tablecar", "/addcar","/TableRental"].includes(location.pathname);

  const shouldShowNavbar = !(hideNavbarPages.includes(location.pathname) || isEditCarPage);
  const shouldShowSidebar = isAdminPage || isEditCarPage;
  const shouldShowFooter = !(hideFooterPages.includes(location.pathname) || isEditCarPage);

  return (
    <div style={{ display: "flex" }}>
      {shouldShowSidebar && <Sidebar />}  
      <div style={{ flex: 1 }}>
        {shouldShowNavbar && <Navbarhome user={user} setUser={setUser} />}
        <Routes>
          <Route path="/" element={<><Carousell /></>} />
          <Route path="/home" element={<Home />} />
          <Route path="/Login" element={<Login setUser={setUser} />} />
          <Route path="/Reg" element={<Register />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/putcar" element={<Putcar />} />
          <Route path="/carform/:carId" element={<CarRentalForm />} />
          <Route path="/addcar" element={<AddCarForm />} />
          <Route path="/Tablecar" element={<VehicleTable />} />
          <Route path="/editcar/:carId" element={<EditCarForm />} />
          <Route path="/TableRental" element={<RentalTable />} />
        </Routes>
        {shouldShowFooter && <Footer />}
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <AppContent user={user} setUser={setUser} />
    </Router>
  );
}

export default App;