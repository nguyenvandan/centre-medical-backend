import express from "express";

import {
  validatorBody,
  validatorParams,
  validatorQuery,
} from "../../../libs/validator";

import { getListSchema } from "../../../libs/baseSchema";
import { syncMiddleware } from "../../../libs/common";

import { 
  dossierLoginOnly, 
  validateCreateDossierInput, 
  validateUpdateDossierInput,
  checkReadyToSign,
  checkReadyToClose,
  checkReadyToReopen,
  setPathUploadDocRequired,
  setPathUploadCouvSanteFile
} from "./dossier.middleware.js";

import { beforeUploadFile } from "../file/file.middleware.js";
import { secretaryLoginOnly } from "../secretary/secretary.middleware.js";

import * as dossierController from "./dossier.controller";
import * as dossierValidation from "./dossier.validation";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dossier
 *   description: Dossier management
 */

// ------------------------------ POST -------------------------------------
/**
 * @swagger
 * /api/v1/dossier:
 *   post:
 *     summary: Create Dossier
 *     description: Create new Dossier
 *     tags: [Dossier]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Post Dossier data to create
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DossierPostParam'
 *           example:
 *             noDossier: "123456789"
 *             examenId: "5fcce05ebfeadc00153cc84c"
 *             examenCentreId: "5fcce073bfeadc00153cc853"
 *             birthdate: "12/11/1990"
 *             firstName: "firstname"
 *             lastName: "lastname"
 *             phone: "0605060405"
 *             dateRDV: "2020-12-03T15:14:06.172Z"
 *             loginPrefixLink: http://localhost:8080/dossier/login
 *     responses:
 *       200:
 *         description: Dossier data object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dossier'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
  "",
  [
    syncMiddleware(secretaryLoginOnly),
    syncMiddleware(validatorBody(dossierValidation.createSchema)),
    syncMiddleware(validateCreateDossierInput),
  ],
  syncMiddleware(dossierController.create)
);

/**
 * @swagger
 * /api/v1/dossier/login:
 *   post:
 *     summary: Login an user dossier
 *     description: Login an existing user dossier
 *     tags: [Dossier]
 *     requestBody:
 *       required: true
 *       description: Post user dossier data to login
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               noDossier:
 *                 type: string
 *               birthdate:
 *                 type: string
 *           example:
 *             noDossier: "123456789"
 *             birthdate: "12/11/1990"
 *     responses:
 *       200:
 *         description: Dossier data object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dossier'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
  "/login",
  syncMiddleware(validatorBody(dossierValidation.loginSchema)),
  syncMiddleware(dossierController.login)
);

/**
 * @swagger
 * /api/v1/dossier/logout:
 *   post:
 *     summary: Logout an user dossier
 *     description: Logout an existing user dossier
 *     tags: [Dossier]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dossier data object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dossier'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
  "/logout",
  syncMiddleware(dossierLoginOnly),
  syncMiddleware(dossierController.logout)
);

// ------------------------------ GET -------------------------------------
/**
 * @swagger
 * /api/v1/dossier?offset={offset}&limit={limit}&options={options}:
 *   get:
 *     summary: Get all dossier
 *     description: Get all dossier
 *     tags: [Dossier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - $ref: '#/components/parameters/offsetQuery'
 *      - $ref: '#/components/parameters/limitQuery'
 *      - $ref: '#/components/parameters/optionQuery'
 *     responses:
 *       200:
 *         description: array of dossiers object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DossierPaging'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
  "",
  syncMiddleware(secretaryLoginOnly),
  syncMiddleware(dossierController.getList)
);

/**
 * @swagger
 * /api/v1/dossier/me:
 *   get:
 *     summary: Get user dossier
 *     description: Get user dossier
 *     tags: [Dossier]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: object of user dossier
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dossier'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
  "/me",
  syncMiddleware(dossierLoginOnly),
  syncMiddleware(dossierController.myFullDossier)
);

// generate capcha svg image
router.get(
  "/me/getCaptcha",
  syncMiddleware(dossierLoginOnly),
  syncMiddleware(dossierController.getCaptcha)
);

/**
 * @swagger
 * /api/v1/dossier/checklogin:
 *   get:
 *     summary: Checklogin
 *     description: Checklogin
 *     tags: [Dossier]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: object of user dossier
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                data:
 *                  type: object
 *                  propertites:
 *                    dossierId:
 *                    type: string
 *                status:
 *                  type: string
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
  "/checklogin",
  syncMiddleware(dossierLoginOnly),
  syncMiddleware(dossierController.getLoginState)
);

/**
 * @swagger
 * /api/v1/dossier/checkregistered:
 *   get:
 *     summary: checkregistered
 *     description: checkregistered
 *     tags: [Dossier]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: object of user dossier
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                data:
 *                  type: object
 *                  propertites:
 *                    isRegistered:
 *                    type: boolean
 *                status:
 *                  type: string
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
  "/checkregistered",
  syncMiddleware(dossierLoginOnly),
  syncMiddleware(dossierController.getRegisterState)
);

/**
 * @swagger
 * /api/v1/dossier/{dossierId}:
 *   get:
 *     summary: Get full dossier associated with his examen data
 *     description: Get full dossier associated with his examen data
 *     tags: [Dossier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/dossierParam'
 *     responses:
 *       200:
 *         description: object of full dossier associated with his examen data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dossier'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
  "/:dossierId",
  syncMiddleware(secretaryLoginOnly),
  syncMiddleware(dossierController.getFullDossierById)
);











// ------------------------------ PUT -------------------------------------
/**
 * @swagger
 * /api/v1/dossier/me:
 *   put:
 *     summary: Patient Update Dossier
 *     description: Patient Update an existing dossier
 *     tags: [Dossier]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Put Dossier data to update
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DossierUpdateParam'
 *           example:
 *             firstName: "Van Dan"
 *             lastName: "Nguyen"
 *             address:
 *               street: "171 avenue Pierre Brossolette"
 *               zipcode: "94170"
 *               city: "Le Perreux Sur Marne"
 *     responses:
 *       200:
 *         description: Dossier data object updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dossier'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put(
  "/me",
  [
    syncMiddleware(dossierLoginOnly),
    syncMiddleware(validatorBody(dossierValidation.updateMeSchema)),
  ],
  syncMiddleware(dossierController.updateMe)
);


/**
 * @swagger
 * /api/v1/dossier/me/upload?slugTitre={slugTitre}:
 *   put:
 *     summary: Upload document to update a dossier
 *     description: Upload document to update a dossier
 *     tags: [Dossier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - $ref: '#/components/parameters/slugTitreUploadQuery'
 *     requestBody:
 *       required: true
 *       description: Upload document to update a dossier
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/DossierUploadParam'
 *           example:
 *             doc: "file"
 *     responses:
 *       200:
 *         description: Dossier data object updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dossier'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put(
  "/me/upload",
  [
    syncMiddleware(dossierLoginOnly), 
    syncMiddleware(setPathUploadDocRequired),
    syncMiddleware(beforeUploadFile)
  ],
  syncMiddleware(dossierController.uploadDocument)
);


/**
 * @swagger
 * /api/v1/dossier/me/uploadJustificatifDroit?justificatiDroitSlugTitre={justificatiDroitSlugTitre}:
 *   put:
 *     summary: Upload document to update a dossier
 *     description: Upload document to update a dossier
 *     tags: [Dossier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - $ref: '#/components/parameters/justificatiDroitSlugTitreUploadQuery'
 *     requestBody:
 *       required: true
 *       description: Upload document to update a dossier
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/DossierUploadParam'
 *           example:
 *             doc: "file"
 *     responses:
 *       200:
 *         description: Dossier data object updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dossier'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put(
  "/me/uploadJustificatifDroit",
  [
    syncMiddleware(dossierLoginOnly), 
    syncMiddleware(setPathUploadCouvSanteFile),
    syncMiddleware(beforeUploadFile)
  ],
  syncMiddleware(dossierController.uploadJustificatifDroit)
);


/**
 * @swagger
 * /api/v1/dossier/me/sign?slugTitre={slugTitre}:
 *   put:
 *     summary: Signer consentement
 *     description: Signer consentement
 *     tags: [Dossier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - $ref: '#/components/parameters/slugTitreConsentementQuery'
 *     requestBody:
 *      required: true
 *      description: current time yyyy/mm/dd:hh:mn
 *      content:
 *        application/json:
 *          schema:
 *            propertites:
 *              currentDate: 
 *                type: string 
 *          example:
 *            currentDate: "2020/02/15:08:30"
 *     responses:
 *       200:
 *         description: Dossier data object updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dossier'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put(
  "/me/sign",
  [
    syncMiddleware(dossierLoginOnly), 
    syncMiddleware(checkReadyToSign)
  ],
  syncMiddleware(dossierController.signConsentement)
);



/**
 * @swagger
 * /api/v1/dossier/patient-register:
 *   put:
 *     summary: patient register personal information for Dossier
 *     description: patient register personal information for Dossier
 *     tags: [Dossier]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Put registration data to update
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DossierRegisterParam'
 *           example:
 *             firstName: "Van Dan"
 *             lastName: "Nguyen"
 *             email: "nguyenabc@gmail.com"
 *             noSecuriteSociale: "185057800608439"
 *             address:
 *               street: "171 avenue Pierre Brossolette"
 *               zipcode: "94170"
 *               city: "Le Perreux Sur Marne"
 *     responses:
 *       200:
 *         description: Dossier data object updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dossier'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put(
  "/patient-register",
  [
    syncMiddleware(dossierLoginOnly),
    syncMiddleware(validatorBody(dossierValidation.registerschema)),
  ],
  syncMiddleware(dossierController.patientRegister)
);

/**
 * @swagger
 * /api/v1/dossier/patient-answer:
 *   put:
 *     summary: patient answer survey form for Dossier
 *     description: patient answer survey form for Dossier
 *     tags: [Dossier]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Put survey answer data to update
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DossierAnswerParam'
 *           example:
 *             questionnaireForm: "[{}]"
 *     responses:
 *       200:
 *         description: Dossier data object updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dossier'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put(
  "/patient-answer",
  [
    syncMiddleware(dossierLoginOnly),
    syncMiddleware(validatorBody(dossierValidation.answerschema)),
  ],
  syncMiddleware(dossierController.answer)
);


/**
 * @swagger
 * /api/v1/dossier/{dossierId}:
 *   put:
 *     summary: Secretary updates Dossier
 *     description: Secretary updates an existing dossier
 *     tags: [Dossier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/dossierParam'
 *     requestBody:
 *       required: true
 *       description: Put Dossier data to update
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DossierUpdateParam'
 *           example:
 *             firstName: "Van Dan"
 *             lastName: "Nguyen"
 *             address:
 *               street: "171 avenue Pierre Brossolette"
 *               zipcode: "94170"
 *               city: "Le Perreux Sur Marne"
 *     responses:
 *       200:
 *         description: Dossier data object updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dossier'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put(
  "/:dossierId",
  [
    syncMiddleware(secretaryLoginOnly),
    syncMiddleware(validatorParams(dossierValidation.dossierIdSchema)),
    syncMiddleware(validatorBody(dossierValidation.updateSchema)),
    syncMiddleware(validateUpdateDossierInput),
  ],
  syncMiddleware(dossierController.updateById)
);


/**
 * @swagger
 * /api/v1/dossier/{dossierId}/securitesociale:
 *   put:
 *     summary: Update no securite social and it status by secretarie
 *     description: Update no securite social and it status by secretarie
 *     tags: [Dossier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/dossierParam'
 *     requestBody:
 *       required: true
 *       description: Put no securite social to update
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DossierUpdateNoSecuriteSocialeParam'
 *           example:
 *             noSecuriteSociale: "185057800608436"
 *     responses:
 *       200:
 *         description: Dossier data object updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dossier'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put(
  "/:dossierId/securitesociale",  
  [
    syncMiddleware(secretaryLoginOnly),
    syncMiddleware(validatorParams(dossierValidation.dossierIdSchema)),
    syncMiddleware(validatorBody(dossierValidation.updateSchema)),
    syncMiddleware(validateUpdateDossierInput),
  ],
  syncMiddleware(dossierController.secretaryUpdateSecuritesocialeData)
);

/**
 * @swagger
 * /api/v1/dossier/{dossierId}/close:
 *   put:
 *     summary: Close a completed dossier by secretary.
 *     description: Close a completed dossier by secretary. The dossier's status will be full completed ("complet traité")
 *     tags: [Dossier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/dossierParam'
 *     responses:
 *       200:
 *         description: Dossier data object updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dossier'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
 router.put(
  "/:dossierId/close",  
  [
    syncMiddleware(secretaryLoginOnly),
    syncMiddleware(validatorParams(dossierValidation.dossierIdSchema)),
    syncMiddleware(checkReadyToClose)
  ],
  syncMiddleware(dossierController.secretaryCloseDossier)
);

/**
 * @swagger
 * /api/v1/dossier/{dossierId}/reopen:
 *   put:
 *     summary: Reopen a full completed dossier by secretary.
 *     description: Reopen a full completed dossier by secretary. The dossier's status will be completed ("complet")
 *     tags: [Dossier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/dossierParam'
 *     responses:
 *       200:
 *         description: Dossier data object updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dossier'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
 router.put(
  "/:dossierId/reopen",  
  [
    syncMiddleware(secretaryLoginOnly),
    syncMiddleware(validatorParams(dossierValidation.dossierIdSchema)),
    syncMiddleware(checkReadyToReopen)
  ],
  syncMiddleware(dossierController.secretaryReopenDossier)
);


export default router;
