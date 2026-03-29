import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await signup(email, password, role, { 
        fullName, 
        businessName: role === "vendor" ? businessName : null, 
        phoneNumber: phone 
      });
      navigate("/");
    } catch (err) {
      setError("Failed to create account. " + err.message);
    }
    setLoading(false);
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="auth-subtitle">Join DealsHub to grab or offer the best deals.</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Registration Type</label>
            <select 
              value={role} 
              onChange={e => setRole(e.target.value)}
              required
            >
              <option value="customer">I'm a Customer (Looking for deals)</option>
              <option value="vendor">I'm a Vendor (Selling products)</option>
            </select>
          </div>
 
          <div className="form-group">
            <label>Full Name*</label>
            <input 
              type="text" 
              required 
              value={fullName} 
              onChange={e => setFullName(e.target.value)} 
              placeholder="Enter your full name" 
            />
          </div>

          {role === "vendor" && (
            <div className="form-group">
              <label>Business / Store Name*</label>
              <input 
                type="text" 
                required 
                value={businessName} 
                onChange={e => setBusinessName(e.target.value)} 
                placeholder="e.g. Urban Electronics" 
              />
            </div>
          )}

          <div className="form-group">
            <label>Phone Number*</label>
            <input 
              type="tel" 
              required 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              placeholder="e.g. +91 9876543210" 
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="Enter your email" 
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Create a strong password" 
            />
          </div>
          
          <button disabled={loading} type="submit" className="auth-btn">
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        
        <div className="auth-footer">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
    </div>
  );
}
