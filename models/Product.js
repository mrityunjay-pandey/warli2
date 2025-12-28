const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['rings', 'necklaces', 'earrings', 'bracelets', 'custom'],
        default: 'custom'
    },
    inStock: {
        type: Boolean,
        default: true
    },
    source: {
        type: String,
        enum: ['default', 'custom'],
        default: 'custom'
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Product', productSchema);


