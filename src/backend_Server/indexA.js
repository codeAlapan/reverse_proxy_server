const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookieParser());


// routes
const authRoutes = require('./routes/authRoutes');




app.use('/auth', authRoutes);

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});


// root
app.get("/", (req, res) => {
  res.send("Hello from Backend Server A");
});

app.listen(4000, () => {
  console.log("Backend server A running at http://localhost:4000");
});
