import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  // Set up your email transport configuration
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: "tolexjoshua@gmail.com",
    pass: "xnac kxrm olkj hpoj",
  },
});
const sendResetEmail = (email:string, resetToken:string) => {
  const mailOptions = {
    from: "tolexjoshua@gmail.com",
    to: email,
    subject: "Password Reset",
    text: `Click the following link to reset your password: https://corenotes.net/reset-password/${resetToken}`,
  };

  transporter.sendMail(mailOptions, (error:any, info:any) => {
    if (error) {
      console.error("Error sending reset email:", error);
    } else {
      console.log("Reset email sent:", info.response);
    }
  });
};
export { sendResetEmail};
