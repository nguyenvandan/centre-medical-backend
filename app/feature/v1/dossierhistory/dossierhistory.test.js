const supertest = require("supertest");
const mongoose = require('mongoose');
import app from "../../../app.js";
const request = supertest(app);

const dbHandler = require("../../../config/jest/db-handler.js");
const dbInit = require("../../../config/jest/init-data.js");

import DossierHistory from "../../../models/dossierhistory";

let expectedDossier = {};
let tokenDossier = null;
let tokenSecretary = null;
let expectedExamen = {};
let expectedExamenCentre = {};
let expectedSecretary = {};
let examenId = null;
let examenCentreId = null;
let dossierId = null;

let dossierHistoryObj = {
  actor: "Marie Leroy",
  action: "Ajouter dossier",
  actorType: "secretaire"
};

beforeAll(async (done) => {
  expectedSecretary = await dbInit.createSecretary(request);
  tokenSecretary = await dbInit.signInSecretary(request);
  expectedExamen = await dbInit.createExamen(request, tokenSecretary);
  expectedExamenCentre = await dbInit.createExamenCentre(request, tokenSecretary);
  expectedDossier = await dbInit.createDossier(request, tokenSecretary);
  tokenDossier = await dbInit.signInDossier(request);
  examenId = expectedExamen.data.examen._id;
  examenCentreId = expectedExamenCentre.data.examencentre._id;
  dossierId = expectedDossier.data.dossier._id;
  dossierHistoryObj.dossierId = dossierId;
  done();
});

afterAll(async (done) => {
  await dbHandler.closeDatabase();
  done();
});

describe("-------------------- DOSSIER HISTORY MODULE -------------------------- ", () => {
  // --------------------- put ----------------------
  test("Create dossier history by dossier: successfully", async () => {
    const response = await request
      .post(`/api/v1/dossierhistory`)
      .set("Authorization", "Bearer " + tokenDossier)
      .send(dossierHistoryObj);
    const resGet = await DossierHistory.findById(response.body.data.dossierhistory._id);
    expect(response.status).toBe(200);
    expect(resGet).not.toBe(undefined);
    expect(resGet).toHaveProperty("dossierId", mongoose.Types.ObjectId(dossierId));
    expect(resGet).toHaveProperty("actor", dossierHistoryObj.actor);
    expect(resGet).toHaveProperty("action", dossierHistoryObj.action);
  });

  test("Create dossier history by wrong dossier: error", async () => {
    const response = await request
      .post(`/api/v1/dossierhistory`)
      .set("Authorization", "Bearer " + tokenSecretary)
      .send(dossierHistoryObj);
    expect(response.status).not.toBe(200);
  });

  test("Create dossier history by secretary: successfully", async () => {
    const response = await request
      .post(`/api/v1/dossierhistory/secretary`)
      .set("Authorization", "Bearer " + tokenSecretary)
      .send(dossierHistoryObj);
    expect(response.status).toBe(200);
    expect(response.body.data.dossierhistory).not.toBe(undefined);
    expect(response.body.data.dossierhistory).toHaveProperty("dossierId", dossierId);
    expect(response.body.data.dossierhistory).toHaveProperty("actor", dossierHistoryObj.actor);
    expect(response.body.data.dossierhistory).toHaveProperty("action", dossierHistoryObj.action);
  });

  test("Create dossier history by wrong secretary: error", async () => {
    const response = await request
      .post(`/api/v1/dossierhistory/secretary`)
      .set("Authorization", "Bearer " + tokenDossier)
      .send(dossierHistoryObj);
    expect(response.status).not.toBe(200);
  });

  // --------------------- get ----------------------
  test("Get dossier history by id by secretary: successfully", async () => {
    const response = await request
      .get(`/api/v1/dossierhistory/${dossierId}`)
      .set("Authorization", "Bearer " + tokenSecretary);
    expect(response.status).toBe(200);
    expect(response.body).not.toBe(undefined);
    expect(response.body.data.history.length).toBe(4);
  });

  test("Get dossier history by id without secretary: error", async () => {
    const response = await request
      .get(`/api/v1/dossierhistory/${dossierId}`)
      .set("Authorization", "Bearer " + tokenDossier);;
    expect(response.status).not.toBe(200);
  });

  test("Get dossier history by id by dossier: successfully", async () => {
    const response = await request
      .get(`/api/v1/dossierhistory/me`)
      .set("Authorization", "Bearer " + tokenDossier);
    expect(response.status).toBe(200);
    expect(response.body).not.toBe(undefined);
    expect(response.body.data.history.length).toBe(4);
  });

  test("Get dossier history by id without dossier: error", async () => {
    const response = await request
      .get(`/api/v1/dossierhistory/me`)
      .set("Authorization", "Bearer " + tokenSecretary);;
    expect(response.status).not.toBe(200);
  });
});
