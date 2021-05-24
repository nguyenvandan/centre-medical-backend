import express from "express";

import {
  validatorBody,
  validatorParams,
  validatorQuery,
} from "../../../libs/validator";

import { getListSchema } from "../../../libs/baseSchema";
import { syncMiddleware } from "../../../libs/common";
import { dossierLoginOnly } from "../dossier/dossier.middleware.js";
import { secretaryLoginOnly } from "../secretary/secretary.middleware.js";

import * as dossierHistoryController from "./dossierhistory.controller";
import * as dossierHistoryValidation from "./dossierhistory.validation";
import * as dossierValidation from "../dossier/dossier.validation";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: DossierHistory
 *   description: DossierHistory management
 */

/**
 * @swagger
 * /api/v1/dossierhistory:
 *   post:
 *     summary: Patient createa a history
 *     description: Patient creates history
 *     tags: [DossierHistory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Post DossierHistory data to create
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DossierHistoryPostParam'
 *           example:
 *             actor: "Marie Leroy"
 *             action: "Ajouter dossier"
 *     responses:
 *       200:
 *         description: DossierHistory data object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DossierHistory'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
  "",
  [
    syncMiddleware(dossierLoginOnly),
    syncMiddleware(validatorBody(dossierHistoryValidation.createSchema)),
  ],
  syncMiddleware(dossierHistoryController.createDossierAction)
);

/**
 * @swagger
 * /api/v1/dossierhistory/secretary:
 *   post:
 *     summary: Create DossierHistory
 *     description: Create new DossierHistory
 *     tags: [DossierHistory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Post DossierHistory data to create
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DossierHistoryPostParam'
 *           example:
 *             dossierId: "5fd20a54d59d8e0f75ee8ec0"
 *             actor: "Marie Leroy"
 *             action: "Ajouter dossier"
 *     responses:
 *       200:
 *         description: DossierHistory data object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DossierHistory'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
  "/secretary",
  [
    syncMiddleware(secretaryLoginOnly),
    syncMiddleware(validatorBody(dossierHistoryValidation.createSchema)),
  ],
  syncMiddleware(dossierHistoryController.createSecretaryAction)
);

/**
 * @swagger
 * /api/v1/dossierhistory/me:
 *   get:
 *     summary: Get all history of a dossier
 *     description: Get all history of a dossier
 *     tags: [DossierHistory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: list object of  dossier history
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DossierHistoryList'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
  "/me",
  [syncMiddleware(dossierLoginOnly)],
  syncMiddleware(dossierHistoryController.me)
);

/**
 * @swagger
 * /api/v1/dossierhistory/{dossierId}:
 *   get:
 *     summary: Get all history of a dossier
 *     description: Get all history of a dossier
 *     tags: [DossierHistory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - $ref: '#/components/parameters/dossierParam'
 *     responses:
 *       200:
 *         description: list object of  dossier history
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DossierHistoryList'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
  "/:dossierId",
  [
    syncMiddleware(secretaryLoginOnly),
    syncMiddleware(validatorParams(dossierValidation.dossierIdSchema)),
  ],
  syncMiddleware(dossierHistoryController.getManyByDossierId)
);

export default router;
