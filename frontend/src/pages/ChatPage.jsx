import { useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import Chat from "../components/Chat";
import { Shopcontext } from "../context/Shopcontext";

const ChatPage = () => {
  const { all_product, addToCart } = useContext(Shopcontext);

  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);

  // Connect socket once
  useEffect(() => {
    const s = io("http://localhost:4000");
    setSocket(s);

    return () => s.disconnect();
  }, []);

  const joinRoom = () => {
    if (!socket) return;

    if (username.trim() && room.trim()) {
      socket.emit("join_room", room);
      setJoined(true);
    }
  };

  return (
    <div style={styles.container}>
      {!joined ? (
        <div style={styles.card}>
          <h2 style={styles.title}>💬 Live Chat</h2>
          <p style={styles.subtitle}>Chat & Shop with Friends</p>

          <input
            style={styles.input}
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            style={styles.input}
            type="text"
            placeholder="Enter Room ID (e.g. product_101)"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />

          <button style={styles.button} onClick={joinRoom}>
            Join Chat
          </button>
        </div>
      ) : (
        <div style={styles.chatContainer}>
          {socket && (
            <Chat
              socket={socket}
              username={username}
              room={room}
              allProducts={all_product}
              addToCart={addToCart}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ChatPage;

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #4f46e5, #9333ea)",
    fontFamily: "system-ui",
  },

  card: {
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(10px)",
    padding: "40px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "380px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    textAlign: "center",
  },

  title: {
    marginBottom: "5px",
    fontSize: "26px",
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    marginBottom: "20px",
    fontSize: "14px",
    color: "#6b7280",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.2s",
  },

  chatContainer: {
    width: "100%",
    maxWidth: "900px",
    height: "85vh",
    background: "#fff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
  },
};