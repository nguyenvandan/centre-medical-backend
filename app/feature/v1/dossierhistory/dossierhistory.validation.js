const Joi = require("joi").extend(require("@hapi/joi-date"));

import { myJoiObjectId } from "../../../libs/common";

export const dossierHistoryIdSchema = Joi.object().keys({
  dossierHistoryId: myJoiObjectId().required(),
});

export const createSchema = Joi.object().keys({
  dossierId: Joi.string().required(),
  actor: Joi.string().required(),
  action: Joi.string().required(),
  actorType: Joi.string().required(),
});
