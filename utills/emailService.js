const nodemailer = require("nodemailer")

// const { EMAIL_USER, EMAIL_PASS, JWT_SECRET } = process.env;

// if (!EMAIL_USER || !EMAIL_PASS || !JWT_SECRET) {
//   throw new Error("Missing environment variables");
// }

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "bhatraprerna061@gmail.com",
        pass: "rbit mqro fswd xiys",
    },
});


exports.sendVerificationEmail = async (email, otp) => {
    const mailOptions = {
        from: "bhatraprerna061@gmail.com",
        to: email,
        subject: 'Email Verification for food app',
        text: `Your OTP code is ${otp}`,
        // html: `
        //   <h1>Email Verification</h1>
        //   <p>Please verify your email by clicking the link below:</p>
        //   <a href="http://localhost:3000/verified?token=${token}">Verify Email</a>
        // `,
    };

    try {
        await transporter.sendMail(mailOptions);
        // console.log('Verification email sent successfully');
        return true;
    } catch (error) {
        return false
        console.error('Error sending verification email:', error);
    }
};

// sendVerificationEmail("hi","")
