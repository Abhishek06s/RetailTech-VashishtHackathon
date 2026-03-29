import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import VendorDashboard from "./pages/VendorDashboard.jsx";
import Deals from "./pages/Deals.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SearchProvider } from "./context/SearchContext.jsx";
import { LocationProvider } from "./context/LocationContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import Cart from "./pages/Cart.jsx";

// Import global fonts or styles
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <SearchProvider>
            <LocationProvider>
              <BrowserRouter>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/deals" element={<Deals />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/vendor-dashboard" element={<VendorDashboard />} />
                </Routes>
              </BrowserRouter>
            </LocationProvider>
          </SearchProvider>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;

