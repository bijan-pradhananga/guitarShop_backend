const JWT = require("jsonwebtoken")
const { comparePass, hashPassword } = require("../helper/authHelper")
const User = require("../models/User")

const registerController = async (req, res) => {
    try {
        let image = "";
        if (req.file) {
            image = req.file.filename;
        }
        let password = req.body.password;
        password = await hashPassword(password);
        const user = await User.create({ ...req.body, password, image });
        if (user) {
            res.status(201).json({ message: 'User created successfully' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body
        //check email
        if (!email || !password) {
            return res.status(404).json({ message: 'Invalid Email or Password' })
        }
        //check user
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: 'User Not Found' })
        }
        const match = await comparePass(password, user.password)
        if (!match) {
            return res.status(401).send({ success: false, message: "invalid password" })
        }
        //generate token
        const token = await JWT.sign({ _id: user.id }, process.env.JWT_SECRET)
        res.cookie('jwt', token, {
            httOnly: true,
            expiresIn: 24 * 60 * 60 * 1000
        })
        //sending status
        res.status(200).send({
            success: true,
            user: {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username,
                email: user.email,
                address: user.address,
                phone: user.phone
            },
            token
        })
    } catch (error) {
        res.status(500).send({ message: error })
    }
}

//for authentication
const isAuthenticated  = async (req, res, next) => {
    try {
        const cookie = req.cookies['jwt'];
        if (!cookie) {
            return res.status(401).send({success: false, message: 'unauthenticated' });
        }

        const claims = JWT.verify(cookie, process.env.JWT_SECRET);
        if (!claims) {
            return res.status(401).send({success: false, message: 'unauthenticated' });
        }

        const user = await User.findOne({ _id: claims._id });
        if (!user) {
            return res.status(404).send({success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            user: {
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username,
                email: user.email,
                address: user.address,
                phone: user.phone
            }
        });
        next();
    } catch (error) {
        console.error('Error in cookieController:', error.message);
        res.status(500).send({ message: 'Internal server error' });
    }
};


//for logout
const logoutController = async (req, res) => {
    try {
        res.cookie('jwt', '', { expires: new Date(0) });
        res.status(200).send({
            success: true,
            message: 'logged out'
        });
    } catch (error) {
        console.error('Error in logoutController:', error.message);
        res.status(500).send({ success: false ,message: 'Internal server error' });
    }
};


module.exports = { loginController, registerController, isAuthenticated  ,logoutController}