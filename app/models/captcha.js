import mongoose, { Schema } from 'mongoose'
import timestamps from 'mongoose-timestamp'

const CaptchaSchema = new Schema(
  {
    dossierId: {
      type: mongoose.Types.ObjectId,
      index: true,
      unique: true,
      required: true,
      trim: true
    },
    captcha: {
      type: String,
      required: false
    }
  }
)

CaptchaSchema.plugin(timestamps)

var Captcha;
try {
  Captcha = mongoose.model('Captcha', CaptchaSchema);
} catch(e) {
  Captcha = mongoose.model('Captcha');
}
export default Captcha;

