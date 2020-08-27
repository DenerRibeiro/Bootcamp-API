const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResonse");
const asyncHandler = require("../middleware/async");
const geoCoder = require("../utils/geocoder");
const path = require("path");

//@dec      Get all bootcamps
//@route    GET /api/v1/bootcamps
//@access   Public
exports.getBootcamps = asyncHandler(async(req, res, next) => {
    res.status(200).json(res.advancedResults);
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
        const bootcamp = await Bootcamp.findById(req.params.id);
        if (!bootcamp) {
            return next(
                new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
            );
        }

        bootcamp.remove();

        return res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};

//@dec      Get bootcamps within a radius
//@route    GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access   Private
exports.getBootcampsInRadius = async(req, res, next) => {
    const { zipcode, distance } = req.params;

    //Get lat and long from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    //calc radius using radians
    //divide distance by radius fo earth
    //earth radius = 3,963 mi

    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: {
            $geoWithin: {
                $centerSphere: [
                    [lng, lat], radius
                ],
            },
        },
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps,
    });
};

//@dec      Upload photo bootcamp
//@route    PUT /api/v1/bootcamps/:id/photo
//@access   Private
exports.bootcampPhotoUpload = asyncHandler(async(req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );
    }

    if (!req.files) {
        return next(new ErrorResponse("please upload a file", 400));
    }
    const file = req.files.file;

    //Make sure that the img is a photo
    if (!file.mimetype.startsWith("image")) {
        return next(new ErrorResponse("please upload an image file", 400));
    }

    //Check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse(
                "please upload an image less than " + process.env.MAX_FILE_UPLOAD,
                400
            )
        );
    }

    //create custom file name
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async(err) => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse("Problem with file upload", 500));
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

        res.status(200).json({
            success: true,
            data: file.name,
        });
    });
});