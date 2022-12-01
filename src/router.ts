import { signin, signup } from "./controllers/authentication";
// const passportService = require("./services/passport");
require("./services/passport");
import passport from "passport";

import * as core from "express-serve-static-core";
import { Request, Response } from "express";
import categories from "./models/categories";
import validation from "./helpers/validation";
const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });

export default function (app: core.Express) {
  app.get("/", requireAuth, function (req: Request, res: Response) {
    console.log(req.user); // thanks to passport we have this property available
    res.send({ hi: "there" });
  });
  app.get("/categories", async function (_: Request, res: Response) {
    const menu = await categories.find();
    return res.send({ menu });
  });

  app.delete("/removeCategory/:categoryId", (req, res) => {
    const { categoryId } = req.params;
    categories.remove({ _id: categoryId }).exec();
    res.send("");
  });

  app.delete("/removeItem/:categoryId/:itemId", (req, res) => {
    const { categoryId, itemId } = req.params;
    categories.findById(categoryId).then((_res: any) => {
      _res.removeItem(itemId);
      res.send("");
    });
  });

  app.post("/addItem/:categoryId", (req, res) => {
    const { categoryId } = req.params;
    const { itemName, itemDescription, itemPrice } = req.body;
    const image = req.file?.filename;

    categories.findById(categoryId).then((_res: any) => {
      const result = _res.addItem({
        name: itemName,
        description: itemDescription,
        price: !isNaN(+itemPrice) && +itemPrice,
        image,
      });
      return validation(result, res);
    });
  });

  app.post("/addCategory", async (req: any, res: any) => {
    let category;
    category = await new categories({
      name: req.body.name,
      image: req?.file?.filename,
    });
    return validation(category.save(), res);
  });

  app.post("/updateCategory", (req: any, res: any) => {
    // console.log(req, res);
  });

  app.post("/signin", requireSignin, signin); // note when going

  app.post("/signup", signup);
}
