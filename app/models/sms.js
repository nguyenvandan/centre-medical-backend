import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const SMSSchema = new Schema({
  to: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: false,
  },
  message: {
    type: String,
    required: true,
  },
});

SMSSchema.plugin(timestamps);


var SMS;
try {
  SMS = mongoose.model('SMS', SMSSchema);
} catch(e) {
  SMS = mongoose.model('SMS');
}
export default SMS;

