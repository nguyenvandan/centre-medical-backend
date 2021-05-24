const supertest = require("supertest");
import app from "../../../app.js";
const request = supertest(app);
const mongoose = require("mongoose");

const dbHandler = require("../../../config/jest/db-handler.js");
const dbInit = require("../../../config/jest/init-data.js");

import Dossier from "../../../models/dossier";

let expectedDossier = {};
let tokenDossier = null;
let tokenSecretary = null;
let expectedExamen = {};
let expectedExamenCentre = {};
let expectedSecretary = {};
let examenId = null;
let examenCentreId = null;
let dossierId = null;

const dossierObj = {
  noDossier: "1234abcd",
  birthdate: "20/10/1990",
  firstName: "firstname",
  lastName: "lastname",
  phone: "0607080910",
  dateRDV: "2020-12-03T15:14:06.172Z",
};

const dossierUpdateObj = {
  firstName: "Van Dan",
  lastName: "Nguyen",
  couvertureSante: {
    noSecuriteSociale: "185057800608439",
  },
  address: {
    street: "171 avenue Pierre Brossolette",
    zipcode: "94170",
    city: "Le Perreux Sur Marne",
  },
};

beforeAll(async (done) => {
  expectedSecretary = await dbInit.createSecretary(request);
  tokenSecretary = await dbInit.signInSecretary(request);
  expectedExamen = await dbInit.createExamen(request, tokenSecretary);
  expectedExamenCentre = await dbInit.createExamenCentre(
    request,
    tokenSecretary
  );
  expectedDossier = await dbInit.createDossier(request, tokenSecretary);
  tokenDossier = await dbInit.signInDossier(request);
  examenId = expectedExamen.data.examen._id;
  examenCentreId = expectedExamenCentre.data.examencentre._id;
  dossierObj.examenId = examenId;
  dossierObj.examenCentreId = examenCentreId;
  done();
});

afterAll(async (done) => {
  await dbHandler.closeDatabase();
  done();
});

describe("-------------------- DOSSIER MODULE -------------------------- ", () => {
  // --------------------- Post ----------------------
  test("Create dossier", async () => {
    const response = await request
      .post(`/api/v1/dossier`)
      .set("Authorization", "Bearer " + tokenSecretary)
      .send(dossierObj);
    const dossier = await Dossier.findOne({ noDossier: dossierObj.noDossier });
    dossierId = dossier._id;
    expect(dossier.readyToSign).toBe(false);
    expect(dossier.isCompleted).toBe(false);
    expect(response.status).toBe(200);
    expect(dossier).not.toBe(undefined);
    expect(dossier).toHaveProperty("noDossier", dossierObj.noDossier);
    expect(dossier).toHaveProperty(
      "examenId",
      mongoose.Types.ObjectId(examenId)
    );
    expect(dossier).toHaveProperty(
      "examenCentreId",
      mongoose.Types.ObjectId(examenCentreId)
    );
    expect(dossier.questionnaireForm[0].q).toEqual(
      expectedExamen.data.examen.questionnaireForm[0].q
    );
    expect(dossier.documentUploaded[0].titre).toEqual(
      expectedExamen.data.examen.documentToUpload[0].titre
    );
    expect(dossier.ordonnance[0].titre).toEqual(
      expectedExamen.data.examen.ordonnanceTemplate[0].titre
    );
    expect(dossier.ordonnance[0].templateFile).toEqual(
      expectedExamen.data.examen.ordonnanceTemplate[0].templateFile
    );
    expect(dossier.consentement[0].titre).toEqual(
      expectedExamen.data.examen.consentementTemplate[0].titre
    );
    expect(dossier.consentement[0].templateFile).toEqual(
      expectedExamen.data.examen.consentementTemplate[0].templateFile
    );
    expect(dossier.consentement[0].file).toEqual("");
    expect(dossier.consentement[0].slugTitre).toEqual(
      expectedExamen.data.examen.consentementTemplate[0].slugTitre
    );
  });

  test("Create dossier without login: error", async () => {
    const response = await request.post(`/api/v1/dossier`).send(dossierObj);
    expect(response.status).not.toBe(200);
  });

  // --------------------- put ----------------------
  test("Update dossier by patient", async () => {
    const response = await request
      .put(`/api/v1/dossier/me`)
      .set("Authorization", "Bearer " + tokenDossier)
      .send(dossierUpdateObj);
      console.log(response)
    expect(response.status).toBe(200);
    expect(response.body.data.dossier).toHaveProperty(
      "firstName",
      dossierUpdateObj.firstName
    );
    expect(response.body.data.dossier.readyToSign).toBe(false);
    expect(response.body.data.dossier.isCompleted).toBe(false);
  });

  test("Update dossier by patient by wrong login: error", async () => {
    const response = await request
      .put(`/api/v1/dossier/me`)
      .set("Authorization", "Bearer " + tokenSecretary)
      .send(dossierUpdateObj);
    expect(response.status).not.toBe(200);
  });

  test("Update dossier by secretary: successfully", async () => {
    const response = await request
      .put(`/api/v1/dossier/${dossierId}`)
      .set("Authorization", "Bearer " + tokenSecretary)
      .send(dossierUpdateObj);
    expect(response.status).toBe(200);
    expect(response.body.data.dossier).toHaveProperty(
      "lastName",
      dossierUpdateObj.lastName
    );
    expect(response.body.data.dossier.readyToSign).toBe(false);
    expect(response.body.data.dossier.isCompleted).toBe(false);
  });

  test("Update dossier by secretary by wrong login: error", async () => {
    const response = await request
      .put(`/api/v1/dossier/${dossierId}`)
      .set("Authorization", "Bearer " + tokenDossier)
      .send(dossierUpdateObj);
    expect(response.status).not.toBe(200);
  });

  // --------------------- get ----------------------
  test("Get dossier by id by secretary: successfully", async () => {
    const response = await request
      .get(`/api/v1/dossier/${dossierId}`)
      .set("Authorization", "Bearer " + tokenSecretary);
    expect(response.status).toBe(200);
    expect(response.body).not.toBe(undefined);
    expect(response.body.data.dossier).toHaveProperty(
      "noDossier",
      dossierObj.noDossier
    );
  });

  test("Get dossier by id without secretary: error", async () => {
    const response = await request
      .get(`/api/v1/dossier/${dossierId}`)
      .set("Authorization", "Bearer " + tokenDossier);
    expect(response.status).not.toBe(200);
  });

  test("Get me by dossier: successfully", async () => {
    const response = await request
      .get(`/api/v1/dossier/me`)
      .set("Authorization", "Bearer " + tokenDossier);
    expect(response.status).toBe(200);
    expect(response.body).not.toBe(undefined);
    expect(response.body.data.dossier).toHaveProperty(
      "noDossier",
      expectedDossier.data.dossier.noDossier
    );
  });

  test("Get me without dossier: error", async () => {
    const response = await request
      .get(`/api/v1/dossier/me`)
      .set("Authorization", "Bearer " + tokenSecretary);
    expect(response.status).not.toBe(200);
  });

  // --------------------- BUSINESS test ----------------------
  test("dossier become ready to sign and completed: sucessfullly", async () => {
    let response = await request
      .get(`/api/v1/dossier/me`)
      .set("Authorization", "Bearer " + tokenDossier);
    let dossier = response.body.data.dossier;
    expect(dossier.readyToSign).toBe(false);
    expect(dossier.isCompleted).toBe(false);

    // register patient: pass to ready to sign, but still not completed
    let dataObj = Object.assign(dossierUpdateObj, {
      currentDate: "2021/01/12:12:22",
    });
    response = await request
      .put(`/api/v1/dossier/patient-register`)
      .set("Authorization", "Bearer " + tokenDossier)
      .send(dataObj);
    dossier = response.body.data.dossier;
    expect(dossier.readyToSign).toBe(false);
    expect(dossier.isCompleted).toBe(false);

    // add uploaded documents: still not ready to sign, not completed
    for (let element of dossier.documentUploaded) {
      element.file = "test";
      delete element.slugTitre;
    }
    response = await request
      .put(`/api/v1/dossier/me`)
      .set("Authorization", "Bearer " + tokenDossier)
      .send({ documentUploaded: dossier.documentUploaded });
    dossier = response.body.data.dossier;
    expect(dossier.readyToSign).toBe(false);
    expect(dossier.isCompleted).toBe(false);

    // fill questionnaire: still not ready to sign, not completed
    for (let element of dossier.questionnaireForm) {
      if (element.subQuestion && Array.isArray(element.subQuestion)) {
        for (let sub of element.subQuestion) {
          sub.ansVal = "test";
        }
      } else {
        element.ansVal = "test";
      }
    }
    response = await request
      .put(`/api/v1/dossier/me`)
      .set("Authorization", "Bearer " + tokenDossier)
      .send({ questionnaireForm: dossier.questionnaireForm });
    dossier = response.body.data.dossier;
    expect(dossier.readyToSign).toBe(false);
    expect(dossier.isCompleted).toBe(false);

    // sign consentement: pass to ready to sign and completed
    for (const con of dossier.consentement) {
      response = await request
        .put(`/api/v1/dossier/me/sign`)
        .set("Authorization", "Bearer " + tokenDossier)
        .query({slugTitre: con.slugTitre })
        .send({ currentDate: "2021/01/12:12:22"});
    }
    //TODO to be reactivated when being able to test upload required document
    //dossier = response.body.data.dossier;
    //expect(dossier.readyToSign).toBe(false);
    //expect(dossier.isCompleted).toBe(true);
  });
});
