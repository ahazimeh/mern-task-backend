// const jwt = require("jwt-simple");
// const User = require("../models/user");
// const config = require("../config");
import jwt from "jwt-simple";
import User from "../models/users";
import config from "../config";
import { NextFunction, Request, Response } from "express";

function tokenForUser(user: typeof User) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

export const signin = function (req: Request, res: Response) {
  // User has already had their email and password auth'd
  // We just need to give them a token
  res.send({ token: tokenForUser(req.user) });
};

export const signup = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res
      .status(422)
      .send({ error: "You must provide email and password " });
  }
  // See if a user with a given email exists
  return User.findOne(
    { email },
    function (err: Error, existingUser: typeof User) {
      if (err) {
        return next(err);
      }

      // If a user with email does exist, return an error
      if (existingUser) {
        return res.status(422).send({ error: "Email is in user" });
      }

      // If a user with email does NOT exist, create and save user record
      const user = new User({
        email,
        password,
      });

      user.save(function (err: Error) {
        if (err) {
          return next(err);
        }

        // Respond to request that indicating the user was created
        res.json({ token: tokenForUser(user) });
      });
    }
  );
  // return next();
};
