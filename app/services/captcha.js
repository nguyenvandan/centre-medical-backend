import Captcha from "../models/captcha";

// ------------------- CREATE  ---------------------------------
export async function create(data) {
  try {
    const captchaObj = await Captcha.create(data);
    return captchaObj.toObject();
  } catch (err) {
    throw err;
  }
}

// ------------------- GET  ---------------------------------
export async function findByDossierId({ dossierId }) {
  try {
    return await Captcha.findOne({ dossierId: dossierId }).lean();
  } catch (err) {
    throw err;
  }
}
export async function findByDossierIdAndCaptcha({ dossierId, captcha }) {
  try {
    return await Captcha.findOne({ dossierId: dossierId, captcha: captcha }).lean();
  } catch (err) {
    throw err;
  }
}

// ------------------- PUT  ---------------------------------
export async function updateByDossierId({ dossierId, captcha }) {
  try {
    let data = { dossierId: dossierId,  captcha: captcha}
    return await Captcha.findOneAndUpdate({ dossierId: dossierId }, data, {
      new: true,
      upsert: true,
      omitUndefined: true,
    }).lean();
  } catch (err) {
    throw err;
  }
}
