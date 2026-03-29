import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { Timer, ShoppingBag, MapPin, Package } from "lucide-react";
import { useSearch } from "../context/SearchContext";
import { useLocation } from "../context/LocationContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import "./Deals.css";

export default function Deals() {
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery } = useSearch();
  const { userLocation } = useLocation();
  const { addToCart } = useCart();
  const { userRole } = useAuth();
  const { showToast } = useToast();

  const handleAddToCart = (deal) => {
    addToCart(deal);
    showToast(`${deal.title} added to cart!`);
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  // Reactive sorting logic
  useEffect(() => {
    if (deals.length === 0) return;
    
    const sortedData = [...deals].sort((a, b) => {
      const aNear = a.location && a.location.toLowerCase().includes(userLocation.city.toLowerCase());
      const bNear = b.location && b.location.toLowerCase().includes(userLocation.city.toLowerCase());
      
      // If proximity is same, compare expiry times
      if (aNear === bNear) {
        // Fallback for deals without endTime
        if (a.endTime && !b.endTime) return -1;
        if (!a.endTime && b.endTime) return 1;
        
        if (a.endTime && b.endTime) {
          return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
        }
        return 0;
      }
      
      // Proximity priority
      if (aNear && !bNear) return -1;
      if (!aNear && bNear) return 1;
      return 0;
    });

    setDeals(sortedData);
  }, [userLocation.city]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredDeals(deals);
      return;
    }
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = deals.filter(deal => 
      deal.title.toLowerCase().includes(lowerQuery)
    );
    setFilteredDeals(filtered);
  }, [searchQuery, deals]);

  async function fetchDeals() {
    try {
      const q = query(collection(db, "deals"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const dealsData = [];
      const now = new Date().getTime();

      // Include all deals, but still filter out already expired ones if endTime exists
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.endTime) {
           const endsAt = new Date(data.endTime).getTime();
           if (endsAt > now) {
             dealsData.push({ id: doc.id, ...data });
           }
        } else {
           dealsData.push({ id: doc.id, ...data });
        }
      });
      
      setDeals(dealsData);
    } catch (err) {
      console.error("Error fetching deals", err);
    } finally {
      setLoading(false);
    }
  }

  // Helper to format time remaining accurately (just for aesthetics, simple version)
  const getTimeRemaining = (endTimeStr) => {
    const total = Date.parse(endTimeStr) - Date.parse(new Date());
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  if (loading) {
    return (
      <div className="deals-loading">
        <div className="spinner"></div>
        <p>Finding the best deals...</p>
      </div>
    );
  }

  return (
    <div className="deals-page">
      <div className="deals-hero">
        <h1>Flash Deals</h1>
        <p>Grab them before the timer runs out!</p>
      </div>

      <div className="deals-grid">
        {filteredDeals.length === 0 ? (
          <div className="no-deals">
            <h3>No Flash Deals Right Now</h3>
            <p>New deals are coming soon. Stay tuned. </p>

            <button onClick={() => navigate("/products")}>
              Browse Products
            </button>
          </div>
        ) : (
          filteredDeals.map(deal => (
            <div key={deal.id} className="deal-card">
              <div className="deal-img-wrapper">
                 <img src={deal.imageUrl} alt={deal.title} className="deal-img" />
                 {deal.location && deal.location.toLowerCase().includes(userLocation.city.toLowerCase()) && (
                   <div className="deal-near-badge">NEAR YOU</div>
                 )}
                 {deal.endTime && new Date(deal.endTime).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000 && (
                   <div className="deal-closing-badge">CLOSING SOON</div>
                 )}
                 <div className="deal-badge">HOT</div>
              </div>
              <div className="deal-content">
                <div className="deal-header-row">
                  <h3>{deal.title}</h3>
                  {deal.location && (
                    <div className="deal-location-tag">
                      <MapPin size={12} /> {deal.location}
                    </div>
                  )}
                </div>
                
                <div className="deal-price-row">
                  <span className="deal-price">₹{deal.price}</span>
                  {deal.originalPrice && <span className="deal-original-price">₹{deal.originalPrice}</span>}
                  {deal.originalPrice && (
                    <span className="deal-discount">
                      -{Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100)}%
                    </span>
                  )}
                </div>

                {deal.endTime && (
                  <div className="deal-timer-details">
                    <div className="deal-timer">
                      <Timer size={14} />
                      <span>Ends in {getTimeRemaining(deal.endTime)}</span>
                    </div>
                    <div className="deal-expiry-full">
                      Exp: {new Date(deal.endTime).toLocaleDateString()} at {new Date(deal.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                )}

                {userRole !== "vendor" ? (
                  <button onClick={() => handleAddToCart(deal)} className="deal-btn">
                    <ShoppingBag size={18} /> Add to Cart
                  </button>
                ) : (
                  <button disabled className="deal-btn deal-btn-disabled">
                    <Package size={18} /> Vendor View Only
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
