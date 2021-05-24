const Joi = require("joi")
  .extend(require("@hapi/joi-date"))
  .extend(require("joi-phone-number"));

import { myJoiObjectId } from "../../../libs/common";

export const dossierIdSchema = Joi.object().keys({
  dossierId: myJoiObjectId().required(),
});

export const createSchema = Joi.object().keys({
  noDossier: Joi.string().min(1).max(50).required(),
  examenId: myJoiObjectId().required(),
  examenCentreId: myJoiObjectId().required(),
  birthdate: Joi.date().format("DD/MM/YYYY").less("now").min("1-1-1800").raw().required(),
  firstName: Joi.string().allow(''),
  lastName: Joi.string().allow(''),
  couvertureSante: Joi.object().keys({ 
    noSecuriteSociale: Joi.string().allow(''),
    status: Joi.string().allow(''),
    justificatiDroitTitre: Joi.string().allow(''),
    justificatiDroitSlugTitre: Joi.string().allow(''),
    justificatifDroitFile: Joi.string().allow('')
  }),
  "couvertureSante.noSecuriteSociale": Joi.string().allow(''),
  "couvertureSante.status": Joi.string().allow(''),
  "couvertureSante.justificatiDroitTitre": Joi.string().allow(''),
  "couvertureSante.justificatiDroitSlugTitre": Joi.string().allow(''),
  "couvertureSante.justificatifDroitFile": Joi.string().allow(''),
  email: Joi.string().email({
    tlds: {
      allow: false,
    },
  }).allow(''),
  dateRDV: Joi.string().required(),
  address: Joi.object({
    street: Joi.string().allow(''),
    zipcode: Joi.string().allow(''),
    city: Joi.string().allow(''),
    country: Joi.string().allow('')
  }),
  ordonnance: Joi.array().items({
    titre: Joi.string().allow(''),
    file: Joi.string().allow(''),
    templateFile: Joi.string().allow(''),
    isForAllergique: Joi.boolean().allow(''),
    isRecommendation: Joi.boolean().allow('')
  }),
  documentUploaded: Joi.array().items({
    titre: Joi.string().allow(''),
    slugTitre: Joi.string().allow(''),
    file: Joi.string().allow('')
  }),
  questionnaireForm: Joi.array().items(),
  questionnaireFile: Joi.string(),
  consentement: Joi.array().items({
    titre: Joi.string().allow(''),
    slugTitre: Joi.string().allow(''),
    isSigned: Joi.boolean(),
    file: Joi.string().allow(''),
    templateFile: Joi.string().allow('')
  }),
  readyToSign: Joi.boolean(),
  isCompleted: Joi.boolean(),
  isClosed: Joi.boolean(),
  loginPrefixLink: Joi.string(),
});

export const loginSchema = Joi.object().keys({
  noDossier: Joi.string().required(),
  birthdate: Joi.date()
    .format("DD/MM/YYYY")
    .less("now")
    .min("1-1-1800")
    .raw()
    .required(),
});

export const updateMeSchema = Joi.object().keys({
  birthdate: Joi.date().format("DD/MM/YYYY").less("now").min("1-1-1800").raw(),
  firstName: Joi.string().allow(''),
  lastName: Joi.string().allow(''),
  phone: Joi.string().phoneNumber(),
  couvertureSante: Joi.object().keys({ 
    noSecuriteSociale: Joi.string().allow(''),
    status: Joi.string().allow(''),
    justificatiDroitTitre: Joi.string().allow(''),
    justificatiDroitSlugTitre: Joi.string().allow(''),
    justificatifDroitFile: Joi.string().allow('')
  }),
  "couvertureSante.noSecuriteSociale": Joi.string().allow(''),
  "couvertureSante.status": Joi.string().allow(''),
  "couvertureSante.justificatiDroitTitre": Joi.string().allow(''),
  "couvertureSante.justificatiDroitSlugTitre": Joi.string().allow(''),
  "couvertureSante.justificatifDroitFile": Joi.string().allow(''),
  email: Joi.string().email({
    tlds: {
      allow: false,
    },
  }).allow(''),
  dateRDV: Joi.string(),
  address: Joi.object({
    street: Joi.string().allow(''),
    zipcode: Joi.string().allow(''),
    city: Joi.string().allow(''),
    country: Joi.string().allow('')
  }),
  ordonnance: Joi.array().items({
    titre: Joi.string().allow(''),
    file: Joi.string().allow(''),
    templateFile: Joi.string().allow(''),
    isForAllergique: Joi.boolean().allow(''),
    isRecommendation: Joi.boolean().allow('')
  }),
  documentUploaded: Joi.array().items({
    titre: Joi.string().allow(''),
    slugTitre: Joi.string().allow(''),
    file: Joi.string().allow('')
  }),
  questionnaireForm: Joi.array().items(),
  questionnaireFile: Joi.string(),
  consentement: Joi.array().items({
    titre: Joi.string().allow(''),
    slugTitre: Joi.string().allow(''),
    isSigned: Joi.boolean(),
    file: Joi.string().allow(''),
    templateFile: Joi.string().allow('')
  }),
  readyToSign: Joi.boolean(),
  isCompleted: Joi.boolean(),
  isClosed: Joi.boolean(),
});

export const updateSchema = Joi.object().keys({
  noDossier: Joi.string().min(1).max(50),
  examenId: myJoiObjectId(),
  examenCentreId: myJoiObjectId(),
  birthdate: Joi.date().format("DD/MM/YYYY").less("now").min("1-1-1800").raw(),
  firstName: Joi.string().allow(''),
  lastName: Joi.string().allow(''),
  phone: Joi.string().phoneNumber(),
  couvertureSante: Joi.object().keys({ 
    noSecuriteSociale: Joi.string().allow(''),
    status: Joi.string().allow(''),
    justificatiDroitTitre: Joi.string().allow(''),
    justificatiDroitSlugTitre: Joi.string().allow(''),
    justificatifDroitFile: Joi.string().allow('')
  }),
  "couvertureSante.noSecuriteSociale": Joi.string().allow(''),
  "couvertureSante.status": Joi.string().allow(''),
  "couvertureSante.justificatiDroitTitre": Joi.string().allow(''),
  "couvertureSante.justificatiDroitSlugTitre": Joi.string().allow(''),
  "couvertureSante.justificatifDroitFile": Joi.string().allow(''),
  email: Joi.string().email({
    tlds: {
      allow: false,
    },
  }).allow(''),
  dateRDV: Joi.string(),
  address: Joi.object({
    street: Joi.string().allow(''),
    zipcode: Joi.string().allow(''),
    city: Joi.string().allow(''),
    country: Joi.string().allow('')
  }),
  ordonnance: Joi.array().items({
    titre: Joi.string().allow(''),
    file: Joi.string().allow(''),
    templateFile: Joi.string().allow(''),
    isForAllergique: Joi.boolean().allow(''),
    isRecommendation: Joi.boolean().allow('')
  }),
  documentUploaded: Joi.array().items({
    titre: Joi.string().allow(''),
    slugTitre: Joi.string().allow(''),
    file: Joi.string().allow('')
  }),
  questionnaireForm: Joi.array().items(),
  questionnaireFile: Joi.string(),
  consentement: Joi.array().items({
    titre: Joi.string().allow(''),
    slugTitre: Joi.string().allow(''),
    isSigned: Joi.boolean(),
    file: Joi.string().allow(''),
    templateFile: Joi.string().allow('')
  }),
  readyToSign: Joi.boolean(),
  isCompleted: Joi.boolean(),
  sendRequested: Joi.boolean(),
  isClosed: Joi.boolean()
});

export const registerschema = Joi.object().keys({
  firstName: Joi.string().allow(''),
  lastName: Joi.string().allow(''),
  currentDate: Joi.string(),
  captcha: Joi.string().allow(''),
  phone: Joi.string().phoneNumber(),
  email: Joi.string().email({
    tlds: {
      allow: false,
    },
  }).allow(''),
  couvertureSante: Joi.object().keys({ 
    noSecuriteSociale: Joi.string().allow(''),
    status: Joi.string().allow(''),
    justificatiDroitTitre: Joi.string().allow(''),
    justificatiDroitSlugTitre: Joi.string().allow(''),
    justificatifDroitFile: Joi.string().allow('')
  }),
  "couvertureSante.noSecuriteSociale": Joi.string().allow(''),
  "couvertureSante.status": Joi.string().allow(''),
  "couvertureSante.justificatiDroitTitre": Joi.string().allow(''),
  "couvertureSante.justificatiDroitSlugTitre": Joi.string().allow(''),
  "couvertureSante.justificatifDroitFile": Joi.string().allow(''),
  address: Joi.object({
    street: Joi.string().allow(''),
    zipcode: Joi.string().allow(''),
    city: Joi.string().allow(''),
    country: Joi.string().allow('')
  }),
});

export const answerschema = Joi.object().keys({
  questionnaireForm: Joi.array().items()
});
