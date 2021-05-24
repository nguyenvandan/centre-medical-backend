import Examen from "../models/examen";
const logger = require("../libs/logger");
const slug = require("slugify");

// CREATE
export async function create(data) {
  try {
    await setAllSlugFields({_examen: data});
    let examen = await Examen.create(data);
    return examen.toObject();
  } catch (err) {
    throw err;
  }
}

// GET
export async function findById({ _id }) {
  try {
    return await Examen.findById(_id).lean();
  } catch (err) {
    throw err;
  }
}

export async function getList() {
  try {
    return await Examen.find().lean().select('name slugName group code isChildren');;
  } catch (err) {
    throw err;
  }
}

// UPDATE
export async function updateById({ _id, data }) {
  try {
    await setAllSlugFields({_examen: data});
    return await Examen.findByIdAndUpdate(_id, data, {
      new: true,
      omitUndefined: true,
    }).lean();
  } catch (err) {
    throw err;
  }
}

export async function setAllSlugFields({ _examen }) {
  if (_examen) {
    let identity =
      _examen.name && _examen.name != null ? { name: _examen.name } : {};

    // set slug for slugName
    if (_examen.slugName && _examen.slugName != null) {
      _examen.slugName = slug(_examen.slugName.toLowerCase())
    }

    // set slugTitre for all consentementTemplate
    if (
      _examen.consentementTemplate &&
      Array.isArray(_examen.consentementTemplate)
    ) {
      logger.info(identity, "Start setting slugTitre for consentenent");
      _examen.consentementTemplate.forEach((element) => {
        if (element.titre && element.titre != null) {
          element.slugTitre = slug(element.titre.toLowerCase());
        }
      });
      logger.info(identity, "End setting slugTitre for consentenent");
    }
    // set slugTitre for all documentToUpload
    if (_examen.documentToUpload && Array.isArray(_examen.documentToUpload)) {
      logger.info(identity, "Start setting slugTitre for documentToUpload");
      _examen.documentToUpload.forEach((element) => {
        if (element.titre && element.titre != null) {
          element.slugTitre = slug(element.titre.toLowerCase());
        }
      });
      logger.info(identity, "End setting slugTitre for documentToUpload");
    }
    // set slugTitre for all ordonnanceTemplate
    if (
      _examen.ordonnanceTemplate &&
      Array.isArray(_examen.ordonnanceTemplate)
    ) {
      logger.info(identity, "Start setting slugTitre for ordonnanceTemplate");
      _examen.ordonnanceTemplate.forEach((element) => {
        if (element.titre && element.titre != null) {
          element.slugTitre = slug(element.titre.toLowerCase());
        }
      });
      logger.info(identity, "End setting slugTitre for ordonnanceTemplate");
    }
  }
}
