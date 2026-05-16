require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const inventoryRoutes = require("./routes/inventory");
const supportRoutes = require("./routes/support");
const path = require("path");
 
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// MongoDB Connection
console.log(process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));
 
// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/support', require('./routes/support'));
app.use('/api/activity', require('./routes/activity'));

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// Port
const PORT = process.env.PORT || 5002;

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});