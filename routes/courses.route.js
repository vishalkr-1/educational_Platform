const express = require("express");
const { body } = require("express-validator");
const { restrictToLoggedInUserOnly } = require("../middleware/auth");
const {
  handleCourse,
  handleAllCourses,
  handleSelfCourses,
  handleUpdateSelfCourses,
  handleDeleteSelfCourses,
} = require("../controllers/course.controller");
const courseRouter = express.Router();

courseRouter.post(
  "/add",
  [
    body("courseName").notEmpty(),
    body("title").notEmpty(),
    body("description").notEmpty(),
  ],
  restrictToLoggedInUserOnly,
  handleCourse
);

const {
  courseCacheMiddleware,
  courseSelfCache,
} = require("../caching/course.caching");
courseRouter.get(
  "/",
  restrictToLoggedInUserOnly,
  courseCacheMiddleware,
  handleAllCourses
);

courseRouter.get(
  "/selfCourses",
  restrictToLoggedInUserOnly,
  courseSelfCache,
  handleSelfCourses
);

courseRouter.patch(
  "/selfCourses/update/:courseID",
  restrictToLoggedInUserOnly,
  handleUpdateSelfCourses
);
courseRouter.delete(
  "/delete/:courseID",
  restrictToLoggedInUserOnly,
  handleDeleteSelfCourses
);
module.exports = {
  courseRouter,
};
