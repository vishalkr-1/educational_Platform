const Redis = require("ioredis");

// const redis = new Redis({
//     host: 'redis-11300.c295.ap-southeast-1-1.ec2.redns.redis-cloud.com',  // Redis server hostname (default: 127.0.0.1)
//     port: 11300,         // Redis server port (default: 6379)
//     password: 'k6kPFcG6zxO97NvoaUPtHRtShvVjvdrW' // Uncomment if your Redis instance has a password
// });
const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
  password: "",
});

redis.on("connect", () => {
  console.log("Connected to Redis");
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

module.exports = {
  redis,
};
