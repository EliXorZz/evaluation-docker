const os = require('os')

const express = require('express');
const client = require('prom-client');
const app = express();

const pet = process.env.PET || 'unknown'

const register = new client.Registry();
client.collectDefaultMetrics({ register });

let counter = 0
const requestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
});

register.registerMetric(requestCounter);

// Middleware de logging simple
app.use((req, res, next) => {
  requestCounter.inc();

  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - pet: ${pet}`);
  next();
});

app.get('/', (req, res) => {
  counter++

  res.json({
    message: `Bienvenue sur l'API (${pet})`,
    hostname: os.hostname(),
    counter: counter,
    pet,
  });
});

app.get('/healthz', (req, res) => {
  res.json({ status: 'ok' });
});

// Endpoint Prometheus
app.get('/metrics', (req, res) => {
  res.set('Content-Type', register.contentType);
  register.metrics().then(metrics => res.end(metrics));
});

module.exports = app;
