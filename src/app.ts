import "express-async-errors";
import dotenv from "dotenv";
dotenv.config();

// express
import express from "express";
const app = express();
// rest of the packages
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import rateLimiter from "express-rate-limit";
import helmet from "helmet";
// import xss from "xss-clean";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
});

// database
import { connectDB } from "./db/connect";

//  routers
import authRouter from "./routes/authRoutes";
import userRouter from "./routes/userRoutes";
import productRouter from "./routes/productRoutes";
import reviewRouter from "./routes/reviewRoutes";
import orderRouter from "./routes/orderRoutes";
import statRouter from "./routes/statRoutes";

// middleware
import { notFound as notFoundMiddleware } from "./middleware/not-found";
import { errorHandlerMiddleware } from "./middleware/error-handler";

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
// app.use(cors());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5173",
      "http://localhost:5173",
      process.env.FRONTEND_URL as string,
    ],
    credentials: true,
  })
);
// app.use(xss());
app.use(mongoSanitize());

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use(express.static("./public"));
app.use(fileUpload({ useTempFiles: true }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/stats", statRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL!);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
