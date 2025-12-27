const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true,
        trim: true
    },
    model: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: Number,
        required: true,
        min: 1900,
        max: 2100
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    seats: {
        type: Number,
        required: true,
        min: 1,
        max: 20
    },
    horsepower: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'rented', 'maintenance'],
        default: 'available'
    },
    featured: {
        type: Boolean,
        default: false
    },
    badge: {
        type: String,
        enum: ['Popular', 'Luxury', 'New', 'Featured', 'Premium'],
        default: 'Featured'
    },
    features: [{
        type: String
    }],
    description: {
        type: String
    }
}, {
    timestamps: true
});

// Virtual for full car name
carSchema.virtual('fullName').get(function() {
    return `${this.brand} ${this.model}`;
});

// Method to check if car is available
carSchema.methods.isAvailable = function() {
    return this.status === 'available';
};

const Car = mongoose.model('Car', carSchema);

module.exports = Car;