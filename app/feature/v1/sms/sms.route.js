import express from "express";

import {
  validatorBody,
  validatorParams,
  validatorQuery,
} from "../../../libs/validator";

import { getListSchema } from "../../../libs/baseSchema";
import { syncMiddleware } from "../../../libs/common";

import * as smsController from "./sms.controller";
import { secretaryLoginOnly } from "../secretary/secretary.middleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: SMS
 *   description: SMS management
 */

/**
 * @swagger
 * /api/v1/sms/send:
 *   post:
 *     summary: Send a sms
 *     description: Send a sms
 *     tags: [SMS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Post sms data to send
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SMSPostParam'
 *           example:
 *             link: "https://medika.herokuapp.com/dossier/login/it3on"
 *             dossierId: "5fe100907eae6c0011cd4262"
 *     responses:
 *       200:
 *         description: SMS data object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SMS'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
  "/send",
  [syncMiddleware(secretaryLoginOnly)],
  syncMiddleware(smsController.sendLoginInvitation)
);

export default router;
