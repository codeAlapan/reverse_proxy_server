const express = require('express');
const ProxyConfig = require('../models/ProxyConfig.js');
const router = express.Router();
const authMIddleware = require('../middlewares/authMiddleware.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

// Get all proxy configs of logged-in user
router.get('/',authMIddleware, async (req, res) => {
  try {
    const configs = await ProxyConfig.find({ userId: req.loggedInUser.id });
    res.json(configs);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching configs',error:err.message });
  }
});

// create new proxy config
router.post('/', authMIddleware, async (req, res) => {
  try {
    const { name, routes } = req.body;
    if (!name || !routes || !Array.isArray(routes) || routes.length === 0) {
      return res.status(400).json({ message: 'Invalid config data' });
    }
    const newConfig = new ProxyConfig({
      userId: req.loggedInUser.id,
      name,
      routes,
    });
    await newConfig.save();
    res.status(201).json(newConfig);
  } catch (err) {
    res.status(500).json({ message: 'Server error creating config' });
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
    const { name, routes } = req.body;
    if (name) {
      config.name = name;
    }
    if (routes && Array.isArray(routes)) {
      config.routes = routes;
    }
    await config.save();
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: 'Server error updating config' });
  }
});

// Delete a proxy config by ID
router.delete("/:id",authMiddleware,async(req,res)=>{
  try{
    const config = await ProxyConfig.findOneAndDelete({
      _id: req.params.id,
      userId: req.loggedInUser.id,
    });
    if(!config){
      return res.status(404).json({ message: 'Config not found' });
    }
    res.json({ message: 'Config deleted successfully' });
  }catch(err){
    res.status(500).json({ message: 'Server error deleting config' ,error:err.message});
  }
})

module.exports = router;