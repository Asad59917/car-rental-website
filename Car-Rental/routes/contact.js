const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/contactMessage'); 

router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, subject, message } = req.body;

        if (!firstName || !lastName || !email || !subject || !message) {
            return res.status(400).json({ 
                error: 'Please fill in all required fields' 
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                error: 'Please enter a valid email address' 
            });
        }

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

        res.status(201).json({
            message: 'Your message has been sent successfully!',
            messageId: contactMessage._id
        });

    } catch (error) {
        res.status(500).json({ 
            error: 'Server error. Please try again later.' 
        });
    }
});

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
        res.status(500).json({ 
            error: 'Error fetching messages' 
        });
    }
});

router.get('/unread-count', async (req, res) => {
    try {
        const count = await ContactMessage.countDocuments({ status: 'unread' });
        res.json({ count });

    } catch (error) {
        res.status(500).json({ 
            error: 'Error counting messages' 
        });
    }
});

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
        res.status(500).json({ 
            error: 'Error fetching message' 
        });
    }
});

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

        res.json(message);

    } catch (error) {
        res.status(500).json({ 
            error: 'Error updating message' 
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const message = await ContactMessage.findByIdAndDelete(req.params.id);

        if (!message) {
            return res.status(404).json({ 
                error: 'Message not found' 
            });
        }

        res.json({ 
            message: 'Contact message deleted successfully' 
        });

    } catch (error) {
        res.status(500).json({ 
            error: 'Error deleting message' 
        });
    }
});

module.exports = router;