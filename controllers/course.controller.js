const { courseModel } = require("../model/courses.model");
const { userModel } = require("../model/registration.model");
const jwt = require("jsonwebtoken");
const { redis } = require("../client");
const { setCourseUser } = require("../service/container");
const { validationResult } = require("express-validator");
// ******************************************************************************************
//post course

async function handleCourse(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { courseName, title, description, userID } = req.body;

  try {
    const course = new courseModel({
      courseName,
      title,
      description,
      userID,
    });

    await course.save();

    const courseToken = setCourseUser(course);
    const cookieOptions = {
      expires: new Date(Date.now() + 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };
    res.cookie("newCourse", courseToken, cookieOptions);
    console.log("course added");
    return res.status(200).redirect(`/static/lesson`);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ msg: err.message });
  }
}
// ****************************************************************************************************
// get all course
async function handleAllCourses(req, res) {
  const cacheKey = "all_courses";
  console.log("handle all course");
  try {
    const allCourse = await courseModel.find({});
    if (!allCourse) {
      return res.status(400).send({ msg: "no any courses" });
    }
    // console.log(allCourse);
    if (allCourse) {
      await redis
        .set(cacheKey, JSON.stringify(allCourse), "ex", 60)
        .catch((err) => {
          return res.status(400).send(err);
        }); // Cache for 30 seconds
      return res.status(200).json(allCourse);
    }
    // return res.status(200).json(allCourse);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ msg: err.message });
  }
}
// ********************************************************************************************************
// get self only course
async function handleSelfCourses(req, res) {
  const cacheSelf = "self_course";
  const token = req.cookies.uid;
  const decoded = jwt.verify(token, "vishal$123$");
  try {
    if (decoded) {
      const courses = await courseModel.find({ userID: decoded._UserID });
      console.log("inside handle self course", courses);
      if (courses) {
        await redis
          .set(cacheSelf, JSON.stringify(courses), "ex", 60)
          .catch((err) => {
            return res.status(400).send({ msg: err.message });
          });
        return res.status(200).send(courses);
      } else {
        return res.status(400).send({ msg: "no course created by this user" });
      }
    } else {
      return res.status(400).send({ msg: "not verified user " });
    }
  } catch (err) {
    return res.status(400).send({ msg: err.message });
  }
}
// *****************************************************************************************************
// handle updtae
async function handleUpdateSelfCourses(req, res) {
  const token = req.cookies.uid;
  const decoded = jwt.verify(token, "vishal$123$");
  const { courseID } = req.params;

  const payload = req.body;

  try {
    if (decoded) {
      const updatedCourse = await courseModel.findOneAndUpdate(
        { _id: courseID, userID: decoded._UserID },
        payload,
        { new: true }
      );
      // console.log(updatedCourse);

      if (updatedCourse) {
        console.log("course is updated");
        return res.status(200).send(updatedCourse);
      } else {
        return res
          .status(400)
          .send({ msg: "No course found for this user or invalid course ID." });
      }
    } else {
      return res.status(400).send({ msg: "Invalid user authentication." });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({ msg: err.message });
  }
}
// ****************************************************************************************************
// delete course
async function handleDeleteSelfCourses(req, res) {
  const token = req.cookies.uid;
  const decoded = jwt.verify(token, "vishal$123$");
  const { courseID } = req.params;
  console.log(courseID);
  try {
    if (decoded) {
      const deletedCourse = await courseModel.findOneAndDelete({
        _id: courseID,
        userID: decoded._UserID,
      });

      if (deletedCourse) {
        console.log("delete success");
        return res.status(200).send({ msg: "Course deleted successfully." });
      } else {
        return res
          .status(404)
          .send({ msg: "No course found for this user or invalid course ID." });
      }
    } else {
      return res.status(400).send({ msg: "Invalid user authentication." });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({ msg: err.message });
  }
}

module.exports = {
  handleCourse,
  handleAllCourses,
  handleSelfCourses,
  handleUpdateSelfCourses,
  handleDeleteSelfCourses,
};
