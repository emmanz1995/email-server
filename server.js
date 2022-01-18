const express = require('express');
let nodemailer = require('nodemailer');
let cors = require('cors');
let router = express.Router();
require('dotenv').config()

const app = express();
const corsOptions = {
    origin: '*'
}
app.use(cors(corsOptions));
app.use(express.json());
app.use("/", router);


const email_smtp = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: "465",
    secure: true,
    auth: {
        type: "login",
        user: process.env.SECRET_USER,
        pass: process.env.SECRET_PASS,
    }
});

email_smtp.verify((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
});

router.post('/send', (req, res) =>{
    const { name, email, message } = req.body;
    if(!name || !email || !message) {
        return res.status(422).json({ message: 'Empty fields, please fill them out' });
    }
    const content = `name: ${name} \n email: ${email} \n message: ${message}`
    const mail = {
        from: name,
        to: 'emmanza2@googlemail.com',
        text: content
    }
    email_smtp.sendMail(mail, (err) => {
        if (err) {
            res.json({ status: 'Failure to send' });
        } else {
            res.json({ status: 'Sent' });
        }
    });
});

app.listen(5000, () => console.log("server is Running"));
