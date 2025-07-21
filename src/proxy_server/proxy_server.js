const express = require('express');
const dotenv = require('dotenv');

const rateLimiter = require('../backend_Server/middlewares/rateLimiter');
const connectDB = require('../backend_Server/config/db');

const authRoutes = require('../backend_Server/routes/authRoutes.js');
const protectedRoutes = require('../backend_Server/routes/protectedRoutes.js');
const proxyConfigRoutes = require("../backend_Server/routes/proxyConfigRoutes.js");
const publicProxyRoutes = require("../backend_Server/routes/publicProxyRoutes.js");

const { initAllHealthChecks } = require('../backend_Server/utils/healthChecker.js');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// ✅ Auth & protected routes
app.use('/auth', authRoutes);
app.use('/user', protectedRoutes);

// ✅ Rate limiter
app.use(rateLimiter);

//  Admin route for managing proxy configs
app.use("/api/proxy-config", proxyConfigRoutes);

//  Public proxy (with load balancer inside)
app.use("/", publicProxyRoutes);

//  Root health route
app.get("/", (req, res) => {
  try {
    res.json({ message: "Hi Proxy server running at port 3000" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  Initial health checks for all targets from DB
initAllHealthChecks(); 

//  Start server
app.listen(3000, () => {
  console.log('⚡ Reverse proxy running at http://localhost:3000');
});
