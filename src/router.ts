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
  orderItems,
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

  app.delete("/removeCategory/:categoryId", requireAuth, removeCategory);

  app.delete("/removeItem/:categoryId/:itemId", requireAuth, removeItem);

  app.post("/addItem/:categoryId", requireAuth, addItem);

  app.post("/addCategory", requireAuth, addCategory);

  app.put("/updateItem/:categoryId/:itemId", requireAuth, updateItem);

  app.put("/updateCategory/:categoryId", requireAuth, updateCategory);

  app.post("/orderCategories/:cat1/:cat2", requireAuth, orderCategories);
  app.post(
    "/orderItems/:categoryId/:item1Id/:item2Id",
    requireAuth,
    orderItems
  );

  app.post("/signin", requireSignin, signin); // note when going

  app.post("/signup", signup);
}
