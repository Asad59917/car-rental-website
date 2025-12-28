const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Car = require('../models/car');
const User = require('../models/user');

// Get all bookings (Admin)
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('userId', 'name email')
            .populate('carId', 'brand model image price')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's bookings
router.get('/user/:userId', async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.params.userId })
            .populate('carId', 'brand model image price horsepower seats')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single booking
router.get('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('userId', 'name email')
            .populate('carId', 'brand model image price horsepower seats');
        
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new booking
router.post('/', async (req, res) => {
    try {
        const {
            userId,
            carId,
            fullName,
            email,
            phone,
            pickupLocation,
            pickupAddress,
            pickupDate,
            pickupTime,
            returnLocation,
            returnAddress,
            returnDate,
            returnTime,
            driverLicense,
            specialRequests
        } = req.body;

        // Validate car exists and is available
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }

        // Calculate total days and price
        const pickup = new Date(pickupDate);
        const returnD = new Date(returnDate);
        const totalDays = Math.ceil((returnD - pickup) / (1000 * 60 * 60 * 24));
        
        if (totalDays < 1) {
            return res.status(400).json({ error: 'Return date must be after pickup date' });
        }

        const totalPrice = totalDays * car.price;

        // Create booking
        const booking = new Booking({
            userId,
            carId,
            fullName,
            email,
            phone,
            pickupLocation,
            pickupAddress,
            pickupDate,
            pickupTime,
            returnLocation,
            returnAddress,
            returnDate,
            returnTime,
            driverLicense,
            specialRequests,
            totalDays,
            pricePerDay: car.price,
            totalPrice,
            status: 'pending'
        });

        await booking.save();

        // Populate the response
        const populatedBooking = await Booking.findById(booking._id)
            .populate('userId', 'name email')
            .populate('carId', 'brand model image price');

        res.status(201).json({
            message: 'Booking created successfully',
            booking: populatedBooking
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update booking status (Admin)
router.put('/:id/status', async (req, res) => {
    try {
        const { status, adminNotes } = req.body;
        
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        booking.status = status;
        if (adminNotes) {
            booking.adminNotes = adminNotes;
        }

        await booking.save();

        // Update car status if booking is confirmed or cancelled
        if (status === 'confirmed') {
            await Car.findByIdAndUpdate(booking.carId, { status: 'rented' });
        } else if (status === 'cancelled' || status === 'rejected') {
            await Car.findByIdAndUpdate(booking.carId, { status: 'available' });
        }

        const populatedBooking = await Booking.findById(booking._id)
            .populate('userId', 'name email')
            .populate('carId', 'brand model image price');

        res.json({
            message: 'Booking status updated',
            booking: populatedBooking
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update booking
router.put('/:id', async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
        .populate('userId', 'name email')
        .populate('carId', 'brand model image price');

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.json({
            message: 'Booking updated',
            booking
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete booking
router.delete('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Update car status to available if booking was confirmed
        if (booking.status === 'confirmed') {
            await Car.findByIdAndUpdate(booking.carId, { status: 'available' });
        }

        await Booking.findByIdAndDelete(req.params.id);

        res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;