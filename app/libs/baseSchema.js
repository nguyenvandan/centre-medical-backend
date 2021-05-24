import Joi from 'joi';
import { myJoiObjectId } from '../libs/common';

export const UUIDSchema = Joi.string()
  .guid({ version: 'uuidv4' })
  .label('id')
  .required();

export const getListSchema = Joi.object().keys({
  offset: Joi.number()
    .allow('')
    .min(0)
    .max(100),
  limit: Joi.number()
    .allow('')
    .min(1)
    .max(100),
  options: Joi.string()
    .allow('')
    .min(0)
    .max(50),
  nodeId: myJoiObjectId().allow('')
});
