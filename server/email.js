const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config()

const router = express.Router();

const transporter = nodemailer.createTransport({
    host: 'smtp.netcorecloud.net',
    port: 25,
    // secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

router.post('/send', async (req, res) => {
    // req.body.email -> send to SMTP client
    try {
        await transporter.sendMail({
            from: 'guyde0hda@pepisandbox.com',
            to: 'abukulsaba@gmail.com',
            subject: req.body.name + "-" + req.body.mail,
            html: req.body.message
        });
    } catch (e) {
        console.log(e);
        return res.sendStatus(500)
    }

    res.status(200).json('OK');
})

module.exports = router;