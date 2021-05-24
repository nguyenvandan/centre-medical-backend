import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { omit } from "lodash";

import Dossier from "../../models/dossier";
import Secretary from "../../models/secretary";
import DossierHistory from "../../models/dossierhistory";
import Examen from "../../models/examen";
import ExamenCentre from "../../models/examencentre";
import SecretaryDossier from "../../models/secretarydossier";
import SMS from "../../models/sms";

const m2s = require("mongoose-to-swagger");

const swDossier = m2s(Dossier);
const swSecretary = m2s(Secretary);
const swDossierHistory = m2s(DossierHistory);
const swExamen = m2s(Examen);
const swExamenCentre = m2s(ExamenCentre);
const swSecretaryDossier = m2s(SecretaryDossier);
const swSMS = m2s(SMS);

// --------------------------
let swDossierPostParam = Object.assign(
  {loginPrefixLink: { type: 'string' }},
  omit(swDossier.properties, ["_id", "passwordHash", "createdAt", "updatedAt"])
);
let swDossierUpdateParam = Object.assign(
  {},
  omit(swDossier.properties, ["_id", "passwordHash", "createdAt", "updatedAt"])
);

//let swStoreUpdateParam = Object.assign({}, omit(swStore.properties, ['_id', 'createdAt', 'updatedAt']) );
// --------------------------
let swSecretaryPostParam = Object.assign(
  {},
  omit(swSecretary.properties, [
    "_id",
    "passwordHash",
    "createdAt",
    "updatedAt",
  ])
);
// --------------------------
let swDossierHistoryPostParam = Object.assign(
  {},
  omit(swDossierHistory.properties, ["_id", "createdAt", "updatedAt"])
);
// --------------------------
let swExamenPostParam = Object.assign(
  {},
  omit(swExamen.properties, ["_id", "createdAt", "updatedAt"])
);
let swExamenUpdateParam = Object.assign(
  {},
  omit(swExamen.properties, ["_id", "createdAt", "updatedAt"])
);
// --------------------------
let swExamenCentrePostParam = Object.assign(
  {},
  omit(swExamenCentre.properties, ["_id", "createdAt", "updatedAt"])
);
let swExamenCentreUpdateParam = Object.assign(
  {},
  omit(swExamenCentre.properties, ["_id", "createdAt", "updatedAt"])
);
// --------------------------
let swSecretaryDossierPostParam = Object.assign(
  {},
  omit(swSecretaryDossier.properties, ["_id", "createdAt", "updatedAt"])
);
// --------------------------
let swSMSPostParam = Object.assign(
  {},
  omit(swSMS.properties, ["_id", "from", "createdAt", "updatedAt"])
);
// --------------------------

// --------------------------
const paging = {
  totalDocs: { type: "number" },
  offset: { type: "number" },
  limit: { type: "number" },
  page: { type: "number" },
  totalPages: { type: "number" },
  pagingCounter: { type: "number" },
  hasPrevPage: { type: "boolean" },
  hasNextPage: { type: "boolean" },
  prevPage: { type: "number" },
  nextPage: { type: "number" },
};

const getPagingRes = (key, scheme) => {
  let properties = {};
  properties[key] = {
    type: "object",
    properties: Object.assign(
      {},
      {
        docs: {
          type: "array",
          items: {
            type: "object",
            properties: scheme,
          },
        },
      },
      paging
    ),
  };
  return {
    type: "object",
    properties: {
      data: {
        type: "object",
        properties: properties,
      },
      status: { type: "string", example: "success" },
    },
  };
};

// ////////////////////////////////////////
module.exports = function (app) {
  const options = {
    swaggerDefinition: {
      openapi: "3.0.0",

      info: {
        title: "Medika api",
        version: "V1.0",
        description: "medika api.<br>",
      },

      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },

        parameters: {
          offsetQuery: {
            in: "query",
            name: "offset",
            required: false,
            allowReserved: true,
            allowEmptyValue: true,
            description:
              "Offset. The number of items to skip before starting to collect the result set",
            schema: {
              type: "integer",
              min: 0,
            },
            example: "0",
          },
          limitQuery: {
            in: "query",
            name: "limit",
            required: false,
            allowReserved: true,
            allowEmptyValue: true,
            description: "Limit. The numbers of items to return",
            schema: {
              type: "integer",
              min: 1,
              maximum: 100,
            },
            example: 10,
          },
          optionQuery: {
            in: "query",
            name: "options",
            required: false,
            allowReserved: true,
            allowEmptyValue: true,
            description:
              "options = full if need to get full data (populate to related collections)",
            type: "string",
          },
          slugTitreUploadQuery: {
            in: "query",
            name: "slugTitre",
            required: false,
            allowReserved: true,
            allowEmptyValue: true,
            description: "slugTitre - of the file type need to upload",
            type: "string",
          },
          justificatiDroitSlugTitreUploadQuery: {
            in: "query",
            name: "justificatiDroitSlugTitre",
            required: false,
            allowReserved: true,
            allowEmptyValue: true,
            description: "justificatiDroitSlugTitre - of the file type need to upload",
            type: "string",
          },
          slugTitreConsentementQuery: {
            in: "query",
            name: "slugTitre",
            required: false,
            allowReserved: true,
            allowEmptyValue: true,
            description: "slugTitre - of the consentement type need to sign",
            type: "string",
          },
          // -------------------
          secretaryParam: {
            in: "path",
            name: "secretaryId",
            required: true,
            allowReserved: true,
            description: "Secretary id",
            schema: {
              type: "string",
            },
          },
          // -------------------
          dossierParam: {
            in: "path",
            name: "dossierId",
            required: true,
            allowReserved: true,
            description: "Dossier id",
            schema: {
              type: "string",
            },
          },
          // -------------------
          examenParam: {
            in: "path",
            name: "examenId",
            required: true,
            allowReserved: true,
            description: "Examen id",
            schema: {
              type: "string",
            },
          },
          // -------------------
          examenCentreParam: {
            in: "path",
            name: "examenCentreId",
            required: true,
            allowReserved: true,
            description: "ExamenCentre id",
            schema: {
              type: "string",
            },
          },
          // -------------------
          secretaryDossierParam: {
            in: "path",
            name: "secretaryDossierId",
            required: true,
            allowReserved: true,
            description: "SecretaryDossier id",
            schema: {
              type: "string",
            },
          },
        },

        responses: {
          UnauthorizedError: {
            description: "Access token is missing or invalid",
          },
        },

        schemas: {
          // -----------
          DossierPaging: getPagingRes("dossiers", swDossier.properties),
          Dossier: { type: "object", properties: swDossier.properties },
          DossierPostParam: { type: "object", properties: swDossierPostParam },
          DossierUpdateParam: {
            type: "object",
            properties: swDossierUpdateParam,
          },
          DossierRegisterParam: {
            type: "object",
            properties: {
              firstName: { type: "string" },
              lastName: { type: "string" },
              email: { type: "string" },
              address: {
                type: "object",
                properties: {
                  street: { type: "string" },
                  city: { type: "string" },
                  zipcode: { type: "string" },
                  country: { type: "string" },
                },
              },
            },
          },
          DossierUploadParam: {
            type: "object",
            properties: {
              doc: {
                type: "string",
                format: "binary",
              },
            },
          },
          DossierUpdateNoSecuriteSocialeParam: {
            type: "object",
            properties: {
              noSecuriteSociale: {
                type: "string",
              }
            },
          },

          // -----------
          Secretary: { type: "object", properties: swSecretary.properties },
          SecretaryPostParam: {
            type: "object",
            properties: swSecretaryPostParam,
          },

          // -----------
          DossierHistory: {
            type: "object",
            properties: swDossierHistory.properties,
          },
          DossierHistoryPostParam: {
            type: "object",
            properties: swDossierHistoryPostParam,
          },
          DossierHistoryList: {
            type: "object",
            properties: {
              history: {
                type: "array",
                items: {
                  type: "object",
                  properties: swDossierHistory.properties,
                },
              },
            },
          },

          // -----------
          Examen: { type: "object", properties: swExamen.properties },
          ExamenArray: {
            type: "object",
            properties: {
              data: {
                type: "object",
                properties: {
                  type: "object",
                  examens: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: swExamen.properties,
                    },
                  },
                },
              },
              status: {
                type: "string",
              },
            },
          },

          ExamenPostParam: { type: "object", properties: swExamenPostParam },
          ExamenUpdateParam: {
            type: "object",
            properties: swExamenUpdateParam,
          },

          // -----------
          ExamenCentre: {
            type: "object",
            properties: swExamenCentre.properties,
          },
          ExamenCentreArray: {
            type: "object",
            properties: {
              data: {
                type: "object",
                properties: {
                  type: "object",
                  examenCentres: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: swExamen.properties,
                    },
                  },
                },
              },
              status: {
                type: "string",
              },
            },
          },
          ExamenCentrePostParam: {
            type: "object",
            properties: swExamenCentrePostParam,
          },
          ExamenCentreUpdateParam: {
            type: "object",
            properties: swExamenCentreUpdateParam,
          },
          // -----------
          SecretaryDossier: {
            type: "object",
            properties: swSecretaryDossier.properties,
          },
          SecretaryDossierPostParam: {
            type: "object",
            properties: swSecretaryDossierPostParam,
          },
          // -----------
          SMS: {
            type: "object",
            properties: swSMS.properties,
          },
          SMSPostParam: {
            type: "object",
            properties: {
              link: {
                type: "string",
              },
              dossierId: {
                type: "string",
              },
            },
          },
        },
      },
    },

    apis: ["app/feature/**/*route.js"],
  };

  const swaggerSpec = swaggerJSDoc(options);
  app.get("/api-docs.json", function (req, res) {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  const uiOptions = {
    swaggerUrl: "/api-docs.json",
  };

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(null, uiOptions));
};
