const { redis } = require("../client");
const { lessonModel } = require("../model/lessons.model");
const { getUser } = require("../service/auth");
const { getCourseUser } = require("../service/container");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
// ******************************************************************************************************
// lesson  add

async function handleAdd(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const courseDecoder = req.cookies.newCourse;
  console.log("courseDecoder", courseDecoder);
  if (!courseDecoder) {
    return res.status(400).send({ msg: "courseToken is required." });
  }
  const courseData = getCourseUser(courseDecoder);
  console.log("courseData", courseData);
  if (!courseData) {
    return res.status(400).send({ msg: "courseID is required." });
  }

  const { title, content } = req.body;
  try {
    const lesson = new lessonModel({
      courseID: courseData._courseID,
      title,
      content,
      userID: courseData._userID,
    });
    await lesson.save();
    return res.status(200).send({ msg: "a lesson is added" });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ msg: err.message });
  }
}

// **********************************************************************************************************
// find all lesson

async function handleAllLesson(req, res) {
  const cacheAllLesson_key = "all_lesson";
  try {
    const allLesson = await lessonModel.find({});
    if (!allLesson) {
      return res.status(400).send({ msg: "no any lesson" });
    }
    if (allLesson) {
      console.log("handle All lessonAllLesson", allLesson);
      await redis
        .set(cacheAllLesson_key, JSON.stringify(allLesson), "ex", 60)
        .catch((err) => {
          return res.status(400).send(err);
        });
      return res.status(200).json(allLesson);
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({ msg: err.message });
  }
}
// *********************************************************************************************************
// get self lesson

async function handleSelfLessons(req, res) {
  console.log("handleselfcontroller");
  const cacheSelf = "self_lesson";
  try {
    const userToken = req.cookies.uid;
    console.log(userToken);
    if (!userToken) {
      return res.status(400).send({ msg: "No user found in cookies." });
    }
    const user = getUser(userToken);
    console.log(user);
    console.log(user._id);
    const courseID = req.params.courseID;
    console.log(courseID);
    // Assuming lessons are stored with a courseId field
    const lessons = await lessonModel.find({
      courseID: courseID,
      userID: user._UserID,
    });
    console.log(lessons);
    if (lessons && lessons.length > 0) {
      await redis
        .set(cacheSelf, JSON.stringify(lessons), "ex", 60)
        .catch((err) => {
          return res.status(400).send({ msg: err.message });
        });
      return res.status(200).send(lessons);
    } else {
      return res.status(404).send({ msg: "No lessons found for this course." });
    }
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
}
// ***********************************************************************************************
//update lesson

async function handleUpdateSelfLessons(req, res) {
  const token = req.cookies.uid;

  if (!token) {
    return res
      .status(401)
      .send({ msg: "Authentication token is missing. Please log in." });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, "vishal$123$");
  } catch (err) {
    return res.status(401).send({ msg: "Invalid token. Please log in again." });
  }
  const { lessonID } = req.params;
  console.log(lessonID);
  const payload = req.body;

  try {
    const existingLesson = await lessonModel.findOne({
      _id: lessonID,
      userID: decoded._UserID,
    });
    if (!existingLesson) {
      return res
        .status(404)
        .send({ msg: "No lesson found for this course or lesson ID." });
    }

    // Now update
    const updatedLesson = await lessonModel.findOneAndUpdate(
      { _id: lessonID, userID: decoded._UserID },
      payload,
      { new: true }
    );

    if (updatedLesson) {
      console.log("lesson updated");
      return res.status(200).send(updatedLesson); // Send the updated lesson
    } else {
      return res
        .status(400)
        .send({ msg: "No lesson found for this course or lesson ID." });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({ msg: err.message });
  }
}

module.exports = {
  handleAdd,
  handleAllLesson,
  handleSelfLessons,
  handleUpdateSelfLessons,
};
