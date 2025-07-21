const axios = require('axios');
const ProxyConfig = require('../../backend_Server/models/ProxyConfig.js');

const healthyTargetsMap = new Map();

const checkHealthForTargets = async (targets) => {
  const results = await Promise.allSettled(
    targets.map(async (target) => {
      try {
        const res = await axios.get(`${target}/health`);
        return res.status === 200 ? target : null;
      } catch {
        return null;
      }
    })
  );
  return results.map(r => r.value).filter(t => t !== null);
};

const initAllHealthChecks = async () => {
  const configs = await ProxyConfig.find();
  configs.forEach((config) => {
    const updateHealth = async () => {
      const healthy = await checkHealthForTargets(config.targets);
      healthyTargetsMap.set(config.path, healthy);
      console.log(`[✓] Updated health for ${config.path}:`, healthy);
    };
    updateHealth(); // initial
    setInterval(updateHealth, 10000); // every 10s
  });
};

const getHealthyTargets = (path) => {
  return healthyTargetsMap.get(path) || [];
};

module.exports = {
  initAllHealthChecks,
  getHealthyTargets,
};
