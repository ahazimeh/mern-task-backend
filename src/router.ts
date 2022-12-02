import { signin, signup } from "./controllers/authentication";
// const passportService = require("./services/passport");
require("./services/passport");
import passport from "passport";

import * as core from "express-serve-static-core";
import { Request, Response } from "express";
import categories from "./models/categories";
import validation from "./helpers/validation";
import fs from "fs/promises";
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

  app.get(
    "/categories/:categoryId",
    async function (req: Request, res: Response) {
      const { categoryId } = req.params;
      const menu = await categories.findById(categoryId);
      return res.send({ menu });
    }
  );

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

  app.post("/updateItem/:categoryId/:itemId", async (req: any, res: any) => {
    const { categoryId, itemId } = req.params;
    const { itemName, itemDescription, itemPrice } = req.body;
    const image = req.file?.filename;
    // console.log(req, res);
    categories.findById(categoryId).then((_res: any) => {
      const result = _res.updateItem(itemId, {
        name: itemName,
        description: itemDescription,
        price: !isNaN(+itemPrice) && +itemPrice,
        image,
      });
      return validation(result, res);
    });
  });

  app.post("/updateCategory/:categoryId", async (req: any, res: any) => {
    const { categoryId } = req.params;
    const name = "asdsad";
    const image = req.file?.filename;

    categories.findById(categoryId).then(async (_res: any) => {
      if (image) {
        try {
          await fs.unlink(`public/images/${_res.image}`);
        } catch (err) {}
      }
      _res.image = image ?? _res.image;

      _res.name = name ?? _res.name;
      _res.save();
      res.send("");
    });
  });

  app.post("/signin", requireSignin, signin); // note when going

  app.post("/signup", signup);
  app.post("/test", async () => {
    try {
      await fs.unlink(
        "public/images/44e4ad4b-9af0-44ec-a64e-e2e09affc127-UC-a53897a1-e841-454c-be35-da450b64491e.jpg"
      );
    } catch (err) {}
  });
}
