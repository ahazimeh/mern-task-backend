// const mongoose = require('mongoose');
import mongoose from "mongoose";
import express, { Request, Response } from "express";
import router from "./router";
import bodyParser from "body-parser";
import cors from "cors";
import multer, { FileFilterCallback } from "multer";
import { v4 as uuidv4 } from "uuid";
const app = express();

import categories from "./models/categories";

// app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
// const category =
new categories({
  name: "cat1",
});
let corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// const upload = multer({ dest: "uploads/" });
const fileStorage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "public/images");
  },
  filename: (_, file, cb) => {
    cb(null, uuidv4() + "-" + file.originalname);
  },
});

const fileFilter = (
  _: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  }
  cb(null, false);
};

app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use(cors(corsOptions));

app.post("/image", (req: Request, _: Response) => {
  console.log(req.file);
  // res.send("");
});
router(app);

mongoose
  .connect(
    `mongodb+srv://ali:_StrongPassword@cluster0.gogkueu.mongodb.net/Restaurant?retryWrites=true&w=majority`
  )
  .then((_) => {
    app.listen(8000);
  })
  .catch((err) => {
    console.log(err);
  });
