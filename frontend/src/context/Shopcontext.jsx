import React, { createContext, useEffect, useState } from "react";
import cartSocket from "./CartSocket";

export const Shopcontext = createContext(null);

const Shopcontextprovider = ({ children }) => {
  const [all_product, setAllProduct] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [cartRoom, setCartRoom] = useState(
    localStorage.getItem("sharedCartId") || null
  );

  // ================= FETCH PRODUCTS =================
  useEffect(() => {
    fetch("https://webuy-backend-0459.onrender.com/allproducts")
      .then((res) => res.json())
      .then((data) => {
        setAllProduct(data);
      })
      .catch((err) => console.log("Product fetch error:", err));
  }, []);

  // ================= SOCKET JOIN =================
  useEffect(() => {
    if (!cartRoom) return;

    cartSocket.emit("join_cart", cartRoom);

    cartSocket.on("receive_cart", (updatedCart) => {
      setCartItems(updatedCart);
    });

    return () => {
      cartSocket.off("receive_cart");
    };
  }, [cartRoom]);

  // ================= RAZORPAY PAYMENT =================
  const displayRazorpay = async (amount) => {
    if (amount <= 0) {
      alert("Cart is empty!");
      return;
    }

    try {
      // 1. Create order on backend
      const response = await fetch("http://localhost:4000/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const order = await response.json();

      const options = {
       key: "rzp_test_SbUoHre9Xo8EHP", // Replace with your actual Key ID
        amount: order.amount,
        currency: order.currency,
        name: "Your Shop Name",
        description: "Shopping Cart Payment",
        order_id: order.id, 
        handler: async (response) => {
          // 2. Verify payment on backend after user completes the modal
          const verifyRes = await fetch("http://localhost:4000/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyRes.json();
          
          if (verifyData.success) {
            alert("Payment Successful!");
            // Optional: Reset cart after successful payment
            setCartItems({});
            if (cartRoom) {
                cartSocket.emit("update_cart", { cartRoom, cart: {} });
            }
          } else {
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: "User",
          email: "user@example.com",
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error("Razorpay error:", err);
      alert("Could not connect to the payment server.");
    }
  };

  // ================= ADD TO CART =================
  const addToCart = (itemId) => {
    const updatedCart = {
      ...cartItems,
      [itemId]: (cartItems[itemId] || 0) + 1,
    };
    setCartItems(updatedCart);
    if (cartRoom) {
      cartSocket.emit("update_cart", { cartRoom, cart: updatedCart });
    }
  };

  // ================= REMOVE FROM CART =================
  const removeFromCart = (itemId) => {
    const updatedCart = {
      ...cartItems,
      [itemId]: Math.max((cartItems[itemId] || 0) - 1, 0),
    };
    setCartItems(updatedCart);
    if (cartRoom) {
      cartSocket.emit("update_cart", { cartRoom, cart: updatedCart });
    }
  };

  const getTotalCartItem = () => {
    return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  };

  const getTotalCartAmount = () => {
    return Object.keys(cartItems).reduce((total, itemId) => {
      const product = all_product.find((p) => p.id === Number(itemId));
      if (product) {
        total += product.new_price * cartItems[itemId];
      }
      return total;
    }, 0);
  };

  const connectToSharedCart = (roomId) => {
    localStorage.setItem("sharedCartId", roomId);
    setCartRoom(roomId);
  };

  const disconnectFromSharedCart = () => {
    if (cartRoom) {
      cartSocket.emit("leave_room", cartRoom);
      localStorage.removeItem("sharedCartId"); // Added: Clear storage on disconnect
      setCartRoom(null);
    }
  };

  const contextvalue = {
    all_product,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    connectToSharedCart,
    cartRoom,
    getTotalCartItem,
    getTotalCartAmount,
    disconnectFromSharedCart,
    displayRazorpay,
  };

  return (
    <Shopcontext.Provider value={contextvalue}>
      {children}
    </Shopcontext.Provider>
  );
};

export default Shopcontextprovider;
