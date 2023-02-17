import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import multer from "multer";
import { register } from "./controller/auth.js";

// CONFIGURATION //
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// app created //
const app = express();
app.use(express.json());

app.use(helmet()); //
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); //
app.use(morgan("common")); //
app.use(bodyParser.json({ limit: "30mb", extended: true })); //
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true })); //
app.use(cors()); // cross origin info sharing
app.use("/assets", express.static(path.join(__dirname, "public/assets"))); // saving files locally

// FILE STORAGE //
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Register api route
app.post("/auth/register", upload.single("picture"), register);

// MONGOOSE SETUP //
const port = process.env.Port || 6001;
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`'Server is running on : ${port}`);
    });
  })
  .catch((error) => {
    console.log(`${error} server not working`);
  });
