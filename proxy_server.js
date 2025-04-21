const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const proxyMiddleware = createProxyMiddleware({
  target: 'http://localhost:5000',
  changeOrigin: true,
});

// All requests to /api will go to backend server
app.use('/api', proxyMiddleware);

app.listen(3000, () => {
  console.log('Reverse proxy running at http://localhost:3000');
});
