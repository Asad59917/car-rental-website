const express = require('express');
const router = express.Router();
const Car = require('../models/car');

router.get('/', async (req, res) => {
    try {
        const { status, brand, minPrice, maxPrice, featured } = req.query;
        let filter = {};
        
        if (status) filter.status = status;
        if (brand) filter.brand = new RegExp(brand, 'i');
        if (featured === 'true') filter.featured = true;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }
        
        const cars = await Car.find(filter).sort({ createdAt: -1 });
        res.json(cars);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ error: 'Car not found' });
        res.json(car);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newCar = new Car(req.body);
        await newCar.save();
        res.status(201).json(newCar);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const car = await Car.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (!car) return res.status(404).json({ error: 'Car not found' });
        res.json(car);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const car = await Car.findByIdAndDelete(req.params.id);
        if (!car) return res.status(404).json({ error: 'Car not found' });
        res.json({ message: 'Car deleted successfully', car });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/status/available', async (req, res) => {
    try {
        const cars = await Car.find({ status: 'available' });
        res.json(cars);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!['available', 'rented', 'maintenance'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        
        const car = await Car.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        
        if (!car) return res.status(404).json({ error: 'Car not found' });
        res.json(car);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;