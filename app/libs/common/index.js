
import Joi from "joi";
import JoiObjectId from "joi-objectid";

export const myJoiObjectId = JoiObjectId(Joi);

export const syncMiddleware = (fn) => (req, res, next) => { 
  return Promise.resolve(fn(req, res, next)).catch(err => next(err));
}