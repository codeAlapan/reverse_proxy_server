const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());
app.use(cookieParser());


// routes
app.use('/auth', authRoutes);

// root
app.get("/", (req, res) => {
  res.send("Hello from Backend Server A");
});

app.listen(4000, () => {
  console.log("Backend server A running at http://localhost:4000");
});
