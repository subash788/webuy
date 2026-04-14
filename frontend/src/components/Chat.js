import { useEffect, useState, useRef } from "react";

const Chat = ({ socket, username, room, allProducts, addToCart }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showProducts, setShowProducts] = useState(false);
  const scrollRef = useRef();

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send text
  const sendMessage = () => {
    if (message.trim() !== "") {
      const msg = {
        room,
        author: username,
        message,
        type: "text",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      socket.emit("send_message", msg);
      setMessages((prev) => [...prev, msg]);
      setMessage("");
    }
  };

  // Send product
  const sendProduct = (product) => {
    const msg = {
      room,
      author: username,
      type: "product",
      product,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    socket.emit("send_message", msg);
    setMessages((prev) => [...prev, msg]);
    setShowProducts(false);
  };

  // Receive messages
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, [socket]);

  return (
    <div style={styles.wrapper}>
      
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.avatar}></div>
        <div>
          <h3 style={{ margin: 0 }}>{room}</h3>
          <small style={{ color: "#10b981" }}>Online</small>
        </div>
      </div>

      {/* CHAT BODY */}
      <div style={styles.chatBody}>
        {messages.map((msg, i) => {
          const isMe = msg.author === username;

          return (
            <div
              key={i}
              style={{
                ...styles.messageRow,
                justifyContent: isMe ? "flex-end" : "flex-start",
              }}
            >
              {/* TEXT */}
              {msg.type === "text" && (
                <div style={styles.bubble(isMe)}>
                  {!isMe && <b>{msg.author}</b>}
                  <p style={{ margin: "5px 0" }}>{msg.message}</p>
                  <span style={styles.time}>{msg.time}</span>
                </div>
              )}

              {/* PRODUCT */}
              {msg.type === "product" && (
                <div style={styles.productCard}>
                  <img src={msg.product.image} alt="" style={styles.productImg} />
                  <h4>{msg.product.name}</h4>
                  <p style={{ color: "#10b981", fontWeight: "bold" }}>
                    ₹{msg.product.new_price}
                  </p>

                  <div style={styles.productBtns}>
                    <button
                      style={styles.cartBtn}
                      onClick={() => addToCart(msg.product.id)}
                    >
                      Add to Cart
                    </button>
                    <button style={styles.buyBtn}>
                      Buy Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div ref={scrollRef}></div>
      </div>

      {/* PRODUCT SELECTOR */}
      {showProducts && (
        <div style={styles.productPanel}>
          <h3>Select Product</h3>
          <div style={styles.productGrid}>
            {allProducts.map((p) => (
              <div
                key={p.id}
                style={styles.productItem}
                onClick={() => sendProduct(p)}
              >
                <img src={p.image} alt="" style={styles.productThumb} />
                <p>{p.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div style={styles.footer}>
        <button style={styles.iconBtn} onClick={() => setShowProducts(!showProducts)}>
          🛍️
        </button>

        <input
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button style={styles.sendBtn} onClick={sendMessage}>
          ➤
        </button>
      </div>
    </div>
  );
};

export default Chat;

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    background: "#f9fafb",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "15px",
    background: "#4f46e5",
    color: "white",
  },

  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#6366f1",
  },

  chatBody: {
    flex: 1,
    padding: "15px",
    overflowY: "auto",
  },

  messageRow: {
    display: "flex",
    marginBottom: "10px",
  },

  bubble: (me) => ({
    background: me ? "#4f46e5" : "#e5e7eb",
    color: me ? "white" : "black",
    padding: "10px 14px",
    borderRadius: "16px",
    maxWidth: "60%",
  }),

  time: {
    fontSize: "10px",
    opacity: 0.7,
  },

  footer: {
    display: "flex",
    gap: "10px",
    padding: "10px",
    background: "white",
    borderTop: "1px solid #ddd",
  },

  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "20px",
    border: "1px solid #ccc",
  },

  sendBtn: {
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    cursor: "pointer",
  },

  iconBtn: {
    border: "none",
    background: "#e5e7eb",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    cursor: "pointer",
  },

  productPanel: {
    background: "white",
    padding: "10px",
    borderTop: "1px solid #ddd",
  },

  productGrid: {
    display: "flex",
    gap: "10px",
    overflowX: "auto",
  },

  productItem: {
    textAlign: "center",
    cursor: "pointer",
  },

  productThumb: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "8px",
  },

  productCard: {
    background: "white",
    borderRadius: "12px",
    padding: "10px",
    width: "180px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },

  productImg: {
    width: "100%",
    borderRadius: "10px",
  },

  productBtns: {
    display: "flex",
    gap: "5px",
  },

  cartBtn: {
    flex: 1,
    background: "#10b981",
    color: "white",
    border: "none",
    padding: "5px",
    borderRadius: "5px",
  },

  buyBtn: {
    flex: 1,
    background: "#f59e0b",
    color: "white",
    border: "none",
    padding: "5px",
    borderRadius: "5px",
  },
};