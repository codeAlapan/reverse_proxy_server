// indexB.js
const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/login', (req, res) => {
  res.send('Login route hit from Server B');
});

app.listen(4001, () => {
  console.log('Server B running on port 4001');
});
