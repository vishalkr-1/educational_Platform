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

// *************************************************************************************

// create course

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

// *************************************************************************************************
// get all course

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

// ******************************************************************************************************
// get own course

courseRouter.get(
  "/selfCourses",
  restrictToLoggedInUserOnly,
  courseSelfCache,
  handleSelfCourses
);

// *******************************************************************************************************
// update the course
courseRouter.patch(
  "/selfCourses/update/:courseID",
  restrictToLoggedInUserOnly,
  handleUpdateSelfCourses
);

// ***********************************************************************************************************
// delete course

courseRouter.delete(
  "/delete/:courseID",
  restrictToLoggedInUserOnly,
  handleDeleteSelfCourses
);

// ****************************************************************************************************************
module.exports = {
  courseRouter,
};
