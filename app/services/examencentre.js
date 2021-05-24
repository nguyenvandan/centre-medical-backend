import ExamenCentre from "../models/examencentre";

// CREATE
export async function create(data) {
  const examenCentre = await ExamenCentre.create(data);
  return examenCentre;
}

// GET
export async function getList() {
  try {
    return await ExamenCentre.find().lean().select('name');;
  } catch (err) {
    throw err;
  }
}

export async function findById({ _id }) {
  const examenCentre = await ExamenCentre.findById(_id).lean();
  return examenCentre;
}

// UPDATE
export async function updateById({ _id, data }) {
  const examenCentre = await ExamenCentre.findByIdAndUpdate(_id, data, {
    new: true,
    omitUndefined: true,
  }).lean();
  return examenCentre;
}
