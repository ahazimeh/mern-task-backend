import { NextFunction } from "express";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
import bcrypt from "bcrypt-nodejs";

const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
});

// On Save Hook, encrypt password
// Before saving a model, run this function

userSchema.pre("save", function (next: NextFunction) {
  // @ts-ignore
  const user = this;

  bcrypt.genSalt(10, function (err: Error, salt: string) {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, null, function (err: Error, hash: string) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

type MyCallback = (arg1: Error | null, arg2?: boolean) => void;

userSchema.methods.comparePassword = function (
  candidatePassword: string,
  callback: MyCallback
) {
  bcrypt.compare(
    candidatePassword,
    this.password,
    function (err: Error, isMatch: boolean) {
      if (err) {
        return callback(err);
      }

      callback(null, isMatch);
    }
  );
};

const modelClass = mongoose.model("user", userSchema);

export default modelClass;
