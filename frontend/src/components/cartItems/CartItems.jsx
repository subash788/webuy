import React, { useContext } from "react";
import "./cartItems.css";
import { Shopcontext } from "../../context/Shopcontext";
import remove_icon from "../Assets/cart_cross_icon.png";

const CartItems = () => {
  const {
    getTotalCartAmount,
    all_product,
    cartItems,
    removeFromCart,
    displayRazorpay, // Added this from context
  } = useContext(Shopcontext);

  if (!all_product.length) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2 style={{ color: "#6b7280" }}>Your cart is empty</h2>
      </div>
    );
  }

  const totalAmount = getTotalCartAmount();

  return (
    <div className="cartitems">
      {/* Header hidden on mobile via CSS usually */}
      <div className="cartitems-format-main">
        <p>Product</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />

      <div className="cart-list-container">
        {all_product.map((e) => {
          if (cartItems[e.id] > 0) {
            return (
              <div key={e.id}>
                <div className="cartitems-format cartitems-format-main">
                  <img src={e.image} alt="" className="carticon-product-icon" />
                  <p className="product-title">{e.name}</p>
                  <p>₹{e.new_price}</p>
                  <button className="cartitems-quantity">
                    {cartItems[e.id]}
                  </button>
                  <p className="total-price">₹{e.new_price * cartItems[e.id]}</p>
                  <img
                    className="cartitems-remove-icon"
                    src={remove_icon}
                    onClick={() => removeFromCart(e.id)}
                    alt="Remove"
                  />
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="cartitems-down">
        <div className="cartitems-total">
          <h2>Summary</h2>
          <div className="cartitems-total-item">
            <p>Subtotal</p>
            <p>₹{totalAmount}</p>
          </div>
          <hr />
          <div className="cartitems-total-item">
            <p>Shipping Fee</p>
            <p>Free</p>
          </div>
          <hr />
          <div className="cartitems-total-item total-bold">
            <h3>Total</h3>
            <h3>₹{totalAmount}</h3>
          </div>
          
          {/* Razorpay Integration Trigger */}
          <button 
            className="checkout-btn"
            onClick={() => displayRazorpay(totalAmount)}
            disabled={totalAmount <= 0}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '10px'}}>
              <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="2" y1="10" x2="22" y2="10"></line>
            </svg>
            PAY WITH RAZORPAY
          </button>
        </div>
        
      
      </div>
    </div>
  );
};

export default CartItems;