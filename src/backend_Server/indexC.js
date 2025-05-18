const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());
app.use(cookieParser());


// routes
app.use('/auth', authRoutes);

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});


// root
app.get("/", (req, res) => {
  res.send("Hello from Backend Server C");
});

app.listen(4002, () => {
  console.log("Backend server C running at http://localhost:4002");
});
