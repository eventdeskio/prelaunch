const client = require("prom-client");

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Histogram of HTTP request durations in seconds",
  labelNames: ["method", "route", "status"],
});

const apiCallCounter = new client.Counter({
  name: "api_calls_total",
  help: "Total number of API calls",
  labelNames: ["route", "status"],
});

const userSignupCounter = new client.Counter({
  name: "user_signups_total",
  help: "Total number of user signups",
});

const reqrestime = new client.Histogram({
  name: 'eventdesk_request_response_time',
  help:"Tells backend api's request and response time",
  labelNames: ["method", "route", "status_code"],
  buckets:[1,50,100,200,500,800,1000,2000]
})

const totalReqCounter = new client.Counter({
  name:'total_req',
  help:'Total number of requests',

})

const monitoringMiddleware = (req, res, next) => {
  const end = httpRequestDuration.startTimer({
    method: req.method,
    route: req.route ? req.route.path : req.path,
  });

  res.on("finish", () => {
    end({ status: res.statusCode });
    apiCallCounter.labels(req.path, res.statusCode >= 400 ? "failed" : "success").inc();
  });

  next();
};

module.exports = {
  monitoringMiddleware,
  userSignupCounter,
  reqrestime,
  totalReqCounter,
  getMetrics: async () => {
    return await client.register.metrics();
  },
  contentType: client.register.contentType,
};