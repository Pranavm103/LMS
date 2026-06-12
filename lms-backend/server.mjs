import express from "express";
import { connect, disconnect } from "./config/db.mjs";
import chalk from "chalk";
import cors from "cors";
// import userRouter from "./routes/user-router.mjs"
import authRouter from "./routes/auth-router.mjs";
import courseRouter from "./routes/course-router.mjs";
import enrollmentRouter from "./routes/enrollment-router.mjs";
import lectureRouter from "./routes/lecture-router.mjs";
import cookieParser from "cookie-parser";
const app = express();

const PORT = process.env.PORT || 5000;
const allowedFrontendOrigins = [
    process.env.FRONTEND_URL,
    /^http:\/\/localhost:\d+$/,
    /^http:\/\/127\.0\.0\.1:\d+$/
].filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedFrontendOrigins.some((allowedOrigin) => (
            allowedOrigin instanceof RegExp
                ? allowedOrigin.test(origin)
                : allowedOrigin === origin
        ))) {
            return callback(null, true);
        }

        callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"))
// app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/courses", courseRouter);
app.use("/api/lectures", lectureRouter);
app.use("/api/enrollments", enrollmentRouter);

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});


const server = app.listen(PORT, () => {
    console.log(chalk.greenBright(`Server is running on port ${PORT}`));
})

connect(process.env.CONNECTION_STRING).catch((err) => {
    console.error(chalk.redBright("MongoDB connection failed. API server is still running."));
    console.error(err);
});

process.on("SIGINT", async () => {
    console.log(chalk.yellowBright("Received SIGINT. Shutting down gracefully..."));
    await disconnect();
    await server.close();
    process.exit(0);
})

process.on("uncaughtException", async (err) => {
    console.error(chalk.redBright("Uncaught Exception:", err));
    await disconnect();
    process.exit(1);
})

process.on("unhandledRejection", async (reason, promise) => {
    console.error(chalk.redBright("Unhandled Rejection at:", promise, "reason:", reason));
    await disconnect();
    process.exit(1);
})
