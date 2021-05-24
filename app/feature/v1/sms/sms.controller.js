import * as err from "../../../libs/error";
import * as smsServices from "../../../services/sms";
import * as dossierHistoryServices from "../../../services/dossierhistory";
import * as dossierServices from "../../../services/dossier";


const logger = require("../../../libs/logger");

// SMS login invitation
export async function sendLoginInvitation(req, res) {
  const { link, dossierId} = req.body;
  if (!link || !dossierId) return res.badRequest(err.is_required('link and dossierId'));

  let phoneNumber = await dossierServices.getPhonefindByDossierId(dossierId);

  // send sms invitation
  let sms = await smsServices.sendLoginInvitation(phoneNumber, link);
  if (!sms) return res.badRequest(err.input_incorrect);

  dossierHistoryServices.create({
    dossierId: dossierId,
    actor: req.fullname,
    action: "Secrétaire a envoyé SMS au patient pour lui demander de mettre à jour son dossier",
    actorType: "secretaire",
  });
  return res.ok({ sms: sms });
}
