const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      port: 587,
      // secure: false,
      // requireTLS: true,
      auth: {
        // user: "b57a63ae263fb0",
        // pass: "4445ab44be1fe7",
        user: "20mapog003@ddu.ac.in",
        pass: "raj_111099",
        // user: "dhruvilgajera30@gmail.com",
        // pass: "9033232788docomo"
      },
      // tls:{
      //     rejectUnauthorized : false,
      // }
    });
    await transporter.sendMail({
      from: "dhruvilgajera30@gmai.com",
      to: email,
      subject: subject,
      text: text,
    });

    console.log("email sent sucessfully");
  } catch (error) {
    console.log(error, "email not sent");
  }
};

module.exports = sendEmail;
