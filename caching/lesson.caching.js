const jwt = require("jsonwebtoken");

const { redis } = require("../client");
const allLessonCache = (req, res, next) => {
  const cacheAllLesson_key = "all_lesson";
  redis.get(cacheAllLesson_key, (err, data) => {
    console.log(data);
    if (err) {
    console.error("Redis error:", err);
        return next();
    }
    if (data !== null) {
      console.log("cache hit");
      return res.send(JSON.parse(data));
    } else {
      console.log("cache miss");
      next();
    }
  });
};

// self course lesson
const selfLessonCache = (req, res, next) => {
  const cacheSelf = "self_lesson";
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
          console.log(data);
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
  allLessonCache,
  selfLessonCache,
};
