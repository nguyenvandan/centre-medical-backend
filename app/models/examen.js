import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";
const slug = require("slugify");
const mongoosePaginate = require("mongoose-paginate-v2");

const ConsentementTemplateSchema = new Schema({
  _id: false,
  titre: {
    type: String,
    required: false,
  },
  slugTitre: {
    type: String,
    required: false,
  },
  templateFile: {
    type: String,
    required: false,
  },
},
{
  toObject: { virtuals: true, getters: true },
  toJSON: { virtuals: true, getters: true },
});

const OrdonnanceTemplateSchema = new Schema({
  _id: false,
  titre: {
    type: String,
    required: false,
  },
  slugTitre: {
    type: String,
    required: false,
  },
  templateFile: {
    type: String,
    required: false,
  },
  isForAllergique: {
    type: Boolean,
    default: false,
    required: false,
  },
  isRecommendation: {
    type: Boolean,
    default: false,
    required: false,
  },
},
{
  toObject: { virtuals: true, getters: true },
  toJSON: { virtuals: true, getters: true },
});

const DocumentToUploadSchema = new Schema({
  _id: false,
  titre: {
    type: String,
    required: false,
  },
  slugTitre: {
    type: String,
    required: false,
  },
},
{
  toObject: { virtuals: true, getters: true },
  toJSON: { virtuals: true, getters: true },
});

const ExamenSchema = new Schema(
  {
    name: {
      type: String,
      index: true,
      unique: true,
      required: true,
      trim: true,
    },
    slugName: {
      type: String,
      index: true,
      unique: true,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      index: true,
      required: true,
      trim: true,
    },
    group: {
      type: String,
      index: true,
      required: true,
      trim: true,
    },
    isChildren: {
      type: Boolean,
      index: true,
      required: true,
      default: false,
    },
    ficheInfoFile: {
      type: String,
      required: true,
    },
    ordonnanceTemplate: [OrdonnanceTemplateSchema],
    documentToUpload: [DocumentToUploadSchema],
    questionnaireForm: {
      type: [{ type: Object, required: false, default: {} }],
      default: [{}],
    },
    consentementTemplate: [ConsentementTemplateSchema],
  },
  {
    toObject: { virtuals: true, getters: true },
    toJSON: { virtuals: true, getters: true },
  }
);

ExamenSchema.plugin(timestamps);
ExamenSchema.plugin(mongoosePaginate);


var Examen;
try {
  Examen = mongoose.model('Examen', ExamenSchema);
} catch(e) {
  Examen = mongoose.model('Examen');
}
export default Examen;

