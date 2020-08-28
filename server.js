const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const colors = require("colors");
const fileUpload = require("express-fileupload");
const errorHandler = require("./middleware/error");
const path = require("path");
const cookieParser = require("cookie-parser");

//Load env vars
dotenv.config({ path: "./config/config.env" });

//Connect to database
connectDB();

//Route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const users = require("./routes/users");

const app = express();

//Body parser
app.use(express.json());

//cookie parser
app.use(cookieParser());

//Dev loging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

//File uploading
app.use(fileUpload());

//set static folder
app.use(express.static(path.join(__dirname, "public")));

//mount routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(
        `server runnning in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
        .bold
    )
);

//handle unhandle promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    //close server
    server.close(() => process.exit(1));
});