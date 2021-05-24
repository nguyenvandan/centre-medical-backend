import * as dossierHistoryServices from "../../../services/dossierhistory";
import * as err from "../../../libs/error";

// CREATE
export async function createDossierAction(req, res) {
  try {
    let data = req.body;
    data.dossierId = req.dossierId;
    data.actorType = "patient";
    let dossierHistoryCreated = await dossierHistoryServices.create(data);
    return res.ok({ dossierhistory: dossierHistoryCreated });
  } catch (error) {
    return res.badRequest(error.message);
  }
}

export async function createSecretaryAction(req, res) {
  try {
    let data = req.body;
    data.actorType = "secretaire";
    let dossierHistoryCreated = await dossierHistoryServices.create(data);
    return res.ok({ dossierhistory: dossierHistoryCreated });
  } catch (error) {
    return res.badRequest(error.message);
  }
}

// GET
export async function me(req, res) {
  const dossierId = req.dossierId;
  if (!dossierId) {
    return res.badRequest(err.id_empty("dossier"));
  }
  const historyObj = await dossierHistoryServices.findManyByDossierId({
    _dossier_id: dossierId,
  });
  if (!historyObj) return res.badRequest(err.id_wrong("dossier"));
  return res.ok({ history: historyObj });
}

export async function getManyByDossierId(req, res) {
  const { dossierId } = req.params;
  if (!dossierId) {
    return res.badRequest(err.id_empty("dossier"));
  }
  const historyObj = await dossierHistoryServices.findManyByDossierId({
    _dossier_id: dossierId,
  });
  if (!historyObj) return res.badRequest(err.id_wrong("dossier"));
  return res.ok({ history: historyObj });
}
