import * as dossierServices from "../../../services/dossier";
import * as captchaServices from "../../../services/captcha";
import * as dossierLoginServices from "../../../services/dossierlogin";
import * as dossierHistoryServices from "../../../services/dossierhistory";
import * as smsServices from "../../../services/sms";
import * as baseError from "../../../libs/error";

const logger = require("../../../libs/logger");
import {removeFalsy} from "../../../libs/helper";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

import config from "../../../config";

// generate svg captcha image
var svgCaptcha = require('svg-captcha');



// --------------------------------- CREATE --------------------------------
export async function create(req, res) {
    const {loginPrefixLink, birthdate} = req.body;

    let dossierData = Object.assign({}, req.body, {
        passwordHash: bcrypt.hashSync(birthdate, 12),
        documentUploaded: req.examen.documentToUpload,
        ordonnance: req.examen.ordonnanceTemplate,
        consentement: req.examen.consentementTemplate,
        questionnaireForm: req.examen.questionnaireForm
    });

    // create new dossier
    let dossierCreated = await dossierServices.create(dossierData);

    if (dossierCreated && dossierCreated._id) {
        // send sms invitation
        try {
            
            // let smsSent = await smsServices.sendLoginInvitation(dossierCreated.phone, `${loginPrefixLink}/${
            //     dossierCreated.noDossier
            // }`);

            // update dossier sendRequested
            // if (smsSent) {
            //     dossierCreated = await dossierServices.updateById({ _id: dossierCreated._id, data: { sendRequested: true } });
            // }

            // history
            await dossierHistoryServices.createMany([
                {
                    dossierId: dossierCreated._id,
                    actor: req.fullname,
                    action: "Créer nouveau dossier",
                    actorType: "secretaire"
                }, {
                    dossierId: dossierCreated._id,
                    actor: req.fullname,
                    action: "Un sms d'invitation a été envoyé au patient",
                    actorType: "secretaire"
                }
            ]);

        } catch (err) {
            await dossierServices.deleteById(dossierCreated._id);
            throw err;
        }

        return res.ok({dossier: dossierCreated});    
    } 

    return res.badRequest(baseError.create_failed);
}

// --------------  LOGIN ------------------------
export const login = async (req, res) => {
    const {noDossier, birthdate} = req.body;
    const dossier = await dossierServices.findByCredentials(noDossier);
    if (!dossier) {
        return res.badRequest(baseError.login_failed);
    }
    const isPasswordMatch = await bcrypt.compare(birthdate, dossier.passwordHash);
    if (! isPasswordMatch) {
        return res.badRequest(baseError.login_failed);
    }
    const token = jwt.sign({
        _id: dossier._id,
        _user: "dossier"
    }, process.env.JWT_KEY, {expiresIn: "6d"});
    delete dossier.passwordHash;

    let fullname = `${dossier.firstName} ${dossier.lastName}`;
    let dossierLogin = await dossierLoginServices.updateByDossierId({
        dossierId: dossier._id, 
        noDossier: dossier.noDossier, 
        fullname: fullname, 
        isLogin: true
    });

    if (dossierLogin) {
        return res.ok({dossier: dossier, token: token});
    }
    return res.badRequest(baseError.login_failed);
};

// -------------- LOGOUT -------------------
export const logout = async (req, res) => {
    let result = await dossierLoginServices.updateByDossierId({
        dossierId: req.dossierId, 
        isLogin: false
    });
    if (result) {
        return res.ok({message: "Logged out"});
    }
    return res.internalServerError(baseError.logout_failed);
};
// -----------------------------------------------------------------









// ----------------------------------- GET --------------------------------------------
// CURRENT LOGIN ACCOUNT, dossierId added to req when check login
export async function myFullDossier(req, res) {
    const fullDossier = await dossierServices.getFullDossierById(req.dossierId);
    return res.ok({dossier: fullDossier});
}

// secretary get fulldossier by dossier id
export async function getFullDossierById(req, res) {
    const {dossierId} = req.params;
    logger.info("Get full data of the dossier " + dossierId);
    const fullDossier = await dossierServices.getFullDossierById({_id: dossierId});
    return res.ok({dossier: fullDossier});
}

// secretary get list dossier with filter
export async function getList(req, res) {
    const {
        offset,
        limit,
        options,
        closed,
        state,
        sendRequested,
        minDate,
        maxDate,
        searchText
    } = req.query;

    let condt = {};

    // if filter by state
    if (state == "complet") {
        Object.assign(condt, { isCompleted: true });
        Object.assign(condt, { isClosed: false });
    } else if (state == "inComplet") {
        Object.assign(condt, { isCompleted: false });
    }
    if (closed) {
        Object.assign(condt, { isClosed: true });
    } else if (closed !== undefined) {
        Object.assign(condt, { isClosed: false });
    }

    let dateObject = {};
    if (minDate) {
        Object.assign(dateObject, { $gte: minDate });
    }
    if (maxDate) {
        Object.assign(dateObject, { $lte: maxDate });
    }
    if (Object.keys(dateObject) && Object.keys(dateObject).length) {
        Object.assign(condt, { dateRDV: dateObject });
    }

    if (sendRequested) {
        Object.assign(condt, { sendRequested: sendRequested });
    }
    
    if (searchText) {
        let tmpCondt = Object.assign({}, condt);
        condt = Object.assign({}, {
            $and: [
                tmpCondt,
                { 
                    $or: [
                        { noDossier: { $regex: searchText, $options: 'i' } },
                        { firstName: { $regex: searchText, $options: 'i' } },
                        { lastName: { $regex: searchText, $options: 'i' } }
                    ]
                }
            ]
        })
    }
    const dossiers = await dossierServices.getList(removeFalsy({offset: offset, limit: limit, options: options, condt: condt}));
    return res.ok({dossiers});
}


export async function getRegisterState(req, res) {
    const baseInfoDossier = await dossierServices.getRegisterInfo({_id: req.dossierId});
    let isRegistered = baseInfoDossier && 
    baseInfoDossier.firstName && 
    baseInfoDossier.lastName && 
    baseInfoDossier.email && 
    baseInfoDossier.address && 
    (baseInfoDossier.address.city || baseInfoDossier.address.street || baseInfoDossier.zipcode) ? true : false;
    
    return res.ok({
        baseInfo: {
            firstName: baseInfoDossier.firstName,
            lastName: baseInfoDossier.lastName,
            email: baseInfoDossier.email,
            address: baseInfoDossier.address
        },
        isRegistered: isRegistered,
        dossierId: req.dossierId
    });
}

export async function getLoginState(req, res) {
    return res.ok({ dossierId: req.dossierId });
}

export async function getCaptcha(req, res) {
    let options = {
        size: 5, // size of random string
        noise: 20, // number of noise lines
        color: true, // characters will have distinct colors instead of grey, true if background option is set
        background: '#cc9966' //
    }
    var captcha = svgCaptcha.create(options);
    let capchaUpdated = await captchaServices.updateByDossierId({
        dossierId: req.dossierId,
        captcha: "" + captcha.text
    });
    if (capchaUpdated) {
        res.type('svg');
        return res.ok(captcha.data);
    }
    return res.ok({});
}
// -----------------------------------------------------------------









// -------------------------------------- UPDATE --------------------------------------
// patient update dossier
export async function updateMe(req, res) {
    const dossierId = req.dossierId;
    const data = req.body;
    let result = await dossierServices.updateById({_id: dossierId, data: data});
    dossierHistoryServices.create({
        dossierId: result._id, 
        actor: req.fullname, 
        action: "Le patient a mis à jour du dossier", 
        actorType: "patient"
    });
    return res.ok({ dossier: result });
}

// patient registers personal information
export const patientRegister = async (req, res) => {
    const dossierId = req.dossierId;
    const { currentDate, captcha, ...registerData } = req.body;

    // check captcha
    let captchaObj = await captchaServices.findByDossierIdAndCaptcha({ dossierId: dossierId, captcha: captcha })
    if (!(captchaObj && captchaObj._id)) {
        return res.badRequest(baseError.captcha_wrong());
    }

    // register infos to dossier
    let updatedDossier = await dossierServices.updateById({ _id: dossierId, data: registerData });

    let fullname = `${updatedDossier.firstName} ${updatedDossier.lastName}`;
    let generatedFiles = await Promise.all(
        [
            // update fullname to dossierlogins record. 
            // before register, no fullname save to this record
            dossierLoginServices.updateByDossierId({
                dossierId: dossierId,
                fullname: fullname,
                isLogin: true
            }),

            // generate ordonnance
            dossierServices.gennerateOrdonnance({ 
                dossier: updatedDossier,
                currentDate: currentDate
             }), 

            // generate consentement
            dossierServices.gennerateConsentements({
                dossier: updatedDossier, 
                currentDate: currentDate
            })
        ]
    );

    // update file link in ordonnance and consentement
    let noDossier = updatedDossier.noDossier;
    let updateData = {};
    if (generatedFiles) {
        // add generated file link to ordonnance
        if (updatedDossier.ordonnance && updatedDossier.ordonnance.length) {
            let ordonanceArr = [];
            updatedDossier.ordonnance.forEach(e => {
                let ordonnanceObj = Object.assign({}, e, {
                    file: `${config.file.patientRoot}/${noDossier}/${config.file.patientOrd}/${e.slugTitre}.pdf`
                });
                ordonanceArr.push(ordonnanceObj);
            })
            Object.assign(updateData, { ordonnance: ordonanceArr });
        }
        
        // add generated file link to consentement
        if (updatedDossier.consentement && updatedDossier.consentement.length) {
            let consArr = [];
            updatedDossier.consentement.forEach(e => {
                let consObj = Object.assign({}, e, {
                    file: `${config.file.patientRoot}/${noDossier}/${config.file.patientCons}/${e.slugTitre}.pdf`
                });
                consArr.push(consObj);
            })
            Object.assign(updateData, { consentement: consArr });
        }
    }
    
    let updatedDossierWithFiles = null;
    if (updateData.ordonnance || updateData.consentement) {

        updatedDossierWithFiles = await Promise.all([

            // update consentement and ordonance with generated file link to dossier
            dossierServices.updateById({ _id: dossierId, data: updateData }),

            // create new record in dossierhistories collection
            dossierHistoryServices.create({
                dossierId: dossierId, 
                actor: fullname, 
                action: "Le patient s'est enregistré", 
                actorType: "patient"
            })
        ])
    }

    // if generate ordonnance and consentement file is done
    if (updatedDossierWithFiles) {
        return res.ok({ dossier: updatedDossierWithFiles[0] });
    }
    return res.ok({ dossier: updatedDossier });
}

// secretary update dossier
export async function updateById(req, res) {
    const { dossierId } = req.params;
    const result = await dossierServices.updateById({_id: dossierId, data: req.body});
    if (!result) {
        return res.badRequest(baseError.id_wrong("dossier"));
    }
    dossierHistoryServices.create({
        dossierId: dossierId, 
        actor: req.fullname, 
        action: "Secrétaire a mis à jour du dossier", 
        actorType: "secretaire"
    });
    return res.ok({dossier: result});
}


// Secretary update security social data (number and status)
// Secretary can put new numero and change status [new, validated, not_validated]
export async function secretaryUpdateSecuritesocialeData(req, res) {
    const { dossierId } = req.params;
    const { noSecuriteSociale, status } = req.body;
   
    let action = "";
    let data = {};

    if (!(noSecuriteSociale || status)) {
        return res.badRequest(baseError.body_empty());
    }

    if (noSecuriteSociale) {
        action = "Secrétaire a modifié le numéro de securité sociale";
        Object.assign(data, { 'couvertureSante.noSecuriteSociale': noSecuriteSociale } );
    }

    if (status) {
        if (status == "validated") {
            action = "Secrétaire a validé le numéro de securité sociale";
        } else if (status === "not_validated") {
            action = "Secrétaire a décline le numéro de securité sociale";
        }
        Object.assign(data, { 'couvertureSante.status': status } );
    }

    if (!Object.keys(data).length) {
        let generatedFiles = await Promise.all([
            await dossierServices.updateById({ _id: dossierId, data: data }),
            dossierHistoryServices.create({
                dossierId: dossierId, 
                actor: req.fullname, 
                action: action, 
                actorType: "secretaire"
            })
        ]);
        return res.ok({dossier: generatedFiles[0]});
    }

    return res.ok({dossier:  {} });
}


// patient sign consentement
export const signConsentement = async (req, res) => {
    const dossierId = req.dossierId;

    const { slugTitre } = req.query;
    const { currentDate} = req.body;

    let dossier = req.dossier;

    let signedConsentement = await dossierServices.signConsentement({ 
        dossier: dossier, 
        currentDate: currentDate, 
        slugTitre: slugTitre
    });

    let updatedDossierSigned = {};
    if (signedConsentement) {
        let idx = dossier.consentement.findIndex(e => e.slugTitre === slugTitre);
        if (idx > -1) {
            dossier.consentement[idx].isSigned = true;
            updatedDossierSigned = await dossierServices.updateById({
                _id: dossierId, 
                data: {
                    consentement: dossier.consentement
                }
            });

            // check if dossier is completed and update it
            let isCompleted = await dossierServices.isAllConsentementSigned(updatedDossierSigned);
            updatedDossierSigned = await dossierServices.updateById({
                _id: dossierId, 
                data: {
                    isCompleted: isCompleted ? true : false
                }
            });
        }
    }

    dossierHistoryServices.create({
        dossierId: dossierId,
        actor: req.fullname,
        action: `Le patient a signé le document + ${(req.query || {}).slugTitre}`,
        actorType: "patient"
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    if (updatedDossierSigned) {
        return res.ok({ dossier: updatedDossierSigned });
    }
    return res.ok({ dossier: dossier });
}


// patient answer questionnaire form
export async function answer(req, res) {
    const { dossierId, noDossier } = req;
    const { questionnaireForm } = req.body;

    // check if all required questions are answered
    if (questionnaireForm && Array.isArray(questionnaireForm)) {
        let isAllAnswered = await dossierServices.isAllReqQAnswered(questionnaireForm);
        if (!isAllAnswered) {
            logger.info( {noDossier: noDossier}, "The questionnaire is not completed");
            return res.badRequest(baseError.not_answer_all_question());
        }
    }

    // update
    let updatedDossier = await dossierServices.updateById({
        _id: dossierId,
        data: {
            questionnaireForm: questionnaireForm
        }
    });

    // check if ready to sign and generate pdf
    let pdfPathReadyToSignStatus = await Promise.all([
        await dossierServices.isReadyForSign(updatedDossier),
        await dossierServices.generateQuestionnaireFile(updatedDossier)
    ]);

    let updateResult = await Promise.all([
        // update dossier with questionaire pdffile generated
        await dossierServices.updateById({
            _id: dossierId,
            data: {
                readyToSign: pdfPathReadyToSignStatus[0] ? true : false,
                isCompleted: false,
                questionnaireFile: pdfPathReadyToSignStatus[1],
            }
        }),
        // history
        dossierHistoryServices.create({
            dossierId: dossierId, 
            actor: req.fullname, 
            action: "Le patient a répondu au questionnaire avant examen", 
            actorType: "patient"
        })
    ]);

    return res.ok({ dossier: (updateResult[0] || updatedDossier) });
}

// Secretary close a completed dossier
export async function secretaryCloseDossier(req, res) {
    const { dossierId } = req.params;
    const result = await dossierServices.updateById({
      _id: dossierId,
      data: { isClosed: true },
    });
    if (!result) {
      return res.badRequest(baseError.id_wrong("dossier"));
    }
    // history
    dossierHistoryServices.create({
      dossierId: dossierId,
      actor: req.fullname,
      action: "Secrétaire a changé le statut du dossier à `complet traité`",
      actorType: "secretaire",
    });
    return res.ok({ dossier: result });
}

// Secretary reopen a fully completed dossier
export async function secretaryReopenDossier(req, res) {
    const { dossierId } = req.params;
    const result = await dossierServices.updateById({
      _id: dossierId,
      data: { isClosed: false },
    });
    if (!result) {
      return res.badRequest(baseError.id_wrong("dossier"));
    }
    // history
    dossierHistoryServices.create({
      dossierId: dossierId,
      actor: req.fullname,
      action: "Secrétaire a changé le statut du dossier à `complet`",
      actorType: "secretaire",
    });
    return res.ok({ dossier: result });
}
// -----------------------------------------------------------------








// --------------------------------------  UPLOAD --------------------------------------
// patient upload required document
export async function uploadDocument(req, res) {
    if (req.file === null || typeof req.file === "undefined") {
        return res.badRequest(baseError.file_missing);
    }
    let updatedDossier = await dossierServices.addUploadedDocById({
        dossierId: req.dossierId,
        data: {
            slugTitre: (req.query || {}).slugTitre,
            file: (req.file || {}).path
        }
    });

    // check if dossier is ready to sign and update it
    let readyToSign = await dossierServices.isReadyForSign(updatedDossier);
    updatedDossier = await dossierServices.updateById({
        _id: req.dossierId,
        data: {
            readyToSign: (readyToSign ? true : false),
            isCompleted: false
        }
    });

    dossierHistoryServices.create({
        dossierId: req.dossierId,
        actor: req.fullname,
        action: `Le patient a téléchargé le document ${(req.query || {}).slugTitre}`,
        actorType: "patient"
    });
    return res.ok({ dossier: updatedDossier });
}



//  patient upload securite document
export async function uploadJustificatifDroit(req, res) {
    if (req.file === null || typeof req.file === "undefined") {
        return res.badRequest(baseError.file_missing);
    }
    let justificatiDroitSlugTitre = (req.query || {}).justificatiDroitSlugTitre;
    if (!justificatiDroitSlugTitre) {
        return res.badRequest(baseError.is_required('slugTitre de justificatif de droit'));
    }
    let data = {
        "couvertureSante.justificatiDroitSlugTitre": justificatiDroitSlugTitre,
        "couvertureSante.justificatifDroitFile": (req.file || {}).path
    }
    let dossier = await dossierServices.updateById({ _id: req.dossierId, data: data });
    return res.ok({ dossier: dossier});
}