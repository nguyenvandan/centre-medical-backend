const jwt = require("jsonwebtoken");

import * as dossierloginServices from "../../../services/dossierlogin";
import * as examenServices from "../../../services/examen";
import * as dossierServices from "../../../services/dossier";
import * as examencentreServices from "../../../services/examencentre";
import baseError from "../../../libs/error";
const logger = require('../../../libs/logger')

import config from "../../../config";

// check login by other table
export const dossierLoginOnly = async (req, res, next) => {
    if (!req.header("Authorization")) {
        return res.badRequest(baseError.no_token());
    }
    const token = req.header("Authorization").replace("Bearer ", "");
    const data = jwt.verify(token, process.env.JWT_KEY);
    if (data._user == "dossier") {
        const dossierlogin = await dossierloginServices.findByDossierIdAndStatut({ dossierId: data._id, isLogin: true });
        if (!(dossierlogin && dossierlogin._id && dossierlogin.isLogin)) {
            return res.badRequest(baseError.no_auth());
        }
        req.dossierId = data._id;
        req.noDossier = dossierlogin.noDossier;
        // after dossier registration, 
        req.fullname = dossierlogin.fullname;
        return next();
    } else {
        return res.badRequest(baseError.no_auth());
    }
};


// validate create dossier input 
export const validateCreateDossierInput = async (req, res, next) => {
    const examen = await examenServices.findById({ _id: req.body.examenId });
    if (!(examen && examen._id)) {
        logger.error(baseError.id_wrong('examen'));
        return res.badRequest(baseError.id_wrong('examen'));
    }
    req.examen = examen;

    const examenCentre = await examencentreServices.findById({ _id: req.body.examenCentreId });
    if (!(examenCentre && examenCentre._id)) {
        logger.error(baseError.id_wrong('examen centre'));
        return res.badRequest(baseError.id_wrong('examen centre'));
    }
    req.examenCentre = examenCentre;

    return next()
};


// validate create dossier input 
export const validateUpdateDossierInput = async (req, res, next) => {
    if (req.body.examenId) {
        const examen = await examenServices.findById({ _id: req.body.examenId });
        if (!(examen && examen._id)) {
            logger.error(baseError.id_wrong('examen'));
            return res.badRequest(baseError.id_wrong('examen'));
        }
        req.examen = examen;
    }

    if (req.params.dossierId) {
        const dossier = await dossierServices.findById({ _id: req.params.dossierId });
        if (!(dossier && dossier._id)) {
            logger.error(baseError.not_found('dossier'));
            return res.badRequest(baseError.not_found('dossier'));
        }
        req.dossier = dossier;
    }

    if (req.body.examenCentreId) {
        const examenCentre = await examencentreServices.findById({ _id: req.body.examenCentreId });
        if (!(examenCentre && examenCentre._id)) {
            logger.error(baseError.id_wrong('examen centre'));
            return res.badRequest(baseError.id_wrong('examen centre'));
        }
        req.examenCentre = examenCentre;
    }

    return next()
};




// check if dossier is ready for sign
export const checkReadyToSign = async (req, res, next) => {
    let dossier = await dossierServices.findById({ _id: req.dossierId });
    const isReadyForSign = await dossierServices.isReadyForSign(dossier);
    if (!isReadyForSign) {
        logger.error(baseError.not_ready_to_sign());
        return res.badRequest(baseError.not_ready_to_sign());
    }
    req.dossier = dossier;
    return next()
};

// check if dossier is ready to close
export const checkReadyToClose = async (req, res, next) => {
    let dossier = await dossierServices.findById({ _id: req.params.dossierId });
    if (!dossier.isCompleted) {
        logger.error(baseError.not_ready_to_close());
        return res.badRequest(baseError.not_ready_to_close());
    }
    req.dossier = dossier;
    return next()
};

// check if dossier is ready to reopen
export const checkReadyToReopen = async (req, res, next) => {
    let dossier = await dossierServices.findById({ _id: req.params.dossierId });
    if (!dossier.isClosed) {
        logger.error(baseError.not_ready_to_reopen());
        return res.badRequest(baseError.not_ready_to_reopen());
    }
    req.dossier = dossier;
    return next()
};


// set path to upload folder for Couverture sante file
export const setPathUploadCouvSanteFile = async (req, res, next) => {

    req.uploadPath = `${config.file.patientRoot}/${req.noDossier}/${config.file.patientCouvSante}`;
    req.filenameToSave = (req.query || {}).justificatiDroitSlugTitre;
    return next()
};

// set path to upload folder for document required
export const setPathUploadDocRequired = async (req, res, next) => {
    req.uploadPath = `${config.file.patientRoot}/${req.noDossier}/${config.file.patientDocReq}`;
    req.filenameToSave = (req.query || {}).slugTitre;
    return next()
};
