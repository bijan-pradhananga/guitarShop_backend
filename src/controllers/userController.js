const { hashPassword, comparePass } = require("../helper/authHelper");
const fs = require('fs');
const path = require('path');
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
            res.status(200).json({user});
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async update(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            // Handle image upload if a file is present in the request
            if (req.file) {
                const oldImagePath = user.image ? path.join(__dirname, '../../public/users', user.image) : null;
                // Save the new image
                const imagePath = req.file.filename;
                // Update the user's image path in the database
                req.body.image = imagePath;
                // Delete the old image if it exists
                if (oldImagePath && fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            // Update user data
            await User.findByIdAndUpdate(userId, req.body, { new: true });
            res.status(200).json({ message: 'User updated successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async destroy(req, res) {
        try {
            // Find the product by ID
            const user = await User.findById(req.params.id);
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            // Construct the image path
            const imagePath = user.image ? path.join(__dirname, '../../public/users', user.image) : null;
            
            // Delete the image file if it exists
            if (imagePath && fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
    
            // Delete the product from the database
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
                return res.status(404).json({success:false, message: 'User not found' });
            }
            // Check if the old password is correct
            const match = await comparePass(oldPassword, user.password);
            if (!match) {
                return res.status(400).json({success:false, message: 'Old password is incorrect' });
            }
            // Check if the new password and confirm password match
            if (newPassword !== confirmPassword) {
                return res.status(400).json({success:false, message: 'New password and confirm password do not match' });
            }
            // Hash the new password
            const hashedPassword = await hashPassword(newPassword, 10);
            // Update the user's password
            user.password = hashedPassword;
            await user.save();
            res.status(200).json({success:true, message: 'Password changed successfully' });
        } catch (err) {
            res.status(500).json({success:false, message: err.message });
        }
    }
}

module.exports = UserController;
