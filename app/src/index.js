const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./db');
const routes = require('./routes');
const routes_default = require('./routes-def');
const client = require('prom-client');


// Создаем реестр метрик
const register = new client.Registry();

// Создаем счетчики, гистограммы и другие метрики
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.5, 1, 2, 5] // Настраиваем интервалы для квантилей
});

const requestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'code'],
});

const errorRateCounter = new client.Counter({
  name: 'http_errors_total',
  help: 'Total number of 500 errors',
  labelNames: ['method', 'route', 'code'],
});

// Регистрируем метрики в реестре
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(requestCounter);
register.registerMetric(errorRateCounter);

// Регистрируем стандартные метрики процесса
client.collectDefaultMetrics({ register });

// Middleware для сбора метрик
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    requestCounter.labels(req.method, req.route ? req.route.path : '', res.statusCode).inc();
    if (res.statusCode >= 500) {
      errorRateCounter.labels(req.method, req.route ? req.route.path : '', res.statusCode).inc();
    }
    end({ method: req.method, route: req.route ? req.route.path : '', code: res.statusCode });
  });
  next();
});

app.use(express.json());
app.use('/users', routes);
app.use('/', routes_default);

// Маршрут для метрик Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
