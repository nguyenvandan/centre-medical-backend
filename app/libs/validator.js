import Joi from 'joi';
import { Base64 } from 'js-base64';

const validatorBody = schema => {
  return async (req, res, next) => {
    const result = schema.validate(req.body);
    if (result.error) {
      return res.badRequest(result.error.message);
    }
    return next();
  };
};

const validatorQuery = schema => {
  return async (req, res, next) => {
    const result = schema.validate(req.query);
    if (result.error) {
      return res.badRequest(result.error.message);
    }
    return next();
  };
};
const validatorParams = schema => {
  return async (req, res, next) => {
    const result = schema.validate(req.params);
    if (result.error) {
      return res.badRequest(result.error.message);
    }
    return next();
  };
};

const validatorQueryObject = schema => {
  return async (req, res, next) => {
    const { object } = req.query;
    let queries;
    try {
      queries = await Base64.decode(object);
      queries = await JSON.parse(queries);
    } catch (error) {
      return res.badRequest(error);
    }
    const result = schema.validate(queries);
    if (result.error) {
      return res.badRequest(result.error.message);
    }
    req.queries = queries;
    return next();
  };
};

module.exports = {
  validatorBody,
  validatorQuery,
  validatorParams,
  validatorQueryObject
};
