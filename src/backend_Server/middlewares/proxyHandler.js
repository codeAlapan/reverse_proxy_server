const ProxyConfig = require("../models/ProxyConfig.js");
const loadBalancer = require("../utils/loadBalancer");
const { createProxyMiddleware } = require("http-proxy-middleware");

const forwardRequest = async (req, res, next) => {
  try {
    const requestPath = req.path;

    // Step 1: Fetch proxy config by exact path match
    const config = await ProxyConfig.findOne({ path: requestPath });

    if (!config) {
      return res.status(404).json({ message: "No proxy config found for this route" });
    }

    // Step 2: Select target via load balancer
    const target = loadBalancer.getTarget(config);

    if (!target) {
      return res.status(500).json({ message: "No target available for load balancing" });
    }

    // Step 3: Create and apply proxy middleware dynamically
    const proxy = createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: {
        [`^${config.path}`]: "", // optional: remove /api/products etc.
      },
    });

    proxy(req, res, next);
  } catch (err) {
    next(err);
  }
};

module.exports = forwardRequest;
