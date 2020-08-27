const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const colors = require("colors");
const errorHandler = require("./middleware/error");

//Load env vars
dotenv.config({ path: "./config/config.env" });

//Connect to database
connectDB();

//route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");

const app = express();

//Body parser
app.use(express.json());

//Dev loging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

//mount routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);

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