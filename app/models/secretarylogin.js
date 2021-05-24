import mongoose, { Schema } from 'mongoose'
import timestamps from 'mongoose-timestamp'

const SecretaryLoginSchema = new Schema(
  {
    secretaryId: {
      type: mongoose.Types.ObjectId,
      index: true,
      unique: true,
      required: true,
      trim: true
    },
    fullname: {
      type: String,
      required: false,
      trim: true,
      default: "Secrétaire"
    },
    isLogin: {
      type: Boolean,
      required: true,
      index: true
    }
  }
)

SecretaryLoginSchema.plugin(timestamps)


var SecretaryLogin;
try {
  SecretaryLogin = mongoose.model('SecretaryLogin', SecretaryLoginSchema);
} catch(e) {
  SecretaryLogin = mongoose.model('SecretaryLogin');
}
export default SecretaryLogin;
