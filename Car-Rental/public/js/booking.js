/**
 * BOOKING PAGE - COMPLETE INTEGRATION - FIXED
 * Handles car booking form with database integration
 */

// ========================================
// STATE & GLOBAL VARIABLES
// ========================================
let selectedCar = null;
let currentUser = null;
let totalDays = 0;
let basePrice = 0;
let addonsPrice = 0;

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    checkAuth();
    
    // Load selected car
    await loadSelectedCar();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize theme
    initializeTheme();
});

// ========================================
// AUTHENTICATION CHECK
// ========================================
function checkAuth() {
    const user = localStorage.getItem('user');
    
    if (!user) {
        alert('Please sign in to book a car');
        window.location.href = '/signin';
        return;
    }
    
    try {
        currentUser = JSON.parse(user);
        
        // Pre-fill user data
        document.getElementById('fullName').value = currentUser.name || '';
        document.getElementById('email').value = currentUser.email || '';
    } catch (error) {
        console.error('Error parsing user data:', error);
        window.location.href = '/signin';
    }
}

// ========================================
// LOAD SELECTED CAR
// ========================================
async function loadSelectedCar() {
    const carId = localStorage.getItem('selectedCar');
    
    if (!carId) {
        alert('No car selected. Please select a car first.');
        window.location.href = '/';
        return;
    }
    
    try {
        const response = await fetch(`/api/cars/${carId}`);
        
        if (response.ok) {
            selectedCar = await response.json();
            renderSelectedCar();
        } else {
            throw new Error('Car not found');
        }
    } catch (error) {
        console.error('Error loading car:', error);
        alert('Error loading car details. Please try again.');
        window.location.href = '/';
    }
}

// ========================================
// RENDER SELECTED CAR
// ========================================
function renderSelectedCar() {
    const carCard = document.getElementById('selectedCarCard');
    
    carCard.innerHTML = `
        <div class="car-image-container">
            <img src="${selectedCar.image}" alt="${selectedCar.brand} ${selectedCar.model}">
            ${selectedCar.badge ? `<div class="car-badge">${selectedCar.badge}</div>` : ''}
        </div>
        <div class="car-details">
            <h3 class="car-name">${selectedCar.brand} ${selectedCar.model}</h3>
            <p class="car-year">Year: ${selectedCar.year}</p>
            <div class="car-specs">
                <div class="car-spec">
                    <i class="fas fa-tachometer-alt"></i>
                    <span>${selectedCar.horsepower} HP</span>
                </div>
                <div class="car-spec">
                    <i class="fas fa-users"></i>
                    <span>${selectedCar.seats} Seats</span>
                </div>
            </div>
        </div>
        <div class="car-price-display">
            <p class="price-label">Price per day</p>
            <div class="price-amount">$${selectedCar.price}</div>
            <span class="price-period">/day</span>
        </div>
    `;
}

// ========================================
// EVENT LISTENERS
// ========================================
function setupEventListeners() {
    const bookingForm = document.getElementById('bookingForm');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const pickupLocation = document.getElementById('pickupLocation');
    const dropoffLocation = document.getElementById('dropoffLocation');
    
    // Form submission
    bookingForm.addEventListener('submit', handleFormSubmit);
    
    // Date changes
    startDate.addEventListener('change', calculateDuration);
    endDate.addEventListener('change', calculateDuration);
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    startDate.min = today;
    endDate.min = today;
    
    // Location custom field toggles
    pickupLocation.addEventListener('change', function() {
        const customGroup = document.getElementById('customPickupGroup');
        customGroup.style.display = this.value === 'Custom' ? 'block' : 'none';
    });
    
    dropoffLocation.addEventListener('change', function() {
        const customGroup = document.getElementById('customDropoffGroup');
        customGroup.style.display = this.value === 'Custom' ? 'block' : 'none';
    });
    
    // Addon checkboxes
    const addonCheckboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
    addonCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', calculatePrice);
    });
}

// ========================================
// CALCULATE DURATION
// ========================================
function calculateDuration() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const durationDisplay = document.getElementById('rentalDuration');
    
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = end - start;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 0) {
            totalDays = diffDays;
            durationDisplay.innerHTML = `
                <i class="fas fa-clock"></i>
                <span>Rental Duration: <strong>${totalDays} day${totalDays > 1 ? 's' : ''}</strong></span>
            `;
            durationDisplay.classList.add('active');
            calculatePrice();
        } else {
            durationDisplay.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <span style="color: var(--error);">Return date must be after pickup date</span>
            `;
            durationDisplay.classList.remove('active');
            totalDays = 0;
        }
    }
}

// ========================================
// CALCULATE PRICE
// ========================================
function calculatePrice() {
    if (!selectedCar || totalDays === 0) return;
    
    // Base price
    basePrice = selectedCar.price * totalDays;
    
    // Calculate addons
    addonsPrice = 0;
    const insurance = document.getElementById('insurance');
    const gps = document.getElementById('gps');
    const childSeat = document.getElementById('childSeat');
    const driver = document.getElementById('driver');
    
    if (insurance && insurance.checked) addonsPrice += parseInt(insurance.value) * totalDays;
    if (gps && gps.checked) addonsPrice += parseInt(gps.value) * totalDays;
    if (childSeat && childSeat.checked) addonsPrice += parseInt(childSeat.value) * totalDays;
    if (driver && driver.checked) addonsPrice += parseInt(driver.value);
    
    // Update display
    document.getElementById('daysCount').textContent = totalDays;
    document.getElementById('basePrice').textContent = `$${basePrice}`;
    document.getElementById('totalPrice').textContent = `$${basePrice + addonsPrice}`;
    
    const addonsRow = document.getElementById('addonsRow');
    if (addonsPrice > 0) {
        addonsRow.style.display = 'flex';
        document.getElementById('addonsPrice').textContent = `$${addonsPrice}`;
    } else {
        addonsRow.style.display = 'none';
    }
}

// ========================================
// FORM SUBMISSION - FIXED!
// ========================================
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Calculate final pricing
    calculatePrice();
    
    // Prepare booking data with ALL required fields
    const bookingData = {
        userId: currentUser.id,
        carId: selectedCar._id,
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        driverLicense: document.getElementById('licenseNumber').value.trim(),
        pickupLocation: getLocationValue('pickupLocation', 'customPickup'),
        pickupAddress: getLocationValue('pickupLocation', 'customPickup'),
        pickupDate: document.getElementById('startDate').value,
        pickupTime: document.getElementById('startTime').value,
        returnLocation: getLocationValue('dropoffLocation', 'customDropoff'),
        returnAddress: getLocationValue('dropoffLocation', 'customDropoff') + ', ' + document.getElementById('address').value.trim(),
        returnDate: document.getElementById('endDate').value,
        returnTime: document.getElementById('endTime').value,
        totalDays: totalDays,
        pricePerDay: selectedCar.price,
        totalPrice: basePrice + addonsPrice,
        specialRequests: document.getElementById('notes').value.trim()
    };
    
    console.log('📦 Submitting booking data:', bookingData);
    
    // Show loading state
    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Booking successful:', data);
            
            // Show success modal
            showSuccessModal(data.booking._id);
            
            // Clear selected car from localStorage
            localStorage.removeItem('selectedCar');
        } else {
            throw new Error(data.error || 'Booking failed');
        }
    } catch (error) {
        console.error('❌ Booking error:', error);
        showErrorModal(error.message);
        
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// ========================================
// VALIDATION
// ========================================
function validateForm() {
    // Check dates
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (!startDate || !endDate) {
        alert('Please select pickup and return dates');
        return false;
    }
    
    if (totalDays <= 0) {
        alert('Return date must be after pickup date');
        return false;
    }
    
    // Check locations
    const pickupLocation = document.getElementById('pickupLocation').value;
    const dropoffLocation = document.getElementById('dropoffLocation').value;
    
    if (!pickupLocation || !dropoffLocation) {
        alert('Please select pickup and drop-off locations');
        return false;
    }
    
    if (pickupLocation === 'Custom' && !document.getElementById('customPickup').value.trim()) {
        alert('Please enter custom pickup address');
        return false;
    }
    
    if (dropoffLocation === 'Custom' && !document.getElementById('customDropoff').value.trim()) {
        alert('Please enter custom drop-off address');
        return false;
    }
    
    // Check terms
    if (!document.getElementById('terms').checked) {
        alert('Please agree to the Terms and Conditions');
        return false;
    }
    
    return true;
}

// ========================================
// HELPER FUNCTIONS
// ========================================
function getLocationValue(selectId, customId) {
    const select = document.getElementById(selectId);
    const customInput = document.getElementById(customId);
    
    if (select.value === 'Custom') {
        return customInput.value.trim();
    } else if (select.value === 'Same') {
        return getLocationValue('pickupLocation', 'customPickup');
    } else {
        return select.value;
    }
}

function showSuccessModal(bookingId) {
    const modal = document.getElementById('successModal');
    document.getElementById('bookingIdDisplay').textContent = bookingId.substring(0, 8).toUpperCase();
    modal.classList.add('active');
    
    console.log('✅ Success modal shown with booking ID:', bookingId);
}

function showErrorModal(message) {
    const modal = document.getElementById('errorModal');
    document.getElementById('errorMessage').textContent = message;
    modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
}

// Make closeModal global
window.closeModal = closeModal;

// ========================================
// THEME TOGGLE
// ========================================
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const themeToggle = document.getElementById('themeToggle');
    themeToggle?.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icon
        const icon = themeToggle.querySelector('i');
        icon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    });
}

console.log('🚗 Booking system initialized - FIXED VERSION');