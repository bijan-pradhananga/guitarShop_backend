const Category = require("../models/Category") 

class CategoryController {
    async index(req, res) {
        try {
            const catData = await Category.find();
            res.status(200).json(catData);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    async store(req, res) {
        try {
            await Category.create({ ...req.body });
            res.status(201).json({ message: 'Category created successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async show(req, res) {
        try {
            const catData = await Category.findById(req.params.id);
            res.status(200).json(catData);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    async update(req, res) {
        try {
            await Category.findByIdAndUpdate(req.params.id, { ...req.body });
            res.status(200).json({ message: 'Category updated successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async destroy(req, res) {
        try {
            await Category.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Category deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

}

module.exports =  CategoryController;