const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResonse");
const asyncHandler = require("../middleware/async");

//@dec      Get all bootcamps
//@route    GET /api/v1/bootcamps
//@access   Public
exports.getBootcamps = asyncHandler(async(req, res, next) => {
    const bootcamps = await Bootcamp.find();

    res
        .status(200)
        .json({ success: true, count: bootcamps.length, data: bootcamps });
});

//@dec      Get single bootcamps
//@route    GET /api/v1/bootcamps:id
//@access   Public
exports.getBootcamp = async(req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if (!bootcamp) {
            return next(
                new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
            );
        }
        res.status(200).json({ success: true, data: bootcamp });
    } catch (err) {
        next(err);
    }
};

//@dec      Create new bootcamp
//@route    POST /api/v1/bootcamps
//@access   Private
exports.createBootcamp = asyncHandler(async(req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
        success: true,
        data: bootcamp,
    });
});

//@dec      Update bootcamp
//@route    PUT /api/v1/bootcamps:id
//@access   Private
exports.updateBootcamp = asyncHandler(async(req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );
    }
    return res.status(200).json({ success: true, data: bootcamp });
});
//@dec      Delete bootcamp
//@route    DELETE /api/v1/bootcamps:id
//@access   Private
exports.deleteBootcamp = async(req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        if (!bootcamp) {
            return next(
                new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
            );
        }
        return res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};