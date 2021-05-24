import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const mongoosePaginate = require("mongoose-paginate-v2");

const DossierHistorySchema = new Schema(
  {
    dossierId: {
      type: mongoose.Types.ObjectId,
      index: true,
      required: true,
      ref: "Dossier",
    },
    actor: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    actorType  : {
      type: String,
      required: true,
      enum: ["patient", "secretaire","plateforme"],
      default: "plateforme",
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

DossierHistorySchema.plugin(timestamps);
DossierHistorySchema.plugin(mongoosePaginate);


var DossierHistory;
try {
  DossierHistory = mongoose.model('DossierHistory', DossierHistorySchema);
} catch(e) {
  DossierHistory = mongoose.model('DossierHistory');
}
export default DossierHistory;
