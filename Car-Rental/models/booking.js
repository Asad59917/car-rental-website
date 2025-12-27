const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value > this.startDate;
            },
            message: 'End date must be after start date'
        }
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending'
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

// Virtual for duration in days
bookingSchema.virtual('duration').get(function() {
    const diff = this.endDate - this.startDate;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// Method to check if booking is active
bookingSchema.methods.isActive = function() {
    const now = new Date();
    return this.status === 'confirmed' && 
           now >= this.startDate && 
           now <= this.endDate;
};

// Pre-save hook to calculate total amount
bookingSchema.pre('save', async function(next) {
    if (this.isModified('car') || this.isModified('startDate') || this.isModified('endDate')) {
        const Car = mongoose.model('Car');
        const car = await Car.findById(this.car);
        
        if (car) {
            const days = Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
            this.totalAmount = days * car.price;
        }
    }
    next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;