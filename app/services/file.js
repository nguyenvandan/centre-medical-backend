let pdfFillForm = require("pdf-fill-form");

let appRoot = require("app-root-path");
const path = require("path");
var fs = require("fs-extra");

const logger = require("../libs/logger");

export async function fillPDFForm({
    templateFilePath,
    outputFilePath,
    fieldMappings,
    }) {
    
    // assurer source file exists
    if (!fs.existsSync(templateFilePath)) {
        throw new Error(`Le fichier '${templateFilePath}' n'existe pas`);
    }

    let fillOptions = { save: "imgpdf", cores: 4, scale: 0.2, antialias: true };
    let absOutputFilePath = path.resolve(`${appRoot}`, outputFilePath);
    let absTemplateFilePath = path.resolve(`${appRoot}`, templateFilePath);

    return new Promise((resolve, reject) => {
        pdfFillForm.write(absTemplateFilePath, fieldMappings, fillOptions).then(
            function (result) {
                return fs.outputFile(absOutputFilePath, result, function (err) {
                    if (err) {
                        return reject(err);
                    }
                    logger.info(`The file '${outputFilePath}' was saved!`);
                    return resolve(`The file ${outputFilePath} was saved!`);
                });
            },
            function (err) {
                return reject(err);
            }
        );
    });
}
  