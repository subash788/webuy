const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const Razorpay = require("razorpay"); // 1. Import Razorpay
const crypto = require("crypto");     // 2. Built-in for signature verification

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

// ---------------- Razorpay Instance ----------------
// Replace these with your actual keys from Razorpay Dashboard
const razorpay = new Razorpay({
  key_id: "rzp_test_SbUoHre9Xo8EHP",
  key_secret: "HzhfrmLZuiB32sltnN9H6mc9",
});

// ---------------- Database ----------------
mongoose.connect("mongodb+srv://suriyamannai27_db_user:BqEGK0IXJhpynoaq@cluster0.lzaxm9j.mongodb.net/e-commerce")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

// ... (Existing Image Upload, Product Schema, Auth Middleware, Signup/Login)

// ---------------- Razorpay APIs ----------------

// Create Order (Called from Frontend)
app.post("/order", async (req, res) => {
  try {
    const { amount } = req.body; // Amount should be in INR

    const options = {
      amount: amount * 100, // Convert INR to Paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order) return res.status(500).send("Error creating order");

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error in Razorpay");
  }
});

// Verify Payment Signature (Security Step)
app.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", "HzhfrmLZuiB32sltnN9H6mc9") // Use your secret here
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.json({ success: true, message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Verification failed" });
  }
});

// ... (Existing Cart APIs and Socket.io setup)

const server = http.createServer(app);
// ... (Socket configuration)


// ---------------- Image Upload ----------------
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage });

app.use("/images", express.static("upload/images"));

app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

// ---------------- Product Schema ----------------
const Product = mongoose.model("Product", {
  id: Number,
  name: String,
  image: String,
  category: String,
  new_price: Number,
  old_price: Number,
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

// Add Product
app.post("/addproduct", async (req, res) => {
  try {
    const lastProduct = await Product.findOne().sort({ id: -1 });
    const id = lastProduct ? lastProduct.id + 1 : 1;

    const product = new Product({ id, ...req.body });
    await product.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to add product" });
  }
});

// Get All Products
app.get("/allproducts", async (req, res) => {
  try {
    const products = await Product.find({});
    console.log("Products fetched successfully");
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Remove Product
app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  res.json({ success: true });
});

// ---------------- User Schema ----------------
const Users = mongoose.model("Users", {
  name: String,
  email: { type: String, unique: true },
  password: String,
  cartData: { type: Object, default: {} }, // ✅ Prevents crash
  date: { type: Date, default: Date.now },
});

// ---------------- Auth Middleware ----------------
const fetchUser = (req, res, next) => {
  try {
    const token = req.header("auth-token");
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user;
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
};

// ---------------- SIGNUP ----------------
app.post("/signup", async (req, res) => {
  try {
    const check = await Users.findOne({ email: req.body.email });

    if (check) {
      return res.json({ success: false, errors: "User already exists" });
    }

    const user = new Users({
      name: req.body.username,   // frontend sends username
      email: req.body.email,
      password: req.body.password,
    });

    await user.save();

    const data = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(data, "secret_ecom");

    res.json({ success: true, token });

  } catch (err) {
    res.status(500).json({ success: false, errors: "Server Error" });
  }
});


// ---------------- LOGIN ----------------
app.post("/login", async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.body.email });

    if (!user) {
      return res.json({ success: false, errors: "Wrong Email Id" });
    }

    if (user.password === req.body.password) {

      const data = {
        user: {
          id: user.id,
        },
      };

      const token = jwt.sign(data, "secret_ecom");

      res.json({ success: true, token });

    } else {
      res.json({ success: false, errors: "Wrong Password" });
    }

  } catch (err) {
    res.status(500).json({ success: false, errors: "Server Error" });
  }
});


// ---------------- Cart APIs ----------------

// Add To Cart
app.post("/addtocart", fetchUser, async (req, res) => {
  const user = await Users.findById(req.user.id);

  if (!user.cartData[req.body.itemId]) {
    user.cartData[req.body.itemId] = 0;
  }

  user.cartData[req.body.itemId] += 1;

  await user.save();
  res.json({ success: true });
});

// Remove From Cart
app.post("/removefromcart", fetchUser, async (req, res) => {
  const user = await Users.findById(req.user.id);

  if (user.cartData[req.body.itemId] > 0) {
    user.cartData[req.body.itemId] -= 1;
  }

  await user.save();
  res.json({ success: true });
});

// Get Cart
app.post("/getcart", fetchUser, async (req, res) => {
  const user = await Users.findById(req.user.id);
  res.json(user.cartData);
});
// ================= SOCKET.IO =================



const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// 🔥 CHAT + CART BOTH HANDLED HERE
let carts = {}; // store cart per room

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ================= CHAT =================
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log("Joined chat room:", room);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  // ================= SHARED CART =================
  socket.on("join_cart", (cartRoom) => {
    socket.join(cartRoom);
    console.log("Joined cart:", cartRoom);

    // send existing cart if available
    if (carts[cartRoom]) {
      socket.emit("receive_cart", carts[cartRoom]);
    }
  });

  socket.on("update_cart", ({ cartRoom, cart }) => {
    carts[cartRoom] = cart;

    // send to ALL users in room
    io.to(cartRoom).emit("receive_cart", cart);
  });

  // ================= DISCONNECT =================
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ---------------- START SERVER ----------------
server.listen(port, () => {
  console.log("Server running on port " + port);
});