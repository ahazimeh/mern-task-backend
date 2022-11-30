// const mongoose = require('mongoose');
import mongoose from "mongoose";
import express from "express";
const app = express();

import categories from "./models/categories";
const category = new categories({
  name: "cat1",
});

mongoose
  .connect(
    `mongodb+srv://ali:_StrongPassword@cluster0.gogkueu.mongodb.net/Restaurant?retryWrites=true&w=majority`
  )
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
