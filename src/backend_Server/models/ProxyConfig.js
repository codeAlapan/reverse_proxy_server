const mongoose = require('mongoose');

const ProxyConfigSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },  // Config name, e.g. "My Blog Proxy"
  routes: [
    {
      path: { type: String, required: true }, // e.g. '/api'
      targets: [{ type: String, required: true }], // Array of target backend URLs
      healthCheckPath: { type: String, default: '/health' }, // Optional health check path
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ProxyConfig",ProxyConfigSchema);
