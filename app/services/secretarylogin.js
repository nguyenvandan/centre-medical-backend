import SecretaryLogin from "../models/secretarylogin";

// ------------------- CREATE  ---------------------------------
export async function create(data) {
  try {
    const secretaryLoginObj = await SecretaryLogin.create(data);
    return secretaryLoginObj.toObject();
  } catch (err) {
    throw err;
  }
}

// ------------------- GET  ---------------------------------
export async function findBySecretaryId({ secretaryId }) {
  try {
    return await SecretaryLogin.findOne({ secretaryId: secretaryId }).lean();
  } catch (err) {
    throw err;
  }
}
export async function findBySecretaryIdAndStatut({ secretaryId, isLogin }) {
  try {
    return await SecretaryLogin.findOne({ secretaryId: secretaryId, isLogin: isLogin }).lean();
  } catch (err) {
    throw err;
  }
}

// ------------------- PUT  ---------------------------------
export async function updateBySecretaryId({ secretaryId, fullname, isLogin }) {
  try {
    return await SecretaryLogin.findOneAndUpdate({ secretaryId: secretaryId }, { isLogin: isLogin, fullname: fullname }, {
      new: true,
      upsert: true,
      omitUndefined: true,
    }).lean();
  } catch (err) {
    throw err;
  }
}
