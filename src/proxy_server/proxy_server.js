const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const axios = require('axios');
const dotenv = require("dotenv");


const rateLimiter = require('../backend_Server/middlewares/rateLimiter');
const connectDB = require('../backend_Server/config/db');


dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Load Balancer targets
const targets = [
  'http://localhost:4000',
  'http://localhost:4001',
  'http://localhost:4002',
];
let healthyTargets = [...targets];

let currentIndex = 0;

// Healthcheck function
const checkHealth = async () => {
  const results = await Promise.allSettled(
    targets.map(async (target) => {
      try {
        const res = await axios.get(`${target}/health`);
        return res.status === 200 ? target : null;
      } catch {
        return null;
      }
    })
  );
  // console.log(results);
  healthyTargets = results.map((m)=>{
    return m.value;
  }).filter((r)=>{
    return r != null;
  })
  // console.log(healthyTargets);
};

// Initial call for checking server's health as setinterval first calls after 10 seconds
checkHealth();
// Check health every 10 seconds
setInterval(checkHealth, 10000);

//  Round Robin on healthy targets
const getNextTarget = () => {
  // if no server is available or healthy
  if (healthyTargets.length == 0) {
    return null;
  }
  // setting up the current target server
  const target = healthyTargets[currentIndex];
  // handling the case of currentIndex going outside array
  currentIndex = (currentIndex + 1) % healthyTargets.length;
  return target;
};

// routes
const authRoutes = require("../backend_Server/routes/authRoutes.js");

app.use("/auth",authRoutes);

// Global middleware (rate-limiter)
app.use(rateLimiter);

// Proxy middleware with dynamic target
app.use('/api', (req, res, next) => {
  const target = getNextTarget();
  if (!target) {
    return res
      .status(503)
      .send('Service Unavailable: No healthy backend servers');
  }
  console.log(`Forwarding request to: ${target}`);
  const proxy = createProxyMiddleware({
    target: target,
    changeOrigin: true,
  });
  proxy(req, res, next);
});

app.listen(3000, () => {
  console.log('Reverse proxy running at http://localhost:3000');
});
