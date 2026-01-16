const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true
    },
    subject: {
        type: String,
        required: true,
        enum: ['booking', 'support', 'feedback', 'partnership', 'other']
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['unread', 'read', 'replied'],
        default: 'unread'
    },
    adminNotes: {
        type: String,
        default: ''
    },
    repliedAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

contactMessageSchema.index({ status: 1, createdAt: -1 });
contactMessageSchema.index({ email: 1 });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);