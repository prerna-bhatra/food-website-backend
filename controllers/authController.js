// controllers/authController.js
const { User } = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../utills/emailService');


exports.signup = async (req, res) => {
    try {
        const { name, email, password, userType = "customer", phone } = req.body;
        console.log({ name, email, password });
        if (!name || !name.trim() || !email || !email.trim() || !password || !password.trim()) {
            res.status(401).json({ error: 'Bad Request' });

        }
        const existingUser = await User.findOne({ where: { email } }); // Use where clause to specify conditions

        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = new User({
            username: name,
            email,
            password: hashedPassword,
            userType,
            phone,
            otp
        });
        await newUser.save();

        //  send otp to email now

        sendVerificationEmail(email, otp)

        res.status(200).json({ message: 'Signup successful' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !email.trim() || !password || !password.trim()) {
            res.status(401).json({ error: 'Bad Request' });

        }
        const user = await User.findOne({ email }); // Use where clause to specify conditions
        console.log("user", user);
        if (user && bcrypt.compareSync(password, user.password)) {

            const token = jwt.sign(
                {
                    userId: user.id,
                    email: user.email,
                    name: user.name,
                    userType: user.userType
                },
                process.env.JWT_SECRET,
                // { expiresIn: '2h' }
            );

            console.log("token", token);

            res.status(200).json({
                message: 'Login successful',
                token, user: {
                    name: user.username,
                    email: user.email,
                    userType: user.userType,
                    userId: user.id,
                    phone: user.phone,
                    isVerified:user.isVerified
                }

            });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !email.trim() || !otp || !otp.trim()) {
            res.status(401).json({ error: 'Bad Request' });
        }
        const user = await User.findOne({ email }); // Use where clause to specify conditions
        console.log("user", user);
        if (user) {

            if (otp === user.otp) {
                
                user.isVerified = true;
                await user.save();

                res.status(200).json({
                    message: 'Verification Successful',

                });
            }
            else {
                res.status(500).json({
                    message: 'Verification Failed',
                });
            }
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.resendOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !email.trim() || !otp || !otp.trim()) {
            res.status(401).json({ error: 'Bad Request' });
        }
        const user = await User.findOne({ email }); // Use where clause to specify conditions
        console.log("user", user);
        if (user) {

            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            const updateOTP = await User.updateOne(
                { email },
                { $set: { otp } }
            );

            await sendVerificationEmail(email, otp);

            res.status(200).json({ message: "Updated OTP" })

        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
