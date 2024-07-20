const { hashPassword, comparePass } = require("../helper/authHelper");
const fs = require('fs');
const path = require('path');
const Admin = require("../models/Admin");

class AdminController {
    async index(req, res) {
        try {
            const admin = await Admin.find();
            res.status(200).json({admin});
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async store(req,res){
        try {
            let image = "";
            if (req.file) {
                image = req.file.filename;
            }
            let password = req.body.password;
            password = await hashPassword(password)
            const admin = await Admin.create({...req.body,password,image});
            res.status(201).json({message:"Admin Created Successfully"});
        } catch (error) {
            res.status(500).json({ message: err.message });
        }
    }

    async show(req,res){
        try {
            const admin = await Admin.findById(req.params.id);
            res.status(200).json(admin)
        } catch (error) {
            res.status(500).json({ message: err.message });
        }
    }

    async destroy(req,res){
        try {
            const admin = await Admin.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Admin deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: err.message });
        }
    }

    async update(req, res) {
        try {
            const adminId = req.params.id;
            const admin = await Admin.findById(adminId);
            if (!admin) {
                return res.status(404).json({ message: 'admin not found' });
            }
            // Handle image upload if a file is present in the request
            if (req.file) {
                const oldImagePath = admin.image ? path.join(__dirname, '../../public/admins', admin.image) : null;
                // Save the new image
                const imagePath = req.file.filename;
                // Update the admin's image path in the database
                req.body.image = imagePath;
                // Delete the old image if it exists
                if (oldImagePath && fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            // Update admin data
            await admin.findByIdAndUpdate(adminId, req.body, { new: true });
            res.status(200).json({ message: 'admin updated successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = AdminController;
