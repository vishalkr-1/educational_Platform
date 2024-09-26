const express = require("express");
const { body } = require("express-validator");
const { restrictToLoggedInUserOnly } = require("../middleware/auth");
const {
  handleAdd,
  handleAllLesson,
  handleSelfLessons,
  handleUpdateSelfLessons,
} = require("../controllers/lesson.controller");
const { restrictToLoggedInUserOnlyLesson } = require("../middleware/lesson");

const lessonRouter = express.Router();

// ************************************************************************************
// add lesson
lessonRouter.post(
  "/add",
  [body("title").notEmpty(), body("content").notEmpty()],

  restrictToLoggedInUserOnly,
  handleAdd
);

// ***************************************************************************

const {
  allLessonCache,
  selfLessonCache,
} = require("../caching/lesson.caching");

// ************************************************************************
// get all lessons
lessonRouter.get(
  "/",
  restrictToLoggedInUserOnly,
  allLessonCache,
  handleAllLesson
);

// ******************************************************************************************
// get own lesson
lessonRouter.get(
  "/selfLesson/:courseID",
  restrictToLoggedInUserOnly,
  selfLessonCache,
  handleSelfLessons
);
// *****************************************************************************************************
// update lesson
lessonRouter.patch(
  "/selfLesson/update/:lessonID",
  restrictToLoggedInUserOnly,
  handleUpdateSelfLessons
);
// **************************************************************************************************************

module.exports = {
  lessonRouter,
};
