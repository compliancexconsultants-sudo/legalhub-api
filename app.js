require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/db");

const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const caseRoutes = require("./routes/cases");
const caRoutes = require("./routes/ca");
const users = require("./routes/users");
const dashboard = require("./routes/dashboard");
const servicesRoutes = require("./routes/services");  
const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/ca", caRoutes);
app.use("/api/user", users);
app.use("/api/dashboard", dashboard);

app.use("/api/services", servicesRoutes);  // <-- MOUNT SERVICE & TAG ROUTES

// Health check
app.get("/", (req, res) => {
  res.send("LegalHub Backend Running");
});

// Start Server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
