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
  res.send("Hello from Backend Server B");
});

app.listen(4001, () => {
  console.log("Backend server B running at http://localhost:4001");
});
