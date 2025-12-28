const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },
    // Customer Information
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    driverLicense: {
        type: String,
        required: true,
        trim: true
    },
    // Pickup Details
    pickupLocation: {
        type: String,
        required: true
    },
    pickupAddress: {
        type: String,
        required: true
    },
    pickupDate: {
        type: Date,
        required: true
    },
    pickupTime: {
        type: String,
        required: true
    },
    // Return Details
    returnLocation: {
        type: String,
        required: true
    },
    returnAddress: {
        type: String,
        required: true
    },
    returnDate: {
        type: Date,
        required: true
    },
    returnTime: {
        type: String,
        required: true
    },
    // Pricing
    totalDays: {
        type: Number,
        required: true,
        min: 1
    },
    pricePerDay: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    // Status
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'rejected', 'cancelled', 'completed'],
        default: 'pending'
    },
    // Additional Info
    specialRequests: {
        type: String,
        default: ''
    },
    adminNotes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Update timestamps on save
bookingSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;