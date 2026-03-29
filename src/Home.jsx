import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { MapPin, ShoppingBag, Search, Package } from "lucide-react";
import { useSearch } from "./context/SearchContext";
import { useLocation } from "./context/LocationContext";
import { useAuth } from "./context/AuthContext";
import { useCart } from "./context/CartContext";
import { useToast } from "./context/ToastContext";
import "./Home.css";

export default function Home() {
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
      const aNear = a.location?.toLowerCase().includes(userLocation.city.toLowerCase());
      const bNear = b.location?.toLowerCase().includes(userLocation.city.toLowerCase());
      
      // If proximity is same, compare expiry times
      if (aNear === bNear) {
        // Fallback for deals without endTime: put them at the end
        if (a.endTime && !b.endTime) return -1;
        if (!a.endTime && b.endTime) return 1;
        
        // Both have or lack endTime: sort by time or recency
        if (a.endTime && b.endTime) {
          return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
        }
        return 0; // maintain relative order
      }
      
      // Proximity priority
      if (aNear && !bNear) return -1;
      if (!aNear && bNear) return 1;
      return 0; 
    });

    setDeals(sortedData);
  }, [userLocation.city]);

  useEffect(() => {
    // Client-side search filtering using global searchQuery
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
           // Standard deals/products without a timer
           dealsData.push({ id: doc.id, ...data });
        }
      });
      setDeals(dealsData);
      setFilteredDeals(dealsData);
    } catch (err) {
      console.error("Error fetching deals", err);
    } finally {
      setLoading(false);
    }
  }

  // Format price dynamically based on detected currency
  const formatPrice = (price) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: userLocation.currency || 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(price);
    } catch (e) {
      // Fallback if currency code is invalid
      return `₹${price}`;
    }
  };

  if (loading) {
    return (
      <div className="home-loading">
        <div className="spinner"></div>
        <p>Loading your local deals...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="home-hero">
        <h1>Welcome to DealsHub</h1>
        <p>Discover the best local products and massive discounts around you.</p>
        
        <div className="location-badge">
          <MapPin size={18} />
          {userLocation.city}{userLocation.country ? `, ${userLocation.country}` : ""}
        </div>
      </div>

      <div className="products-header">
        <h2>Trending Now</h2>
      </div>

      <div className="product-grid">
        {filteredDeals.length === 0 ? (
          <div className="empty-state">
            <h3>No products found</h3>
            <p>Vendors haven't posted any deals right now. Check back soon!</p>
          </div>
        ) : (
          filteredDeals.map(deal => (
            <div key={deal.id} className="product-card">
              <div className="product-image-wrapper">
                 <img src={deal.imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"} alt={deal.title} className="product-image" />
                 {deal.location && deal.location.toLowerCase().includes(userLocation.city.toLowerCase()) && (
                    <div className="product-near-badge">NEAR YOU</div>
                 )}
                 {deal.endTime && new Date(deal.endTime).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000 && (
                    <div className="product-closing-badge">CLOSING SOON</div>
                 )}
                 {deal.originalPrice && (
                    <div className="product-discount-tag">
                      -{Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100)}%
                    </div>
                  )}
              </div>
              
              <div className="product-info">
                <h3 className="product-title">{deal.title}</h3>
                
                <div className="product-meta">
                  {deal.location && (
                    <span className="product-location">
                      <MapPin size={14} /> {deal.location}
                    </span>
                  )}
                  {deal.endTime && (
                    <span className="product-expiry">
                      Exp: {new Date(deal.endTime).toLocaleDateString()} at {new Date(deal.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>

                <div className="product-price-row">
                  <span className="product-price">{formatPrice(deal.price)}</span>
                  {deal.originalPrice && (
                    <span className="product-original-price">{formatPrice(deal.originalPrice)}</span>
                  )}
                </div>

                {userRole !== "vendor" ? (
                  <button onClick={() => handleAddToCart(deal)} className="btn-grab">
                    <ShoppingBag size={18} /> Add to Cart
                  </button>
                ) : (
                  <button disabled className="btn-grab btn-disabled">
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
