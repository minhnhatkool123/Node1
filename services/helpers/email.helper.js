const nodemailer = require("nodemailer");
const { google } = require("googleapis")

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const REFRESH_TOKEN_MAIL = process.env.REFRESH_TOKEN_MAIL

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN_MAIL })


const sendEmail = async (to, data, title) => {

    console.log('vao gui email')
    const accessToken = await oAuth2Client.getAccessToken()
    const smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            // user: process.env.USERNAME_GMAIL,
            // pass: proccess.env.PASS_GMAIL,
            type: 'OAuth2',
            user: "bokool123456789@gmail.com",
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN_MAIL,
            accessToken: accessToken
        },
    });

    const mailOptions = {
        //from: `PAYME ${USERNAME_GMAIL}`,
        from: 'PAYME <bokool123456789@gmail.com>',
        to: to,
        subject: 'Confirm Email',
        html: ` <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
		<h2 style="text-align: center; text-transform: uppercase;color: teal;">PAYME.</h2>
		<p>${title}</p>
		
		<h2>${data}</h2>`,
    };

    smtpTransport.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);

        }
        console.log(info);
    });
};

module.exports = { sendEmail }