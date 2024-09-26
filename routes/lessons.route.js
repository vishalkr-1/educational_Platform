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
lessonRouter.post(
  "/add",
  [body("title").notEmpty(), body("content").notEmpty()],

  restrictToLoggedInUserOnly,
  handleAdd
);

const {
  allLessonCache,
  selfLessonCache,
} = require("../caching/lesson.caching");
lessonRouter.get(
  "/",
  restrictToLoggedInUserOnly,
  allLessonCache,
  handleAllLesson
);

lessonRouter.get(
  "/selfLesson/:courseID",
  restrictToLoggedInUserOnly,
  selfLessonCache,
  handleSelfLessons
);
lessonRouter.patch(
  "/selfLesson/update/:lessonID",
  restrictToLoggedInUserOnly,
  handleUpdateSelfLessons
);

module.exports = {
  lessonRouter,
};
