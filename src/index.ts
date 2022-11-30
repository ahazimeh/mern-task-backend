// const mongoose = require('mongoose');
import mongoose from "mongoose";
import express from "express";
import router from "./router";
import bodyParser from "body-parser";
import cors from "cors";
console.log(router);

const app = express();

import categories from "./models/categories";
app.use(bodyParser.json({ type: "*/*" }));
// const category =
new categories({
  name: "cat1",
});
let corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
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
