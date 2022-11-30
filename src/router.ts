import { signin, signup } from "./controllers/authentication";
// const passportService = require("./services/passport");
require("./services/passport");
import passport from "passport";

const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });

export default function (app: any) {
  app.get("/", requireAuth, function (req: any, res: any) {
    console.log(req.user); // thanks to passport we have this property available
    res.send({ hi: "there" });
  });

  app.post("/signin", requireSignin, signin); // note when going

  app.post("/signup", signup);
}
