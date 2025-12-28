const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');

// Middleware to check MongoDB connection
const checkConnection = (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ 
            error: 'Database not connected', 
            message: 'Please check your MongoDB connection. The server may still be connecting.',
            readyState: mongoose.connection.readyState
        });
    }
    next();
};

// GET all products
router.get('/', checkConnection, async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ 
            error: error.message,
            details: 'Failed to fetch products from database'
        });
    }
});

// GET a single product by ID
router.get('/:id', checkConnection, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST create a new product
router.post('/', checkConnection, async (req, res) => {
    try {
        const { name, description, price, image, category, inStock, source } = req.body;
        
        // Validate required fields
        if (!name || !description || !price || !image) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                required: ['name', 'description', 'price', 'image'],
                received: Object.keys(req.body)
            });
        }
        
        // Validate price is a number
        const priceNum = parseFloat(price);
        if (isNaN(priceNum) || priceNum < 0) {
            return res.status(400).json({ 
                error: 'Invalid price',
                message: 'Price must be a valid number greater than or equal to 0'
            });
        }
        
        const product = new Product({
            name: name.trim(),
            description: description.trim(),
            price: priceNum,
            image: image.trim(),
            category: category || 'custom',
            inStock: inStock !== undefined ? inStock : true,
            source: source || 'custom'
        });
        
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(400).json({ 
            error: error.message,
            details: error.errors ? Object.keys(error.errors) : 'Validation failed'
        });
    }
});

// PUT update a product
router.put('/:id', checkConnection, async (req, res) => {
    try {
        const { name, description, price, image, category, inStock } = req.body;
        
        // Validate price if provided
        if (price !== undefined) {
            const priceNum = parseFloat(price);
            if (isNaN(priceNum) || priceNum < 0) {
                return res.status(400).json({ 
                    error: 'Invalid price',
                    message: 'Price must be a valid number greater than or equal to 0'
                });
            }
        }
        
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                ...(name && { name: name.trim() }),
                ...(description && { description: description.trim() }),
                ...(price !== undefined && { price: parseFloat(price) }),
                ...(image && { image: image.trim() }),
                ...(category && { category }),
                ...(inStock !== undefined && { inStock })
            },
            { new: true, runValidators: true }
        );
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(400).json({ 
            error: error.message,
            details: error.errors ? Object.keys(error.errors) : 'Validation failed'
        });
    }
});

// DELETE a product
router.delete('/:id', checkConnection, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully', product });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE all products (for admin clear all functionality)
router.delete('/', checkConnection, async (req, res) => {
    try {
        // Only delete custom products, not default ones
        const result = await Product.deleteMany({ source: 'custom' });
        res.json({ message: 'All custom products deleted successfully', count: result.deletedCount });
    } catch (error) {
        console.error('Error clearing products:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

