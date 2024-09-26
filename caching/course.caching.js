const express = require("express");

const jwt = require("jsonwebtoken");
const { redis } = require("../client");

const courseCacheMiddleware = (req, res, next) => {
  const cacheKey = "all_courses";
  redis.get(cacheKey, (err, data) => {
    if (err) {
      console.error("Redis error:", err);
      return next();
    }
    // console.log("inside courseCacheMiddleware");
    // console.log(data);

    if (data !== null) {
      console.log("Cache hit");
      return res.send(JSON.parse(data));
    } else {
      console.log("Cache miss");
      next();
    }
  });
};

// cache self course
const courseSelfCache = (req, res, next) => {
  const cacheSelf = "self_course";
  const token = req.cookies.uid;
  if (!token) {
    return res.status(401).send({ msg: "Unauthorized, token not provided" });
  }
  const decoded = jwt.verify(token, "vishal$123$");

  try {
    if (decoded) {
      redis.get(cacheSelf, (err, data) => {
        if (err) throw err;

        if (data !== null) {
          console.log("Cache hit for self");
          return res.send(JSON.parse(data));
        } else {
          console.log("Cache miss");
          next();
        }
      });
    } else {
      return res.status(400).send({ msg: "not verified user" });
    }
  } catch (err) {
    return res.status(400).send({ msg: err.message });
  }
};
module.exports = {
  courseCacheMiddleware,
  courseSelfCache,
};
