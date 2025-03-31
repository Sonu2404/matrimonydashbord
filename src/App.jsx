import { ThemeProvider } from "./utils/ThemeContext";
import Sidebar from "./components/sidebar/Sidebar";
import Navbar from "./components/navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import CategoriesPage from "./pages/CategoriesPage";
import ProductPage from "./pages/ProductPage";
import PaymentsPage from "./pages/PaymentsPage";
import OrdersPage from "./pages/OrdersPage";
import Analytics from "./components/analytics/Analytics";
import SettingsPage from "./pages/SettingsPage";
import CustomerPages from "./pages/CustomerPages";
import MailsPage from "./pages/MailsPage";
import { useState } from "react";
import Eventmain from "./components/event/eventmain/Eventmain";
import Addevent from "./components/event/addevent/Addevent";
import SanchalakForm from "./components/categories/Sanchalakform";
import MemberDetail from "./components/categories/Sanchalakdetail";
import VendorMain from "./components/vendormain/vendormain/Vendormain";
import VendorForm from "./components/vendormain/vendorform/Vendorform";
import Eventsdetail from "./components/event/Eventdetail/Eventdetail";
import Blogmain from "./components/blog/blogmain/Blogmain";
import Blogdetail from "./components/blog/blogdetail/Blogdetail";
import Addblog from "./components/blog/blogform/Blogform";
import Stepmain from "./components/groom/register/step/Step";
import Notificationmain from "./components/notification/notificationmain/Notificationmain";
import ProfileComponent from "./components/bride/profilecomponent/ProfileComponent";
import AddEventImage from "./components/event/addeventimage/AddEventImage";
import Addimage from "./components/event/addimage/Addimage";
import PricingMain from "./components/pricing/pricingmain/Pricingmain";
import PricingForm from "./components/pricing/pricingform/Pricingform";
import PricingPlans from "./components/pricing/pricingPlans/PricingPlans";
import VendorDetail from "./components/vendormain/vendordetail/Vendordetail";
import "./App.css";

function App() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <ThemeProvider>
      <div className={`Container ${sidebarVisible ? "SidebarVisible" : ""}`}>
        <Sidebar isVisible={sidebarVisible} toggleSidebar={toggleSidebar} />
        <div className="MainContainer">
          <Navbar toggleSidebar={toggleSidebar} />
          <div className="Page">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/customer" element={<CustomerPages />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/bridemain" element={<ProductPage />} />
              <Route path="/Groommain" element={<PaymentsPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/mails" element={<MailsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/event" element={<Eventmain />} />
              <Route path="/addevent" element={<Addevent />} />
              <Route path="/addevent/:id" element={<Addevent />} />
              <Route path="/addsanchalak" element={<SanchalakForm />} />
              <Route path="/viewsanchalak" element={<MemberDetail />} />
              <Route path="/sanchalakdetail/:id" element={<MemberDetail />} />
              <Route path="/editsanchalak/:id" element={<SanchalakForm />} />
              <Route path="/vendormain" element={<VendorMain />} />
              <Route path="/addvendor" element={<VendorForm />} />
              <Route path="/viewevent/:id" element={<Eventsdetail />} />
              <Route path="/blogmain" element={<Blogmain />} />
              <Route path="/addblog" element={<Addblog />} />
              <Route path="/addblog/:id" element={<Addblog />} />
              <Route path="/viewblog/:id" element={<Blogdetail />} />
              <Route path="/addprofile" element={<Stepmain />} />
              <Route path="/Notification" element={<Notificationmain />} />
              <Route path="/profile/:id" element={<ProfileComponent />} />
              <Route path="/editprofile/:id" element={<Stepmain />} />
              <Route path="/addimage" element={<AddEventImage />} />
              <Route path="/addimagemain" element={<Addimage />} />
              <Route path="/pricing" element={<PricingMain />} />
              <Route path="/editpricing/:id" element={<PricingForm />} />
              <Route path="/addpricing" element={<PricingForm />} />
              <Route path="/viewpricing/:id" element={<PricingPlans />} />
              <Route path="/vendordetail/:id" element={<VendorDetail />} />
              {/* Fixed the typo here */}
              <Route path="/editvendor/:id" element={<VendorForm />} />
            </Routes>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;