const { getHealthyTargets } = require('./healthChecker');
let rrIndex = {}; // round-robin index

const getTarget = (config) => {
  const { algorithm, path, weights, connections } = config;

  // Get only healthy targets
  const targets = getHealthyTargets(path);
  if (!targets || targets.length === 0) return null;

  switch (algorithm) {
    case 'round-robin':
      if (!rrIndex[path]) rrIndex[path] = 0;
      const index = rrIndex[path] % targets.length;
      rrIndex[path]++;
      return targets[index];

    case 'least-connections':
      let minConn = Infinity;
      let selectedLC = targets[0];
      targets.forEach((target) => {
        const conn = connections?.get(target) || 0;
        if (conn < minConn) {
          minConn = conn;
          selectedLC = target;
        }
      });
      return selectedLC;

    case 'weighted-round-robin':
      const expandedList = [];
      targets.forEach((target) => {
        const weight = weights?.get(target) || 1;
        for (let i = 0; i < weight; i++) {
          expandedList.push(target);
        }
      });
      if (!rrIndex[path]) rrIndex[path] = 0;
      const wrrIndex = rrIndex[path] % expandedList.length;
      rrIndex[path]++;
      return expandedList[wrrIndex];

    default:
      return targets[0];
  }
};

module.exports = { getTarget };
