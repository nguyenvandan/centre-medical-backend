import DossierHistory from "../models/dossierhistory";

// CREATE
export const create = async(data) => await DossierHistory.create(data);
export const createMany = async(arrayData) => await DossierHistory.insertMany(arrayData);

// GET
export const findById = async ({ _id }) => await DossierHistory.findById(_id).lean();
export const findManyByDossierId = async ({ _dossier_id }) => await DossierHistory.find({dossierId : _dossier_id}).sort({updatedAt: 'desc'}).lean();
