const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // STARTTLS
    auth: {
        user: "mayurgabhale709@gmail.com",
        pass: "syhqmnzfmjmqsojh"
    }
});