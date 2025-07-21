const express = require('express');
const cookieParser = require('cookie-parser');


const app = express();

app.use(express.json());
app.use(cookieParser());




app.get('/health', (req, res) => {
  res.status(200).send('OK');
});


// root
app.get("/", (req, res) => {
  res.send("Hello from Backend Server D");
});

app.listen(4003, () => {
  console.log("Backend server D running at http://localhost:4003");
});
