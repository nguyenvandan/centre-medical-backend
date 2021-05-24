import DossierLogin from "../models/dossierlogin";

// ------------------- CREATE  ---------------------------------
export async function create(data) {
  try {
    const dossierLoginObj = await DossierLogin.create(data);
    return dossierLoginObj.toObject();
  } catch (err) {
    throw err;
  }
}

// ------------------- GET  ---------------------------------
export async function findByDossierId({ dossierId }) {
  try {
    return await DossierLogin.findOne({ dossierId: dossierId }).lean();
  } catch (err) {
    throw err;
  }
}
export async function findByDossierIdAndStatut({ dossierId, isLogin }) {
  try {
    return await DossierLogin.findOne({ dossierId: dossierId, isLogin: isLogin }).lean();
  } catch (err) {
    throw err;
  }
}

// ------------------- PUT  ---------------------------------
export async function updateByDossierId({ dossierId, noDossier = "", fullname = "", isLogin }) {
  try {
    let data = { isLogin: isLogin }
    if (noDossier) {
      Object.assign(data, { noDossier: noDossier })
    }
    if (fullname) {
      Object.assign(data, { fullname: fullname })
    }
    return await DossierLogin.findOneAndUpdate({ dossierId: dossierId }, data, {
      new: true,
      upsert: true,
      omitUndefined: true,
    }).lean();
  } catch (err) {
    throw err;
  }
}
