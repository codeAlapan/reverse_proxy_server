// backend_server/index.js
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);


//* Default route which handles all requests
app.get("/", (req, res) => {
    res.send('Hello from Backend Server!');
});

app.listen(5000, () => {
    console.log("Backend server running on http://localhost:5000");
});
