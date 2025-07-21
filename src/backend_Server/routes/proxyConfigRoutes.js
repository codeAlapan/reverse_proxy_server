const express = require('express');
const ProxyConfig = require('../models/ProxyConfig.js');
const router = express.Router();
const authMIddleware = require('../middlewares/authMiddleware.js');

// Get all proxy configs of logged-in user
router.get('/', authMIddleware, async (req, res) => {
  try {
    const configs = await ProxyConfig.find({ userId: req.loggedInUser.id });
    res.json(configs);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Server error fetching configs', error: err.message });
  }
});

// create new proxy config
router.post('/', authMIddleware, async (req, res) => {
  try {
    const { name, path, targets, algorithm, weights } = req.body;

    if (
      !name ||
      !path ||
      !targets ||
      !Array.isArray(targets) ||
      targets.length === 0
    ) {
      return res.status(400).json({ message: 'Invalid config data' });
    }

    const newConfig = new ProxyConfig({
      userId: req.loggedInUser.id,
      name,
      path,
      targets,
      algorithm: algorithm || 'round-robin',
      weights,
    });

    await newConfig.save();
    res.status(201).json(newConfig);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Server error creating config', error: err.message });
  }
});

// Update a proxy config by ID
router.patch('/:id', authMIddleware, async (req, res) => {
  try {
    const config = await ProxyConfig.findOne({
      _id: req.params.id,
      userId: req.loggedInUser.id,
    });

    if (!config) {
      return res.status(404).json({ message: 'Config not found' });
    }

    const { name, path, targets, algorithm, weights, connections } = req.body;

    if (name) config.name = name;
    if (path) config.path = path;
    if (targets && Array.isArray(targets)) config.targets = targets;
    if (algorithm) config.algorithm = algorithm;

    // Only if algorithm is weighted-round-robin
    if (algorithm === 'weighted-round-robin') {
      if (!weights || typeof weights !== 'object') {
        return res.status(400).json({ message: 'Weights must be provided for weighted-round-robin' });
      }
      // Ensure all targets have weights
      for (const target of targets) {
        if (!weights.hasOwnProperty(target)) {
          return res.status(400).json({ message: `Missing weight for target: ${target}` });
        }
      }
      config.weights = weights;
    }

    // Only if algorithm is least-connections
    if (algorithm === 'least-connections') {
      config.connections = config.connections || {};
      for (const target of targets) {
        if (!config.connections[target]) {
          config.connections[target] = 0;
        }
      }
    }

    await config.save();
    res.json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating config', error: err.message });
  }
});


// Delete a proxy config by ID
router.delete('/:id', authMIddleware, async (req, res) => {
  try {
    const config = await ProxyConfig.findOneAndDelete({
      _id: req.params.id,
      userId: req.loggedInUser.id,
    });
    if (!config) {
      return res.status(404).json({ message: 'Config not found' });
    }
    res.json({ message: 'Config deleted successfully' });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Server error deleting config', error: err.message });
  }
});

module.exports = router;
