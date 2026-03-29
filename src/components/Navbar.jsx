import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";
import { useLocation } from "../context/LocationContext";
import { useCart } from "../context/CartContext";
import { db } from "../firebase";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { Home, Tag, User, LogOut, Package, Search, MapPin, ShoppingCart } from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const { currentUser, userRole, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const { userLocation } = useLocation();
  const { cartCount } = useCart();
  const [allTitles, setAllTitles] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllTitles();
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = allTitles.filter(title => 
        title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5)); // Show top 5
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, allTitles]);

  async function fetchAllTitles() {
    try {
      const q = query(collection(db, "deals"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const titles = [];
      const now = new Date().getTime();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.endTime) {
          const endsAt = new Date(data.endTime).getTime();
          if (endsAt > now) {
            titles.push(data.title);
          }
        }
      });
      setAllTitles([...new Set(titles)]); // Unique titles
    } catch (err) {
      console.error("Error fetching titles for suggestions", err);
    }
  }

  const handleSuggestionClick = (title) => {
    setSearchQuery(title);
    setShowSuggestions(false);
    navigate("/"); // Navigate to home to see results
  };

  async function handleLogout() {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Deals<span>Hub</span>
        </Link>

        <div className="navbar-location">
          <MapPin size={16} />
          <span>{userLocation.city}</span>
        </div>

        <div className="navbar-search">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Search deals..." 
            className="search-input" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Small delay to allow click
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="search-suggestions">
              {suggestions.map((title, index) => (
                <li key={index} onClick={() => handleSuggestionClick(title)}>
                  <Search size={14} className="suggestion-icon" />
                  <span>{title}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <ul className="navbar-menu">
          <li>
            <Link to="/" className="navbar-item">
              <Home size={18} /> Home
            </Link>
          </li>
          <li>
            <Link to="/deals" className="navbar-item">
              <Tag size={18} /> Best Deals
            </Link>
          </li>
          
          {userRole !== "vendor" && (
            <li>
              <Link to="/cart" className="navbar-item cart-link">
                <div className="cart-icon-wrapper">
                  <ShoppingCart size={18} />
                  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </div>
                Cart
              </Link>
            </li>
          )}
          
          {currentUser ? (
            <>
              {userRole === "vendor" && (
                <li>
                  <Link to="/vendor-dashboard" className="navbar-item">
                    <Package size={18} /> Vendor Dashboard
                  </Link>
                </li>
              )}
              <li>
                <button onClick={handleLogout} className="navbar-btn btn-logout">
                  <LogOut size={16} /> Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="navbar-item">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="navbar-btn btn-primary">
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
