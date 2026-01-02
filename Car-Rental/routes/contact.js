// Contact Message Routes
const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/contactMessage'); 

// @route   POST /api/contact
// @desc    Submit a contact form message
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, subject, message } = req.body;

        // Validation
        if (!firstName || !lastName || !email || !subject || !message) {
            return res.status(400).json({ 
                error: 'Please fill in all required fields' 
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                error: 'Please enter a valid email address' 
            });
        }

        // Create new contact message
        const contactMessage = new ContactMessage({
            firstName,
            lastName,
            email,
            phone: phone || '',
            subject,
            message,
            status: 'unread'
        });

        await contactMessage.save();

        console.log('✅ New contact message received from:', email);

        res.status(201).json({
            message: 'Your message has been sent successfully!',
            messageId: contactMessage._id
        });

    } catch (error) {
        console.error('❌ Error submitting contact form:', error);
        res.status(500).json({ 
            error: 'Server error. Please try again later.' 
        });
    }
});

// @route   GET /api/contact
// @desc    Get all contact messages (Admin only)
// @access  Private/Admin
router.get('/', async (req, res) => {
    try {
        const { status, limit = 100 } = req.query;
        
        let query = {};
        if (status && status !== 'all') {
            query.status = status;
        }

        const messages = await ContactMessage.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.json(messages);

    } catch (error) {
        console.error('❌ Error fetching contact messages:', error);
        res.status(500).json({ 
            error: 'Error fetching messages' 
        });
    }
});

// @route   GET /api/contact/unread-count
// @desc    Get count of unread messages (Admin only)
// @access  Private/Admin
router.get('/unread-count', async (req, res) => {
    try {
        const count = await ContactMessage.countDocuments({ status: 'unread' });
        res.json({ count });

    } catch (error) {
        console.error('❌ Error counting unread messages:', error);
        res.status(500).json({ 
            error: 'Error counting messages' 
        });
    }
});

// @route   GET /api/contact/:id
// @desc    Get a specific contact message (Admin only)
// @access  Private/Admin
router.get('/:id', async (req, res) => {
    try {
        const message = await ContactMessage.findById(req.params.id);
        
        if (!message) {
            return res.status(404).json({ 
                error: 'Message not found' 
            });
        }

        res.json(message);

    } catch (error) {
        console.error('❌ Error fetching message:', error);
        res.status(500).json({ 
            error: 'Error fetching message' 
        });
    }
});

// @route   PUT /api/contact/:id/status
// @desc    Update message status (Admin only)
// @access  Private/Admin
router.put('/:id/status', async (req, res) => {
    try {
        const { status, adminNotes } = req.body;

        const updateData = { status };
        if (adminNotes) updateData.adminNotes = adminNotes;
        if (status === 'replied') updateData.repliedAt = new Date();

        const message = await ContactMessage.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!message) {
            return res.status(404).json({ 
                error: 'Message not found' 
            });
        }

        console.log(`✅ Message ${req.params.id} status updated to: ${status}`);

        res.json(message);

    } catch (error) {
        console.error('❌ Error updating message status:', error);
        res.status(500).json({ 
            error: 'Error updating message' 
        });
    }
});

// @route   DELETE /api/contact/:id
// @desc    Delete a contact message (Admin only)
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
    try {
        const message = await ContactMessage.findByIdAndDelete(req.params.id);

        if (!message) {
            return res.status(404).json({ 
                error: 'Message not found' 
            });
        }

        console.log(`✅ Message ${req.params.id} deleted successfully`);

        res.json({ 
            message: 'Contact message deleted successfully' 
        });

    } catch (error) {
        console.error('❌ Error deleting message:', error);
        res.status(500).json({ 
            error: 'Error deleting message' 
        });
    }
});

module.exports = router;