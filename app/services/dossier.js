const logger = require("../libs/logger");
const fs = require('fs');
const slug = require("slugify");

const { jsPDF } = require("jspdf");
import "jspdf-autotable";

import Dossier from "../models/dossier";
import * as fileServices from "./file";
import config from "../config";











// ----------------------------- CREATE  ---------------------------------
export async function create(data) {
  try {
    const dossier = await Dossier.create(data);
    let dossierCreated = dossier.toObject();
    delete dossierCreated.passwordHash;
    return dossierCreated;
  } catch (err) {
    throw err;
  }
}

const weekdays = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

//  generate ordonnance file from template
export const gennerateOrdonnance = async ({ dossier, currentDate }) => {
  logger.info("Start generate ordonnances");
  try {
    let dateRDVText = "";
    let birthdayArr = dossier.birthdate.split("/"); // birthday: dd/mm/yyyy
    let today = getTodayText(currentDate);
    if (
      dossier.dateRDV &&
      dossier.dateRDV.split(":") &&
      dossier.dateRDV.split(":")[0].split("/")
    ) {
      let dArr = dossier.dateRDV.split(":")[0].split("/");
      let yyyy = dArr[0];
      let mm = dArr[1];
      let dd = dArr[2];
      let hh = dossier.dateRDV.split(":")[1];
      let mn = dossier.dateRDV.split(":")[2];
      let dateObj = new Date(Date.UTC(yyyy, mm - 1, dd, hh, mn, 0));
      dateRDVText = `${hh}h${mn} ${weekdays[dateObj.getDay()]} le ${dd}/${mm}/${yyyy}`;
    }
    let fieldMappings = {
      fullname: `${dossier.firstName} ${dossier.lastName}`,
      daterdv: dateRDVText,
      "birthday": birthdayArr[0] + " / " + birthdayArr[1] + " / " + birthdayArr[2],
      "ordo.day": today.dd,
      "ordo.month": today.mm,
      "ordo.year": today.yyyy,
    };
    let promiseArr = [];

    if (dossier.ordonnance && dossier.ordonnance.length) (
      dossier.ordonnance.forEach(e => {
        promiseArr.push(
          fileServices.fillPDFForm({
            templateFilePath: e.templateFile,
            outputFilePath: `${config.file.patientRoot}/${dossier.noDossier}/${config.file.patientOrd}/${e.slugTitre}.pdf`,
            fieldMappings,
          })
        );
      })
    )
    return await Promise.all(promiseArr);
  } catch (err) {
    throw err;
  }
};

// format date time text for consentement
export const getTodayText = (currentDate /* yyyy/mm/dd:hh:mm */) => {
  let today = {};
  if (currentDate.split(":") && currentDate.split(":")[0].split("/")) {
    let dArr = currentDate.split(":")[0].split("/");
    today.yyyy = dArr[0];
    today.mm = dArr[1];
    today.dd = dArr[2];
    today.hh = currentDate.split(":")[1];
    today.mn = currentDate.split(":")[2];
    // for server, must use Date.UTC function
    let dateObj = new Date(Date.UTC(today.yyyy, today.mm - 1, today.dd, today.hh, today.mn, 0));
    today.todayText = `${today.hh}h${today.mn} ${weekdays[dateObj.getDay()]} le ${today.dd}/${today.mm}/${today.yyyy}`;
  }
  return today;
};

// generate consentements file from template
export const gennerateConsentements = async ({
  dossier,
  currentDate /* yyyy/mm/dd:hh:mm */,
}) => {
  logger.info(`DossierId ${dossier._id}: Start generate consentements`);
  try {
    let address = dossier.address || {};
    let birthdayArr = dossier.birthdate.split("/"); // birthday: dd/mm/yyyy
    let today = getTodayText(currentDate);

    let fieldMappings = {
      fullname: `${dossier.firstName} ${dossier.lastName}`,
      street1: address.street.substring(0, 80),
      street2: address.street.substring(80),
      zipcode: address.zipcode,
      city: address.city,
      "birthdate.day": birthdayArr[0],
      "birthdate.month": birthdayArr[1],
      "birthdate.year": birthdayArr[2],
      "birthday": birthdayArr[0] + " / " + birthdayArr[1] + " / " + birthdayArr[2],
      "sign.city": address.city,
      "sign.day": today.dd,
      "sign.month": today.mm,
      "sign.year": today.yyyy,
    };

    let promiseArr = [];
    if (dossier.consentement && dossier.consentement.length) {
      dossier.consentement.forEach(e => {
        promiseArr.push(
          fileServices.fillPDFForm({
            templateFilePath: e.templateFile,
            outputFilePath: `${config.file.patientRoot}/${dossier.noDossier}/${config.file.patientCons}/${e.slugTitre}.pdf`,
            fieldMappings,
          })
        );
      });
    }
    return await Promise.all(promiseArr);
  } catch (err) {
    throw err;
  }
};

//  sign consentement
export const signConsentement = async ({
  dossier,
  currentDate /* yyyy/mm/dd:hh:mm */,
  slugTitre,
}) => {
  logger.info(`DossierId ${dossier._id}: Start sign consentement`);
  try {
    let address = dossier.address || {};
    let birthdayArr = dossier.birthdate.split("/");
    let fullname = `${dossier.firstName} ${dossier.lastName}`;
    let today = getTodayText(currentDate);

    let fieldMappings = {
      fullname: fullname,
      street1: address.street.substring(0, 80),
      street2: address.street.substring(80),
      zipcode: address.zipcode,
      city: address.city,
      "birthdate.day": birthdayArr[0],
      "birthdate.month": birthdayArr[1],
      "birthdate.year": birthdayArr[2],
      "birthday": birthdayArr[0] + " / " + birthdayArr[1] + " / " + birthdayArr[2],
      "sign.city": address.city,
      "sign.day": today.dd,
      "sign.month": today.mm,
      "sign.year": today.yyyy,
      signature: `Signature numérique de\n${fullname}\nau ` + today.todayText,
    };

    let idx = dossier.consentement.findIndex(e => e.slugTitre === slugTitre);
    if (idx > -1) {
      let consObj = dossier.consentement[idx];
      if (consObj) {
        return await fileServices.fillPDFForm({
          templateFilePath: consObj.templateFile,
          outputFilePath: `${config.file.patientRoot}/${dossier.noDossier}/${config.file.patientCons}/${slugTitre}.pdf`,
          fieldMappings,
        });
      }
    }
  } catch (err) {
    throw err;
  }
};
// ---------------------------------------------------------------------------------
























// ---------------------------- DELETE  ------------------------------------------
export async function deleteById(dossierId) {
  try {
    let dossier = await Dossier.deleteOne({ _id: dossierId });
    return dossier;
  } catch (err) {
    throw err;
  }
}
// ---------------------------------------------------------------------------------










// --------------------------- GET  ----------------------------------------
export async function getPhonefindByDossierId(dossierId) {
  try {
    let dossier = await Dossier.findById(dossierId).select("phone").lean();
    return dossier.phone;
  } catch (err) {
    throw err;
  }
}

export async function findById({ _id }) {
  try {
    return await Dossier.findById(_id).lean();
  } catch (err) {
    throw err;
  }
}

export async function getFullDossierById(dossierId) {
  try {
    return await Dossier.findOne({ _id: dossierId })
      .populate("examenId")
      .populate("examenCentreId")
      .lean();
  } catch (err) {
    throw err;
  }
}

export async function getList({
  offset = 0,
  limit = 10,
  options = "",
  condt = {},
} = {}) {
  var params = {
    lean: true,
    offset: offset,
    limit: limit,
  };
  if (options == 'full') {
    Object.assign(params, { populate: 'examenId examenCentreId' });
  }
  try {
    return await Dossier.paginate(condt, params);
  } catch (err) {
    throw err;
  }
}

export async function findByCredentials(noDossier) {
  try {
    return await Dossier.findOne(
      { noDossier: noDossier },
      "_id noDossier birthdate firstName lastName phone email address passwordHash"
    ).lean();
  } catch (err) {
    throw err;
  }
}

export async function getRegisterInfo(dossierId) {
  try {
    return await Dossier.findOne({ _id: dossierId })
      .select("firstName lastName email address")
      .lean();
  } catch (err) {
    throw err;
  }
}
// ---------------------------------------------------------------------------------














// --------------------------------------- PUT  -------------------------------------
export async function updateById({ _id, data }) {
  try {
    let updatedDossier = await Dossier.findByIdAndUpdate(_id, data, {
      new: true,
      omitUndefined: true,
    }).lean();
    return updatedDossier;
  } catch (err) {
    throw err;
  }
}

// add document required upload link
export async function addUploadedDocById({ dossierId, data }) {
  try {
    let updatedDossier = await Dossier.findOneAndUpdate(
      {
        _id: dossierId,
        documentUploaded: {
          $elemMatch: {
            slugTitre: data.slugTitre,
          },
        },
      },
      {
        "documentUploaded.$.file": data.file,
      },
      {
        new: true,
        omitUndefined: true,
      }
    ).lean();

    if (updatedDossier && updatedDossier._id) {
      logger.info(
        { dossierId: dossierId },
        "A document has been added to the dossier",
        { document: data.file }
      );
      return updatedDossier;
    } else {
      throw new Error(
        `Le document '${data.slugTitre}' n'est pas attendu par votre centre medical`
      );
    }
  } catch (err) {
    throw err;
  }
}
// ---------------------------------------------------------------------------------












// ------------------- BUSINESS LOGIC - Check status of dossier  ---------------------------------
// check if all required question answered
export const isAllReqQAnswered = (questions) => {
  let isAllAnswered = "y"; // just put any string but not empty ""
  questions.forEach(e => {
    if (["checkbox", "textarea"].includes(e.anstype) && e.ansrequired) {
      isAllAnswered = isAllAnswered && e.ansVal;
    }
    if (e.subQuestion) {
      e.subQuestion.forEach(subE => {
        if (subE.ansrequired) {
          isAllAnswered = isAllAnswered && subE.ansVal;
        }
      });
    }
  });
  return isAllAnswered;
};
// check if all required document are uploaded
export const isAllDocUploaded = (dossier) => {
  let docs = dossier.documentUploaded;
  let isAllUploaded = "y"; // just put any string but not empty ""
  if (docs && Array.isArray(docs)) {
    docs.forEach(e => {
      isAllUploaded = isAllUploaded && e.file;
    });
  }
  return isAllUploaded;
};

// check if all consentement had generated
export const isAllConsentementGenerated = (dossier) => {
  let docs = dossier.consentement;
  let isAllGenerated = "y"; // just put any string but not empty ""
  if (docs && Array.isArray(docs)) {
    docs.forEach(e => {
      isAllGenerated = isAllGenerated && e.file;
    });
  }
  return isAllGenerated;
};

// check if all consentement are generated
export const isAllOrdonnanceGenerated = (dossier) => {
  let docs = dossier.ordonnance;
  let isAllGenerated = "y"; // just put any string but not empty ""
  if (docs && Array.isArray(docs)) {
    docs.forEach(e => {
      isAllGenerated = isAllGenerated && e.file;
    });
  }
  return isAllGenerated;
};

// check if all consentement are generated
export const isReadyForSign = async (dossier) => {
  return (
    isAllReqQAnswered(dossier.questionnaireForm) &&
    isAllConsentementGenerated(dossier) &&
    isAllOrdonnanceGenerated(dossier) &&
    isAllDocUploaded(dossier)
  );
};

// check if all consentement are signed -> dossier is completed
export const isAllConsentementSigned = async (dossier) => {
  let docs = dossier.consentement;
  let isAllSigned = "y"; // just put any string but not empty ""
  if (docs && Array.isArray(docs)) {
    docs.forEach(e => {
      isAllSigned = isAllSigned && e.isSigned;
    });
  }
  return isAllSigned;
};


// generate questionnaire to pdf file
export const generateQuestionnaireFile = async (dossier) => {
  try {
    let doc = new jsPDF("l");

    let head = [{ question: "Question", response: "Réponse" }];
    let body = [];
    let textareaQ = null;

    doc.setFontSize(18);
    doc.setFont("Roboto-Regular", "bold");
    doc.text(`NOM / Prénom : `, 14, 16);
    doc.setFont("Roboto-Regular", "normal");
    doc.text(`${dossier.firstName} ${dossier.lastName}`, 65, 16);
    doc.setFont("Roboto-Regular", "bold");
    doc.text(`Questionnaire avant examen :`, 105, 30);

    // build body
    dossier.questionnaireForm.forEach(e => {
      if (e.anstype === "textarea") {
        textareaQ = e;
      } else {
        body.push({
          question: e.q,
          response: e.ansVal,
        });
      }
      if (e.subQuestion) {
        e.subQuestion.forEach((subE) => {
          body.push({
            question: "- " + subE.q,
            response: subE.ansVal,
          });
        });
      }
    });
    // Create table
    doc.autoTable({
      head: head,
      body: body,
      startY: 35,
      rowPageBreak: "auto",
      bodyStyles: { valign: "top" },
    });

    // Write the last text area question/answer
    if (textareaQ) {
      let finalY = doc.lastAutoTable.finalY;
      doc.setFontSize(10);
      doc.setFont("Roboto-Regular", "bold");
      doc.text(`${textareaQ.q} :`, 14, finalY + 15);
      doc.setFont("Roboto-Regular", "normal");
      let pageSize = doc.internal.pageSize;
      let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
      let text = doc.splitTextToSize(textareaQ.ansVal, pageWidth - 35, {});
      doc.text(text, 14, finalY + 20);
    }

    let pdfDirectory = `${config.file.patientRoot}/${dossier.noDossier}/${config.file.patientQForm}`;
    fs.existsSync(pdfDirectory) || fs.mkdirSync(pdfDirectory)

    let path = `${pdfDirectory}/questionnaire.pdf`;
    doc.save(path);

    return path;
  } catch (err) {
    throw err;
  }
};
