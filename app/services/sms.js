const logger = require("../libs/logger");
const PNF = require("google-libphonenumber").PhoneNumberFormat;
const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();

import SMS from "../models/sms";
import config from '../config'

const client = require("twilio") (
  config.twilio.twilio_account_sid,
  config.twilio.twilio_auth_token
);

// ------------------- Send SMS login invitation  ---------------------------------
export async function sendLoginInvitation(phoneNumber, link) {
  try {
    if (config.node_env == "Test") {
      return "";
    }
    let message = `Bonjour, avant votre venue dans votre centre de radiologie MEDIKA, merci d'effectuer votre pré enregistrement en ligne à l'addresse suivante ${link}`;

    // Send an SMS with the message
    const result = await sendMessage(message, phoneNumber);
    logger.info(`The message with link ${link} has been sent to phone number ${phoneNumber}, sid: ${result.sid}`);
    
    // Saving the SMS in database
    if (result && result.sid) {
      let sms = await create({
        message: message,
        from: config.twilio.sms_sender,
        to: phoneNumber,
      });
      return sms;
    }

  } catch (err) {
    throw err;
  }
}

// ------------------- Send SMS  ---------------------------------
export async function sendMessage(message, phoneNumber) {
  try {
    const number = phoneUtil.parse(phoneNumber, "FR");
    const messageObjectSent = await client.messages.create({
      to: phoneUtil.format(number, PNF.INTERNATIONAL),
      from: process.env.SMS_SENDER,
      body: message,
    });
    return messageObjectSent;
  } catch (err) {
    throw err;
  }
}

// ---------------------------- CREATE ------------------------------------
export async function create(data) {
  try {
    let sms = await SMS.create(data);
    return sms.toObject();
  } catch (err) {
    throw err;
  }
}
