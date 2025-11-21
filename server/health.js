// Express health and readiness endpoints. Mount in your app: app.use('/_health', healthRouter);
const express = require('express');
const axios = require('axios'); // optional if you want to test deps
const router = express.Router();
const logger = require('./logger');

router.get('/live', (req, res) => {
  // Liveness: is the process alive?
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

router.get('/ready', async (req, res) => {
  // Readiness: is the app able to serve traffic? e.g., DB connection healthy
  try {
    // Replace with actual DB ping check; example mongoose ping:
    if (global.__MONGOOSE_CONNECTED) {
      return res.status(200).json({ status: 'ready' });
    }
    throw new Error('db-not-connected');
  } catch (err) {
    logger.warn('Readiness check failed: %s', err.message);
    return res.status(503).json({ status: 'not_ready', reason: err.message });
  }
});

module.exports = router;