import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, addDoc, query, where, getDocs, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import { Trash2, Plus, Package, Clock, MapPin } from "lucide-react";
import "./Dashboard.css";

export default function VendorDashboard() {
  const { currentUser, userRole } = useAuth();
  const [deals, setDeals] = useState([]);
  
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser && userRole === "vendor") {
      fetchMyDeals();
    }
  }, [currentUser, userRole]);

  async function fetchMyDeals() {
    try {
      const q = query(collection(db, "deals"), where("vendorId", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      const dealsData = [];
      querySnapshot.forEach((doc) => {
        dealsData.push({ id: doc.id, ...doc.data() });
      });
      setDeals(dealsData);
    } catch (err) {
      console.error("Error fetching deals", err);
    }
  }

  async function handleAddDeal(e) {
    e.preventDefault();
    if (!title || !price || !endTime) {
      return setError("Please fill all required fields.");
    }

    try {
      setError("");
      setLoading(true);
      await addDoc(collection(db, "deals"), {
        vendorId: currentUser.uid,
        title,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=60",
        endTime: new Date(endTime).toISOString(),
        location: location || "Remote/Online",
        createdAt: serverTimestamp()
      });
      
      setTitle("");
      setPrice("");
      setOriginalPrice("");
      setImageUrl("");
      setEndTime("");
      setLocation("");
      fetchMyDeals(); // Refresh list
    } catch (err) {
      setError("Failed to add deal: " + err.message);
    }
    setLoading(false);
  }

  async function handleDeleteDeal(dealId) {
    if (!window.confirm("Are you sure you want to remove this deal? This action cannot be undone.")) return;
    
    try {
      await deleteDoc(doc(db, "deals", dealId));
      setDeals(deals.filter(deal => deal.id !== dealId));
    } catch (err) {
      console.error("Error deleting deal", err);
      alert("Failed to delete deal. Please try again.");
    }
  }

  if (userRole !== "vendor") {
    return (
      <div className="container center-msg">
        <h2>Access Denied</h2>
        <p>Only vendors can access this dashboard.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Vendor Dashboard</h2>
        <p>Manage your timed deals and boost your sales.</p>
      </div>

      <div className="dashboard-grid">
        <div className="box-card">
          <h3>Post a New Deal</h3>
          {error && <div className="error-alert">{error}</div>}
          
          <form onSubmit={handleAddDeal} className="deal-form">
            <div className="form-group">
              <label>Product Title*</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Sony WH-1000XM4" required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Offer Price (₹)*</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Original Price (₹)</label>
                <input type="number" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label>Image URL</label>
              <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." />
            </div>

            <div className="form-group">
              <label>Store/Deal Location*</label>
              <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Mumbai, India" required />
            </div>

            <div className="form-group">
              <label>Expiry Date & Time*</label>
              <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required />
            </div>

            <button disabled={loading} type="submit" className="btn-save">
              {loading ? "Posting Deal..." : "Post Deal"}
            </button>
          </form>
        </div>

        <div className="box-card">
          <h3>Your Active Deals</h3>
          {deals.length === 0 ? (
            <p className="empty-state">You haven't posted any deals yet.</p>
          ) : (
            <div className="deals-list">
                {deals.map(deal => (
                  <div key={deal.id} className="deal-list-item">
                    <img src={deal.imageUrl} alt={deal.title} className="deal-thumb" />
                    <div className="deal-info">
                      <div className="deal-title-row">
                        <h4>{deal.title}</h4>
                        <button 
                          onClick={() => handleDeleteDeal(deal.id)} 
                          className="btn-delete"
                          title="Remove Deal"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="price-tag">
                        <span className="current">₹{deal.price}</span>
                        {deal.originalPrice && <span className="original">₹{deal.originalPrice}</span>}
                      </div>
                      <small>Ends: {new Date(deal.endTime).toLocaleString()}</small>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
