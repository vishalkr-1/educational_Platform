const { userModel } = require('../model/registration.model')
const bcrypt = require('bcrypt')
const { setUser } = require('../service/auth')
const { body, validationResult } = require('express-validator');

const handleSignup = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password, location, age } = req.body

    try {
        bcrypt.hash(password, 10, async function (err, hash) {
            const user = new userModel({ name, email, password: hash, location, age })
            await user.save()
            console.log("registration successful")
            return res.status(200).redirect('/static/login')

        });
    } catch (err) {
        res.status(400).send({ "msg": err.message })
    }

}
const handleLogin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).send({ "msg": 'All fields are required' });
    }
    try {
        const user = await userModel.findOne({ email })
        // console.log(user)
        if (!user) {
            console.log("No user found with this email");
            return res.status(400).render('login', {
                error: "Invalid username"
            });
        }
        const isPassword = await bcrypt.compare(password, user.password)
        if (!isPassword) {
            console.log("password does not match")
            res.status(400).render('login', {
                error: "Invalid password"
            })
        }
        const token = setUser(user)
        const cookieOptions = {
            expires: new Date(Date.now() + 60 * 60 * 1000), // Expires in 1 hour
            httpOnly: true, // Optional: Helps mitigate XSS attacks
            secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS in production
            sameSite: 'strict' // Optional: Controls cookie behavior in cross-site requests
        };

        res.cookie("uid", token, cookieOptions);
        // res.cookie("uid", token)
        return res.status(200).redirect('/static/home')

    } catch (err) {
        console.error("Error during login:", err);
        return res.status(400).render('login', { error: 'An error occurred during login' });
    }

}
module.exports = {
    handleSignup,
    handleLogin
}