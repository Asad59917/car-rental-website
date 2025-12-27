const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Car = require('../models/car');

// Get all bookings
router.get('/', async (req, res) => {
    try {
        const { status, userId, carId } = req.query;
        let filter = {};
        
        if (status) filter.status = status;
        if (userId) filter.user = userId;
        if (carId) filter.car = carId;
        
        const bookings = await Booking.find(filter)
            .populate('user', 'name email')
            .populate('car', 'brand model price')
            .sort({ createdAt: -1 });
        
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a booking by ID
router.get('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('user', 'name email')
            .populate('car', 'brand model price image');
        
        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new booking
router.post('/', async (req, res) => {
    try {
        const { user, car, startDate, endDate } = req.body;
        
        // Check if car is available
        const carDoc = await Car.findById(car);
        if (!carDoc) {
            return res.status(404).json({ error: 'Car not found' });
        }
        
        if (!carDoc.isAvailable()) {
            return res.status(400).json({ error: 'Car is not available' });
        }
        
        // Check for overlapping bookings
        const overlappingBooking = await Booking.findOne({
            car,
            status: { $in: ['pending', 'confirmed'] },
            $or: [
                {
                    startDate: { $lte: new Date(endDate) },
                    endDate: { $gte: new Date(startDate) }
                }
            ]
        });
        
        if (overlappingBooking) {
            return res.status(400).json({ 
                error: 'Car is already booked for the selected dates' 
            });
        }
        
        // Create booking
        const newBooking = new Booking(req.body);
        await newBooking.save();
        
        // Update car status
        carDoc.status = 'rented';
        await carDoc.save();
        
        // Populate and return
        await newBooking.populate('user', 'name email');
        await newBooking.populate('car', 'brand model price');
        
        res.status(201).json(newBooking);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update a booking
router.put('/:id', async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
        .populate('user', 'name email')
        .populate('car', 'brand model price');
        
        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        res.json(booking);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a booking
router.delete('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        
        // Update car status back to available
        const car = await Car.findById(booking.car);
        if (car && car.status === 'rented') {
            car.status = 'available';
            await car.save();
        }
        
        await booking.deleteOne();
        res.json({ message: 'Booking deleted successfully', booking });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update booking status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        )
        .populate('user', 'name email')
        .populate('car', 'brand model price');
        
        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        
        // Update car status if booking is completed or cancelled
        if (status === 'completed' || status === 'cancelled') {
            const car = await Car.findById(booking.car);
            if (car && car.status === 'rented') {
                car.status = 'available';
                await car.save();
            }
        }
        
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user bookings
router.get('/user/:userId', async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.params.userId })
            .populate('car', 'brand model price image')
            .sort({ createdAt: -1 });
        
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get booking statistics
router.get('/stats/summary', async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments();
        const pendingBookings = await Booking.countDocuments({ status: 'pending' });
        const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
        const completedBookings = await Booking.countDocuments({ status: 'completed' });
        const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
        
        const totalRevenue = await Booking.aggregate([
            { $match: { status: { $in: ['confirmed', 'completed'] } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        
        res.json({
            totalBookings,
            pendingBookings,
            confirmedBookings,
            completedBookings,
            cancelledBookings,
            totalRevenue: totalRevenue[0]?.total || 0
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;