const express = require("express");
const {
    getCourses,
    getCourse,
    addCourse,
    uptadeCourse,
    deleteCourse,
} = require("../controllers/courses");

const router = express.Router({ mergeParams: true });

router.route("/").get(getCourses).post(addCourse);
router.route("/:id").get(getCourse).put(uptadeCourse).delete(deleteCourse);

module.exports = router;