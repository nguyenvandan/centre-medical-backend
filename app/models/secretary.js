import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const bcrypt = require("bcryptjs");
const validator = require("validator");
const mongoosePaginate = require("mongoose-paginate-v2");

const SecretarySchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error({ error: "Invalid Email address" });
        }
      },
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

SecretarySchema.virtual("password").set(function (value) {
    this.passwordHash = bcrypt.hashSync(value, 12);
});

SecretarySchema.plugin(timestamps);
SecretarySchema.plugin(mongoosePaginate);


var Secretary;
try {
  Secretary = mongoose.model('Secretary', SecretarySchema);
} catch(e) {
  Secretary = mongoose.model('Secretary');
}
export default Secretary;
