const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimiter = require("../backend_Server/middlewares/rateLimiter");
const app = express();

// Load Balancer targets
const targets = ['http://localhost:4000','http://localhost:4001','http://localhost:4002'];
const serverNumbers = targets.length;

let currentIndex = 0;
const getNextTarget = () => {
  const target = targets[currentIndex];
  currentIndex = (currentIndex+1)% serverNumbers;
  return target;
}


app.use(rateLimiter);

// Proxy middleware with dynamic target
app.use("/api",(req,res,next)=>{
  const target = getNextTarget();
  console.log(`Forwarding request to: ${target}`);
  const proxy = createProxyMiddleware({
    target:target,
    changeOrigin:true,
  });
  proxy(req,res,next);
})




app.listen(3000, () => {
  console.log('Reverse proxy running at http://localhost:3000');
});
