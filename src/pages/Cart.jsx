import React from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Trash2, Plus, Minus, ArrowLeft, CreditCard, Smartphone, Wallet, Info } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import "./Cart.css";

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, totalAmount, cartCount } = useCart();
  const { userRole } = useAuth();

  // If vendor accidentally navigates here, redirect them
  if (userRole === "vendor") {
    return <Navigate to="/vendor-dashboard" replace />;
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty-container">
        <div className="cart-empty-content">
          <div className="cart-empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Explore our best deals and fill it up with something amazing!</p>
          <Link to="/" className="btn-browse">
            <ArrowLeft size={18} /> Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Your Shopping Cart</h1>
          <span className="cart-item-count">{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>
        </div>

        <div className="cart-main">
          <div className="cart-items-section">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-img-wrapper">
                  <img src={item.imageUrl} alt={item.title} />
                </div>
                <div className="cart-item-details">
                  <div className="cart-item-header">
                    <h3>{item.title}</h3>
                    <button 
                      onClick={() => removeFromCart(item.id)} 
                      className="btn-remove"
                      title="Remove Item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <p className="cart-item-location">{item.location || 'Online'}</p>
                  
                  <div className="cart-item-footer">
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.id, -1)} className="btn-qty">
                        <Minus size={14} />
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="btn-qty">
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="cart-item-price-col">
                       <span className="price-each">{formatPrice(item.price)} each</span>
                       <span className="price-subtotal">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <Link to="/" className="continue-shopping">
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
          </div>

          <div className="cart-summary-section">
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="summary-row">
                <span>Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free-shipping">FREE</span>
              </div>
              <div className="summary-row">
                <span>Platform Fee</span>
                <span>{formatPrice(20)}</span>
              </div>
              
              <hr className="summary-divider" />
              
              <div className="summary-total">
                <span>Total Amount</span>
                <span>{formatPrice(totalAmount + 20)}</span>
              </div>

              <div className="payment-options-box">
                <h4>Payment Options</h4>
                <p className="payment-notice">
                   <Info size={14} /> This is a demo. Payments are currently disabled.
                </p>
                
                <div className="payment-methods">
                  <div className="payment-method disabled">
                    <Smartphone size={20} />
                    <span>UPI (Google Pay, PhonePe)</span>
                    <div className="disabled-badge">Disabled</div>
                  </div>
                  <div className="payment-method disabled">
                    <CreditCard size={20} />
                    <span>Credit / Debit Card</span>
                    <div className="disabled-badge">Disabled</div>
                  </div>
                  <div className="payment-method disabled">
                    <Wallet size={20} />
                    <span>Net Banking</span>
                    <div className="disabled-badge">Disabled</div>
                  </div>
                </div>

                <button disabled className="btn-checkout">
                  Secure Checkout Unavailable
                </button>
              </div>
            </div>
            
            <div className="safety-badge">
               <span className="safety-icon">🛡️</span>
               <p>Safe and Secure Payments. 100% Authentic products.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
