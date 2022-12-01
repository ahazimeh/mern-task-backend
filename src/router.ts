import { signin, signup } from "./controllers/authentication";
// const passportService = require("./services/passport");
require("./services/passport");
import passport from "passport";

import * as core from "express-serve-static-core";
import { Request, Response } from "express";
import categories from "./models/categories";
const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });

export default function (app: core.Express) {
  app.get("/", requireAuth, function (req: Request, res: Response) {
    console.log(req.user); // thanks to passport we have this property available
    res.send({ hi: "there" });
  });
  app.get("/categories", function (_: Request, res: Response) {
    res.send({
      categories: [
        {
          name: "Platters",
          items: [
            {
              name: "Chicken Platter",
              description:
                "4 chicken pieces with our special sauce served with bbq dip and wedges",
              price: 160000,
              image: "https://via.placeholder.com/150",
            },
          ],
        },
      ],
    });
  });

  app.delete("/removeItem/:categoryId/:itemId", (req, res) => {
    const { categoryId, itemId } = req.params;
    // Add to cart
    categories.findById(categoryId).then((_res: any) => {
      // console.log(res.addToCart());
      _res.removeFromCart(itemId);
      res.send("");
    });
  });

  app.post("/addItem/:categoryId", (req, res) => {
    const { categoryId } = req.params;
    const { categoryName } = req.body;

    categories.findById(categoryId).then((_res: any) => {
      console.log(_res.addToCart({ name: categoryName }));
      // res.removeFromCart("6387b9b8b7291f5b2183df2f");
      res.send("");
    });
  });

  app.post("/addCategory", (req: any, res: any) => {
    const category = new categories({
      name: req.body.name,
      image: req.file.filename,
    });
    category.save();
    res.send("");
  });

  app.post("/signin", requireSignin, signin); // note when going

  app.post("/signup", signup);
}
