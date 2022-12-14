import passport from "passport";
import User from "../models/users";
import config from "../config";
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
// import LocalStrategy from "passport-local";
import { Strategy as LocalStrategy } from "passport-local";
import { VerifiedCallback } from "passport-jwt";
// import * as passportLocal from "passport-local";
// const LocalStrategy = passportLocal.Strategy;

// Create local strategy
const localOptions = { usernameField: "email" }; // because by default the field is called username
const localLogin = new LocalStrategy(localOptions, function (
  email,
  password,
  done
) {
  // Verify this email and password, call done with the user
  // if it is the correct email and password
  // otherwise, call done with false
  User.findOne({ email }, function (err: Error, user: typeof User) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false);
    }

    // compare passwords - is `password` equal to user.password?
    user.comparePassword(password, function (err: Error, isMatch: boolean) {
      if (err) {
        return done(err);
      }
      if (!isMatch) {
        return done(null, false);
      }
      return done(null, user);
    });
  });
});

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: config.secret,
};
interface Payload {
  sub: string;
}
// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function (
  payload: Payload,
  done: VerifiedCallback
) {
  // See if the user ID in the payload exists in our database
  // If it does, call 'done' with that user
  // otherwise, call done without a user object
  User.findById(payload.sub, function (err: Error, user: typeof User) {
    if (err) {
      return done(err, false);
    }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
