const { courseModel } = require("../model/courses.model");
const { lessonModel } = require("../model/lessons.model");
const { userModel } = require("../model/registration.model");

// ***************************************************************************
// search functionality

async function handleSearch(req, res) {
  console.log("handle search");

  // Destructure userName from req.params
  const { userName } = req.query;
  console.log("Searching for:", userName);

  try {
    // Fetch all users, courses, and lessons
    const allUsers = await userModel.find({});
    const allCourses = await courseModel.find({});
    const allLessons = await lessonModel.find({});

    // Convert the search query to lowercase for case-insensitive comparison
    const lowercasedQuery = userName.trim().toLowerCase();
    console.log("Search Query (lowercased):", lowercasedQuery);

    // Filter users, courses, and lessons based on name/title matching manually
    const userResults = allUsers.filter((user) =>
      user.name.trim().toLowerCase().includes(lowercasedQuery)
    );

    const courseResults = allCourses.filter((course) =>
      course.title.trim().toLowerCase().includes(lowercasedQuery)
    );

    const lessonResults = allLessons.filter((lesson) =>
      lesson.title.trim().toLowerCase().includes(lowercasedQuery)
    );

    // Log the results for debugging

    // Prepare response data by only including non-empty result arrays
    let combinedResults = {};
    if (userResults.length > 0) {
      combinedResults.users = userResults;
    }
    if (courseResults.length > 0) {
      combinedResults.courses = courseResults;
    }
    if (lessonResults.length > 0) {
      combinedResults.lessons = lessonResults;
    }

    // Check if there are any results to return
    if (Object.keys(combinedResults).length > 0) {
      return res.status(200).json(combinedResults);
    } else {
      return res.status(404).json({ msg: "No matching results found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: err.message });
  }
}

module.exports = { handleSearch };
