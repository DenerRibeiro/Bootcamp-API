const express = require("express");
const {
    getBootcamp,
    getBootcamps,
    createBootcamp,
    deleteBootcamp,
    updateBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload,
} = require("../controllers/bootcamps");

const Bootcamp = require("../models/Bootcamp");
const advancedResults = require("../middleware/advancedResults");

//Include other resource routers
const courseRouter = require("./courses");

const router = express.Router();

//Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router
    .route("/")
    .get(advancedResults(Bootcamp, "courses"), getBootcamps)
    .post(createBootcamp);

router.route("/:id/photo").put(bootcampPhotoUpload);

router.route("/:id").put(updateBootcamp).delete(deleteBootcamp);

module.exports = router;