const getRetryStrategy = require("./services/getRetryStrategy");

const category = "INSUFFICIENT_FUNDS";

const strategy = getRetryStrategy(category);

console.log("Category:", category);
console.log("Should Retry:", strategy.shouldRetry);
console.log("Delay Minutes:", strategy.delayMinutes);