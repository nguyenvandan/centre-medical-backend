"use strict";

const newSecretaryObj = {
  username: "secretary@medika.fr",
  password: "secret",
  firstName: "firstname",
  lastName: "lastname",
};

const newDossierObj = {
  noDossier: "123456789",
  birthdate: "20/10/1990",
  firstName: "firstname",
  lastName: "lastname",
  phone: "0606070708",
  dateRDV: "2020-12-03T15:14:06.172Z",
};

const newExamenObj = {
  name: "SCANNER VOLUME GASTRIQUE SCANNER",
  slugName: "scanner-volume-gastrique-scanner",
  code: "SCANNER",
  group: "SCANNER VOLUME GASTRIQUE",
  isChildren: false,
  ficheInfoFile: `documents_examen/${slugName}/fiche_info/${slugName}.pdf`,
  ordonnanceTemplate: [
    {
      titre: "Ordonnance scanner volume gastrique",
      templateFile: `documents_examen/${slugName}/ordonnance_template/${slugName}.pdf`,
    },
    {
      titre: "Ordonnance si allergie",
      templateFile: `documents_examen/${slugName}/ordonnance_template/patients-allergiques.pdf`,
      isForAllergique: true,
    },
  ],
  documentToUpload: [
    {
      titre: "Ordonnance de mon medecin",
    },
  ],
  questionnaireForm: [
    {
      anstype: "checkbox",
      q: "Etes-vous enceinte ou susceptible de l'être? Allaitez-vous?",
      ansVal: "",
    },
    {
      anstype: "non",
      q: "Etes-vous allergique ?",
      ansVal: "",
      subQuestion: [
        {
          anstype: "checkbox",
          q: "à certains médicaments ou pommades, ou êtes-vous asthmatique ?",
          ansVal: "",
        },
        {
          anstype: "checkbox",
          q: "avez-vous mal toléré un examen radiologique ?",
          ansVal: "",
        },
      ],
    },
    {
      anstype: "checkbox",
      q: "Etes-vous diabétique ?",
      ansVal: "",
      subQuestion: [
        {
          anstype: "checkbox",
          q:
            "Si oui, prenez-vous des biguanides (Glucinan®, Glucophage®, Stagid®) ?",
          ansVal: "",
        },
      ],
    },
    {
      anstype: "checkbox",
      q: "Avez-vous une maladie cardiaque, pulmonaire ou rénale ?",
      ansVal: "",
    },
    {
      anstype: "checkbox",
      q:
        "Avez-vous eu récemment une radiographie de l’estomac, de l’intestin ou du côlon ?",
      ansVal: "",
    },
    {
      anstype: "textarea",
      q:
        "D’une manière générale, n’hésitez pas à fournir tout renseignement qui vous paraîtrait important à communiquer et à nous *            informer de toute maladie sérieuse",
      ansVal: "",
    },
  ],
  consentementTemplate: [
    {
      titre: "Consentement éclairé Patient",
      fullTitre: "à la réalisation de l'examen",
      templateFile: `documents_examen/${slugName}/consentement_template/consentement-eclaire-patient.pdf`,
    },
    {
      titre: "Consentement Téléradiologie",
      fullTitre: "à la réalisation d'un acte de Télé radiologie",
      templateFile: `documents_examen/${slugName}/consentement_template/consentement-teleradiologie.pdf`,
    },
  ],
};

const newExamenCentreObj = {
  name: "Clinique Claude Bernard",
  phone: "0130723330",
  email: "contact@gmail.com",
  address: {
    street: "9 avenue Louis armand",
    zipcode: "95120",
    city: "Ermont",
  },
  accueil: "du lundi au dimanche de 8h à 9h",
};

let examenId = null;
let examenCentreId = null;

/**
 * Init database for testing
 */
module.exports.createSecretary = async (request) => {
  let response = await request.post(`/api/v1/secretary`).send(newSecretaryObj);
  return JSON.parse(response.text);
};

module.exports.signInSecretary = async (request) => {
  let response = await request.post(`/api/v1/secretary/login`).send({
    username: newSecretaryObj.username,
    password: newSecretaryObj.password,
  });
  return response.body.data.token;
};

module.exports.createDossier = async (request, token) => {
  newDossierObj.examenId = examenId;
  newDossierObj.examenCentreId = examenCentreId;
  let response = await request
    .post(`/api/v1/dossier`)
    .set("Authorization", "Bearer " + token)
    .send(newDossierObj);
  return JSON.parse(response.text);
};

module.exports.signInDossier = async (request) => {
  let response = await request.post(`/api/v1/dossier/login`).send({
    noDossier: newDossierObj.noDossier,
    birthdate: newDossierObj.birthdate,
  });
  return response.body.data.token;
};

module.exports.createExamen = async (request, token) => {
  let response = await request
    .post(`/api/v1/examen`)
    .set("Authorization", "Bearer " + token)
    .send(newExamenObj);
  let responseText = JSON.parse(response.text);
  examenId = responseText.data.examen._id;
  return responseText;
};

module.exports.createExamenCentre = async (request, token) => {
  let response = await request
    .post(`/api/v1/examencentre`)
    .set("Authorization", "Bearer " + token)
    .send(newExamenCentreObj);
  let responseText = JSON.parse(response.text);
  examenCentreId = responseText.data.examencentre._id;
  return responseText;
};
