import mongoose, { Schema } from 'mongoose'
import timestamps from 'mongoose-timestamp'

const DossierLoginSchema = new Schema(
  {
    dossierId: {
      type: mongoose.Types.ObjectId,
      index: true,
      unique: true,
      required: true,
      trim: true
    },
    noDossier: {
      type: String,
      index: true,
      required: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: false,
      trim: true,
      default: "Patient"
    },
    isLogin: {
      type: Boolean,
      required: true,
      index: true
    }
  }
)

DossierLoginSchema.plugin(timestamps)


var DossierLogin;
try {
  DossierLogin = mongoose.model('DossierLogin', DossierLoginSchema);
} catch(e) {
  DossierLogin = mongoose.model('DossierLogin');
}
export default DossierLogin;

