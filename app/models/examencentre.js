import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const validator = require("validator");

const mongoosePaginate = require("mongoose-paginate-v2");

const ExamenCentreSchema = new Schema(
  {
    name: {
      type: String,
      index: true,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
      lowercase: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error({ error: "Invalid Email address" });
        }
      },
    },
    address: {
      street: {
        type: String,
        required: false,
      },
      zipcode: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: false,
      },
      country: {
        type: String,
        required: false,
        default: "France",
      },
    },
    accueil: {
      type: String,
      required: false,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

ExamenCentreSchema.plugin(timestamps);
ExamenCentreSchema.plugin(mongoosePaginate);

var ExamenCentre;
try {
  ExamenCentre = mongoose.model('ExamenCentre', ExamenCentreSchema);
} catch(e) {
  ExamenCentre = mongoose.model('ExamenCentre');
}
export default ExamenCentre;

