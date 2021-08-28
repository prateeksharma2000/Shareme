const nodemailer = require('nodemailer');

async function sendmail({from , to , subject , text , html}){
       
    let transporter = nodemailer.createTransport({
        service : process.env.SMTP_SERVICE,
        host: process.env.SMTP_HOST,
        auth:{
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    })

    let info = await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html
    })
    
}

module.exports = sendmail;