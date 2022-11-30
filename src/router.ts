import { signin, signup } from "./controllers/authentication";
// const passportService = require("./services/passport");
require("./services/passport");
import passport from "passport";

import * as core from "express-serve-static-core";
import { Request, Response } from "express";
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

  app.post("/image", (req: any, res: any) => {
    console.log(req.body);

    console.log(req.file);
    res.send("");
  });

  app.post("/signin", requireSignin, signin); // note when going

  app.post("/signup", signup);
}
