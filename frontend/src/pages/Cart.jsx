import React, { useContext } from "react";
import { Shopcontext } from "../context/Shopcontext";
import CartItems from "../components/cartItems/CartItems";

const Cart = () => {
  // Assuming your context provides a leave function; if not, you can 
  // clear the state directly or call a socket emit.
  const { connectToSharedCart, disconnectFromSharedCart, cartRoom } = useContext(Shopcontext);

  const handleConnect = () => {
    const roomId = prompt("Enter Shared Cart ID:");
    if (!roomId) return;
    connectToSharedCart(roomId);
  };

  const handleDisconnect = () => {
    if (window.confirm("Are you sure you want to leave the shared shopping session?")) {
      disconnectFromSharedCart();
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        {/* Header Section */}
        <div style={styles.header}>
          <h1 style={styles.title}>Your Shopping Cart</h1>
          
          <div style={styles.actionArea}>
            {!cartRoom ? (
              <button onClick={handleConnect} style={styles.connectBtn}>
                <span style={{ fontSize: "18px" }}>🤝</span> 
                Connect Friend's Cart
              </button>
            ) : (
              <div style={styles.sessionWrapper}>
                <div style={styles.activeBadge}>
                  <div style={styles.pulseDot}></div>
                  <span style={styles.badgeText}>
                    Live Session: <b>{cartRoom}</b>
                  </span>
                </div>
                <button 
                  onClick={handleDisconnect} 
                  style={styles.disconnectBtn}
                  title="Leave Session"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Leave
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={styles.cartContent}>
          <CartItems />
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
    padding: "40px 20px",
    fontFamily: "'Inter', sans-serif",
  },
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "20px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#111827",
    margin: 0,
  },
  sessionWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  connectBtn: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 20px",
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    color: "#374151",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    transition: "all 0.2s ease",
  },
  activeBadge: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 16px",
    backgroundColor: "#e0e7ff",
    borderRadius: "10px 0 0 10px", // Rounded on left
    border: "1px solid #c7d2fe",
    borderRight: "none",
  },
  disconnectBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "10px 16px",
    backgroundColor: "#fee2e2", // Light red
    color: "#b91c1c",
    border: "1px solid #fecaca",
    borderRadius: "0 10px 10px 0", // Rounded on right
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  badgeText: {
    color: "#4338ca",
    fontSize: "13px",
  },
  pulseDot: {
    width: "8px",
    height: "8px",
    backgroundColor: "#4f46e5",
    borderRadius: "50%",
  },
  cartContent: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    padding: "24px",
  }
};

export default Cart;