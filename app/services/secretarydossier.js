import SecretaryDossier from "../models/secretarydossier";

// CREATE
export async function create(data) {
  try {
    let secretaryDossier = await SecretaryDossier.create(data);
    return secretaryDossier.toObject();
  } catch (err) {
    throw err;
  }
}

// PUT
export async function updateById({ _id, data }) {
  try {
    let secretaryDossier = await SecretaryDossier.findByIdAndUpdate({ _id, data,
      new: true,
      omitUndefined: true,
    }).lean();
    return secretaryDossier;
  } catch (err) {
    throw err;
  }
}

// GET
export async function findById({ _id }) {
  try {
    return await SecretaryDossier.findById(_id).lean();
  } catch (err) {
    throw err;
  }
}

export async function findByDossierId({ _dossier_id }) {
    try {
    return await SecretaryDossier.findOne({dossierId: _dossier_id}).lean();
    } catch (err) {
      throw err;
    }
  }
