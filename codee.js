PS C:\Users\W0024618\Desktop\swipeData\employee-ai-insights> node .\mailsend.js
❌ Error sending email: Error: connect ETIMEDOUT 172.253.118.108:465
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1637:16) {
  errno: -4039,
  code: 'ESOCKET',
  syscall: 'connect',
  address: '172.253.118.108',
  port: 465,
  command: 'CONN'
}
PS C:\Users\W0024618\Desktop\swipeData\employee-ai-insights> 
const nodemailer = require('nodemailer');

// ✅ Setup transporter
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL
    auth: {
        user: "mayurgabhale709@gmail.com",   // your Gmail
        pass: "syhqmnzfmjmqsojh"             // your App Password (not Gmail password)
    }
});

// ✅ Send mail function
async function sendMail(to, sub, msg) {
    try {
        let info = await transporter.sendMail({
            from: '"Mayur Gabhale" <mayurgabhale709@gmail.com>', // sender
            to: to,                                             // receiver(s)
            subject: sub,                                       // subject
            html: msg                                           // message body (HTML or plain text)
        });

        console.log("✅ Email sent successfully:", info.messageId);
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
}

// Test sending mail
sendMail("codingmayur@gmail.com", "This is a subject", "This is the message to send for mail");
