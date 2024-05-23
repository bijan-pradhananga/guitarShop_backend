const { hashPassword } = require("../helper/authHelper");
const User = require("../models/User");

class UserController {
    async index(req, res) {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async store(req, res) {
        try {
            let image = "";
            if (req.file) {
                image = req.file.filename;
            }
            let password = req.body.password;
            password = await hashPassword(password);
            const user = await User.create({ ...req.body, password, image });
            res.status(201).json({ message: 'User created successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async show(req, res) {
        try {
            const user = await User.findById(req.params.id);
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async update(req, res) {
        try {
            await User.findByIdAndUpdate(req.params.id, req.body);
            res.status(200).json({ message: 'User updated successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async destroy(req, res) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = UserController;
