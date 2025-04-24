const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const rateLimiter = require('./middlewares/rateLimiter');

const app = express();

app.use(express.json());
app.use(cookieParser());

// ✅ Rate limiter ko global middleware bana rahe hain
app.use(rateLimiter);

// routes
app.use('/auth', authRoutes);

// root
app.get("/", (req, res) => {
  res.send("Hello from Backend Server with Rate Limiting!");
});

app.listen(5000, () => {
  console.log("Backend server running at http://localhost:5000");
});
