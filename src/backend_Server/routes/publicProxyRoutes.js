const express = require("express");
const router = express.Router();
const forwardRequest = require("../middlewares/proxyHandler");

// all unmatched routes come here and are proxied
router.use("/", forwardRequest);

module.exports = router;
