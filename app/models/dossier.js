import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";
const mongoosePaginate = require("mongoose-paginate-v2");

const ConsentementSchema = new Schema({
  _id: false,
  titre: {
    type: String,
    required: false,
  },
  slugTitre: {
    type: String,
    required: false,
  },
  isSigned: {
    type: Boolean,
    required: false,
    default: false,
  },
  file: {
    type: String,
    required: false,
    default: '',
  },
  templateFile: {
    type: String,
    required: false,
    default: '',
  },
},
{
  toObject: { virtuals: true, getters: true },
  toJSON: { virtuals: true, getters: true },
});

const DocumentUploadedSchema = new Schema({
  _id: false,
  titre: {
    type: String,
    required: false,
  },
  slugTitre: {
    type: String,
    required: false,
  },
  file: {
    type: String,
    required: false,
    default: '',
  },
},
{
  toObject: { virtuals: true, getters: true },
  toJSON: { virtuals: true, getters: true },
});

const CouvertureSanteSchema = new Schema({
  noSecuriteSociale:
  {
    type: String,
    default: ''
  },
  status: 
  {
    type: String,
    default: 'new' //new, validated, non_validated
  },
  justificatiDroitTitre: 
  {
    type: String,
    default: ''
  },
  justificatiDroitSlugTitre: 
  {
    type: String,
    default: ''
  },
  justificatifDroitFile: 
  {
    type: String,
    default: ''
  }
},
{
  toObject: { virtuals: true, getters: true },
  toJSON: { virtuals: true, getters: true },
});

const OrdonnanceSchema = new Schema({
  _id: false,
  titre: {
    type: String,
    required: false,
  },
  slugTitre: {
    type: String,
    required: false,
  },
  file: {
    type: String,
    required: false,
    default: '',
  },
  templateFile: {
    type: String,
    required: false,
    default: '',
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

const DossierSchema = new Schema(
  {
    noDossier: {
      type: String,
      index: true,
      unique: true,
      required: true,
      trim: true,
    },
    examenId: {
      type: mongoose.Types.ObjectId,
      required: true,
      index: true,
      ref: "Examen",
    },
    examenCentreId: {
      type: mongoose.Types.ObjectId,
      required: true,
      index: true,
      ref: "ExamenCentre",
    },
    birthdate: {
      type: String,
      index: true,
      required: true,
    },
    firstName: {
      type: String,
      required: false,
      default: ''
    },
    lastName: {
      type: String,
      required: false,
      default: ''
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
          throw new Error({ error: "Email addresse n'est pas validate" });
        }
      },
    },
    dateRDV: {
      type: String,
      required: true,
      /* yyyy/mm/dd:hh:mm */ 
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
    ordonnance: { type: [OrdonnanceSchema], default: undefined },
    documentUploaded: { type: [DocumentUploadedSchema], default: undefined },
    questionnaireForm: {
      type: [{ type: Object, required: false, default: {} }],
      default: [{}],
    },
    questionnaireFile: {
      type: String,
      required: false,
    },
    consentement: { type:[ConsentementSchema], default: undefined },
    couvertureSante: { type: CouvertureSanteSchema, default: {} },
    readyToSign: {
      type: Boolean,
      required: false,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    isClosed: {
      type: Boolean,
      required: false,
      default: false,
    },
    sendRequested: {
      type: Boolean,
      required: false,
      default: false,
    },
    passwordHash: {
      type: String,
      required: true
    }
  },
  {
    toObject: { virtuals: true, getters: true },
    toJSON: { virtuals: true , getters: true},
  }
);
DossierSchema.index(
  { noDossier: 1, examenId: 1, examenCentreId: 1 },
  { unique: true }
);
DossierSchema.plugin(timestamps);
DossierSchema.plugin(mongoosePaginate);


var Dossier;
try {
  Dossier = mongoose.model('Dossier', DossierSchema);
} catch(e) {
  Dossier = mongoose.model('Dossier');
}
export default Dossier;
