const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });

const localConfig = require('./local.config').config;

let url = "smtps://" + localConfig.emailUsername + "%40" + localConfig.emailDomain
    + ":" + encodeURIComponent(localConfig.password)
    + "@smtp." + localConfig.emailDomain + ":" + localConfig.smtpPort;
let transporter = nodemailer.createTransport(url);

exports.sendMail = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        let remetente = localConfig.clientName + ' <' + localConfig.emailUsername + '@' + localConfig.emailDomain + '>';

        let assunto = req.body['assunto'];
        let destinatarios = req.body['destinatarios']; // lista de e-mails destinatarios separados por ,
        let corpo = req.body['corpo'];

        let email = {
            from: remetente,
            to: destinatarios,
            subject: assunto,
            text: corpo,
            html: "<b>" + corpo + "</b>"
        };

        transporter.sendMail(email, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
    });
});