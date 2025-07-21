const mongoose = require('mongoose');

const proxyConfigSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },  // Config name, e.g. "My Blog Proxy"
  path: { 
    type: String,
     required: true,
      unique: true 
    },
  targets: { 
    type: [String], 
    required: true 
  },
  algorithm: {
    type: String,
    enum: ['round-robin', 'least-connections','weighted-round-robin'],
    default: 'round-robin',
  },
  // optional only for weighted-round-robin algorithm
  weights: {
    type: Map, //* (key = target URL, value = weight (Number))
    of: Number,
    default: {},
  },
  // optional only for least-connections algorithm
  connections: {
    type: Map, //* (key = target URL, value = current connections (Number))
    of: Number,
    default: {},
  },
   createdAt: { type: Date, default: Date.now },
});

proxyConfigSchema.pre('save', function (next) {
  if (this.algorithm === 'weighted-round-robin') {
    if (!this.weights || Object.keys(this.weights).length === 0) {
      return next(new Error('Weights must be defined for weighted-round-robin'));
    }
    for (let target of this.targets) {
      if (!this.weights.has(target)) {
        return next(new Error(`Missing weight for target: ${target}`));
      }
    }
  }

  if (this.algorithm === 'least-connections') {
    if (!this.connections) {
      this.connections = new Map();
    }
    for (let target of this.targets) {
      if (!this.connections.has(target)) {
        this.connections.set(target, 0);
      }
    }
  }

  next();
});


module.exports = mongoose.model('ProxyConfig', proxyConfigSchema);
