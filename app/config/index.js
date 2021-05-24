const cf = require('dotenv').config();

const config = {
  port: process.env.PORT,
  node_env: process.env.NODE_ENV,

  db: {
    fullUrl: process.env.DB_FULL_URL,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
  },

  jwt: {
    SECRET_KEY: process.env.JWT_SECRET,
    TOKEN_EXPIRE: process.env.TOKEN_EXPIRE
  },

  file: {
    maxUploadFileSize: process.env.MAX_UPLOAD_FILE_SIZE,

    patientRoot:  process.env.PATIENT_DOCUMENT_ROOT,
    patientCons:  process.env.PATIENT_DOCUMENT_CONSENTEMENT,
    patientOrd:   process.env.PATIENT_DOCUMENT_ORDONNANCE,
    patientQForm:   process.env.PATIENT_DOCUMENT_QUESTIONNAIRE_FORM,
    patientDocReq:    process.env.PATIENT_DOCUMENT_DOCUMENT_REQUIRED,
    patientCouvSante:   process.env.PATIENT_DOCUMENT_COUVERTURE_SANTE,

    examenRoot:     process.env.EXAMEN_DOCUMENT_ROOT,
    examenFicheInfo:    process.env.EXAMEN_DOCUMENT_FICHE_INFO,
    examenConsentementTemplate:   process.env.EXAMEN_DOCUMENT_CONSENTEMENT_TEMPLATE,
    examenOrdonnanceTemplate:     process.env.EXAMEN_DOCUMENT_ORDONNANCE_TEMPLATE
  },

  twilio: {
    twilio_account_sid: process.env.TWILIO_ACCOUNT_SID,
    twilio_auth_token: process.env.TWILIO_AUTH_TOKEN,
    sms_sender: process.env.SMS_SENDER
  },
  
//   redis: {
//     name: process.env.REDIS_NAME,
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT
//   },

  secretKey: process.env.SECRET_KEY
};

export default config;
