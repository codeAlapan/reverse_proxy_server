// indexC.js
const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/login', (req, res) => {
  res.send('Login route hit from Server C');
});

app.listen(4002, () => {
  console.log('Server C running on port 4002');
});
