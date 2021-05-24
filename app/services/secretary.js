import Secretary from "../models/secretary";

// CREATE
export async function create(data) {
  const secretary = await Secretary.create(data);
  return secretary;
}

// GET
export async function findById({ _id }) {
  const secretary = await Secretary.findById(_id).lean();
  return secretary;
}

export async function findByCredentials(username) {
  try {
    return await Secretary.findOne({ username: username }).lean();
  } catch (err) {
    throw err;
  }
}
