import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const mongoosePaginate = require("mongoose-paginate-v2");

const SecretaryDossierSchema = new Schema(
  {
    dossierId: {
      type: mongoose.Types.ObjectId,
      index: true,
      required: true,
      unique: true,
      ref: "Dossier",
    },
    secretaryId: {
        type: mongoose.Types.ObjectId,
        index: true,
        required: true,
        ref: "Secretary",
      },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

SecretaryDossierSchema.plugin(timestamps);
SecretaryDossierSchema.plugin(mongoosePaginate);


var SecretaryDossier;
try {
  SecretaryDossier = mongoose.model('SecretaryDossier', SecretaryDossierSchema);
} catch(e) {
  SecretaryDossier = mongoose.model('SecretaryDossier');
}
export default SecretaryDossier;
