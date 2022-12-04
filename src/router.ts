import { signin, signup } from "./controllers/authentication";
// const passportService = require("./services/passport");
require("./services/passport");
import passport from "passport";

import * as core from "express-serve-static-core";
import { Request, Response } from "express";
import {
  addCategory,
  addItem,
  getAllCategories,
  getSingleCategory,
  orderCategories,
  removeCategory,
  removeItem,
  updateCategory,
  updateItem,
} from "./controllers/categories";
const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });

export default function (app: core.Express) {
  app.get("/", requireAuth, function (req: Request, res: Response) {
    console.log(req.user); // thanks to passport we have this property available
    res.send({ hi: "there" });
  });

  app.get("/categories", getAllCategories);

  app.get("/categories/:categoryId", getSingleCategory);

  app.delete("/removeCategory/:categoryId", removeCategory);

  app.delete("/removeItem/:categoryId/:itemId", removeItem);

  app.post("/addItem/:categoryId", addItem);

  app.post("/addCategory", addCategory);

  app.post("/updateItem/:categoryId/:itemId", updateItem);

  app.post("/updateCategory/:categoryId", updateCategory);

  app.post("/orderCategories/:cat1/:cat2", orderCategories);

  app.post("/signin", requireSignin, signin); // note when going

  app.post("/signup", signup);
}
