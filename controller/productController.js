const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbid');
const slugify = require('slugify');
const mongoose = require('mongoose');

const createProduct = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.status(200).json({
            success: true,
            message: "Product created successfully",
            data: newProduct
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({
                success: false,
                error: error.message
            });
        } else {
            console.error(error);
            res.status(500).json({
                success: false,
                error: "Internal Server Error"
            });
        }
    }
});

const getSingleProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check if the ID is provided and not empty
    if (!id || id.trim() === '') {
        return res.status(400).json({
            success: false,
            error: "Please provide a product ID"
        });
    }

    // Check if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            error: "Please provide a valid product ID"
        });
    }

    try {
        // Find the product by ID
        const product = await Product.findById(id);

        // If product doesn't exist, return error
        if (!product) {
            return res.status(404).json({
                success: false,
                error: "Product not found"
            });
        }

        // Return the product
        res.json({ product });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
});

const getAllProduct = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ products });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
});

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updateProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ updateProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            error: "Please provide a valid product ID"
        });
    }
    try {
        const deleteProduct = await Product.findByIdAndDelete(id);
        res.json({ deleteProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
});

module.exports = { createProduct, getSingleProduct, getAllProduct, updateProduct, deleteProduct };
