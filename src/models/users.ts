const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
});

// On Save Hook, encrypt password
// Before saving a model, run this function

userSchema.pre("save", function (next: any) {
  // @ts-ignore
  const user = this;

  bcrypt.genSalt(10, function (err: any, salt: any) {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, null, function (err: any, hash: any) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (
  candidatePassword: any,
  callback: any
) {
  bcrypt.compare(
    candidatePassword,
    this.password,
    function (err: any, isMatch: any) {
      if (err) {
        return callback(err);
      }

      callback(null, isMatch);
    }
  );
};

const modelClass = mongoose.model("user", userSchema);

export default modelClass;
