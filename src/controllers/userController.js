const { hashPassword, comparePass } = require("../helper/authHelper");
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

    async changePassword (req, res) {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const userId = req.params.id;

        try {
            // Find the user by ID
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            // Check if the old password is correct
            const match = await comparePass(oldPassword, user.password);
            if (!match) {
                return res.status(400).json({ message: 'Old password is incorrect' });
            }
            // Check if the new password and confirm password match
            if (newPassword !== confirmPassword) {
                return res.status(400).json({ message: 'New password and confirm password do not match' });
            }
            // Hash the new password
            const hashedPassword = await hashPassword(newPassword, 10);
            // Update the user's password
            user.password = hashedPassword;
            await user.save();
            res.status(200).json({ message: 'Password changed successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = UserController;
