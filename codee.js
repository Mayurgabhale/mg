write correct code to send mail 
const nodemailer = require('nodemailer')


const transpoeter = nodemailer.createTransport(
    {
        secure:true,
        host:'smtp.gmail.com',
        port:465,
        auth:{
            user:'mayurgabhale709@gmail.com',
            pass:'syhqmnzfmjmqsojh'
        }
    }
);


function sendMail(to,sub,msg){
    transpoeter.sendMail({
        to:to,
        subject:sub,
        html:msg
    });

    console.log("email sent succrfully, ")

}

sendMail("codingmayur@gmail.com", "this is a subject", "this is the message to send for mail ")


PS C:\Users\W0024618\Desktop\swipeData\employee-ai-insights> node .\mailsend.js
