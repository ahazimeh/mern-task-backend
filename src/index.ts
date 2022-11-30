// const mongoose = require('mongoose');
import mongoose from "mongoose";
import express from "express";
import router from "./router";
import bodyParser from "body-parser";
console.log(router);

const app = express();

import categories from "./models/categories";
app.use(bodyParser.json({ type: "*/*" }));
// const category =
new categories({
  name: "cat1",
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
