/**
 * BOOKING PAGE - SMART BACK BUTTON
 * Remembers where user came from (home or fleet)
 */

// ========================================
// SMART BACK BUTTON
// ========================================
function initBackButton() {
    const backButton = document.getElementById('backButton');
    
    if (backButton) {
        backButton.addEventListener('click', () => {
            // Check if there's a referrer stored in sessionStorage
            const referrer = sessionStorage.getItem('bookingReferrer');
            
            if (referrer) {
                // Go to the stored referrer
                window.location.href = referrer;
            } else {
                // Check document.referrer
                const docReferrer = document.referrer;
                
                if (docReferrer && (docReferrer.includes('/fleet') || docReferrer.includes('fleet.html'))) {
                    window.location.href = '/fleet.html';
                } else if (docReferrer) {
                    window.location.href = docReferrer;
                } else {
                    // Default to home
                    window.location.href = '/';
                }
            }
        });
    }
}

// ========================================
// STATE
// ========================================
let selectedCar = null;
let currentUser = null;
let totalDays = 0;
let pricePerDay = 0;
let addonsTotal = 0;

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize back button
    initBackButton();
    
    // Check authentication
    checkAuth();
    
    // Load selected car
    await loadSelectedCar();
    
    // Setup event listeners
    setupEventListeners();
    
    // Set minimum dates
    setMinimumDates();
});

// ========================================
// AUTHENTICATION
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
        
        // Pre-fill form with user data
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
        alert('No car selected. Please select a car from the fleet.');
        window.location.href = '/fleet.html';
        return;
    }
    
    try {
        const response = await fetch(`/api/cars/${carId}`);
        
        if (response.ok) {
            selectedCar = await response.json();
            pricePerDay = selectedCar.price;
            renderCarCard();
            calculatePrice();
        } else {
            throw new Error('Car not found');
        }
    } catch (error) {
        console.error('Error loading car:', error);
        alert('Error loading car details. Please try again.');
        window.location.href = '/fleet.html';
    }
}

// ========================================
// RENDER CAR CARD
// ========================================
function renderCarCard() {
    if (!selectedCar) return;
    
    const cardHTML = `
        <div class="car-image-container">
            <img src="${selectedCar.image}" alt="${selectedCar.brand} ${selectedCar.model}">
            ${selectedCar.featured ? '<div class="car-badge">Featured</div>' : ''}
        </div>
        <div class="car-details">
            <h3 class="car-name">${selectedCar.brand} ${selectedCar.model}</h3>
            <p class="car-year">${selectedCar.year || '2024'}</p>
            <div class="car-specs">
                <div class="car-spec">
                    <i class="fas fa-tachometer-alt"></i>
                    <span>${selectedCar.horsepower} HP</span>
                </div>
                <div class="car-spec">
                    <i class="fas fa-users"></i>
                    <span>${selectedCar.seats} Seats</span>
                </div>
                <div class="car-spec">
                    <i class="fas fa-cog"></i>
                    <span>Automatic</span>
                </div>
                <div class="car-spec">
                    <i class="fas fa-gas-pump"></i>
                    <span>Premium</span>
                </div>
            </div>
        </div>
        <div class="car-price-display">
            <p class="price-label">Price per day</p>
            <p class="price-amount">$${selectedCar.price}</p>
            <p class="price-period">/day</p>
        </div>
    `;
    
    document.getElementById('selectedCarCard').innerHTML = cardHTML;
}

// ========================================
// SET MINIMUM DATES
// ========================================
function setMinimumDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    document.getElementById('startDate').min = todayStr;
    document.getElementById('endDate').min = tomorrowStr;
    
    document.getElementById('startDate').value = todayStr;
    document.getElementById('endDate').value = tomorrowStr;
}

// ========================================
// EVENT LISTENERS
// ========================================
function setupEventListeners() {
    // Date changes
    document.getElementById('startDate').addEventListener('change', handleDateChange);
    document.getElementById('endDate').addEventListener('change', handleDateChange);
    
    // Location changes
    document.getElementById('pickupLocation').addEventListener('change', handlePickupLocationChange);
    document.getElementById('dropoffLocation').addEventListener('change', handleDropoffLocationChange);
    
    // Addon changes
    document.querySelectorAll('input[type="checkbox"]:not(#terms)').forEach(checkbox => {
        checkbox.addEventListener('change', calculatePrice);
    });
    
    // Form submission
    document.getElementById('bookingForm').addEventListener('submit', handleSubmit);
}

// ========================================
// DATE HANDLING
// ========================================
function handleDateChange() {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    
    if (startDate && endDate && endDate > startDate) {
        const diffTime = Math.abs(endDate - startDate);
        totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        const durationEl = document.getElementById('rentalDuration');
        durationEl.innerHTML = `
            <i class="fas fa-clock"></i>
            <span>${totalDays} day${totalDays > 1 ? 's' : ''} rental period</span>
        `;
        durationEl.classList.add('active');
        
        calculatePrice();
    }
}

// ========================================
// LOCATION HANDLING
// ========================================
function handlePickupLocationChange() {
    const value = document.getElementById('pickupLocation').value;
    const customGroup = document.getElementById('customPickupGroup');
    
    if (value === 'Custom') {
        customGroup.style.display = 'block';
        document.getElementById('customPickup').required = true;
    } else {
        customGroup.style.display = 'none';
        document.getElementById('customPickup').required = false;
    }
}

function handleDropoffLocationChange() {
    const value = document.getElementById('dropoffLocation').value;
    const customGroup = document.getElementById('customDropoffGroup');
    
    if (value === 'Custom') {
        customGroup.style.display = 'block';
        document.getElementById('customDropoff').required = true;
    } else {
        customGroup.style.display = 'none';
        document.getElementById('customDropoff').required = false;
    }
}

// ========================================
// PRICE CALCULATION
// ========================================
function calculatePrice() {
    if (totalDays === 0) return;
    
    // Calculate base price
    const basePrice = pricePerDay * totalDays;
    
    // Calculate addons
    addonsTotal = 0;
    let addonsText = [];
    
    const insurance = document.getElementById('insurance');
    const gps = document.getElementById('gps');
    const childSeat = document.getElementById('childSeat');
    const driver = document.getElementById('driver');
    
    if (insurance.checked) {
        const insuranceCost = parseInt(insurance.value) * totalDays;
        addonsTotal += insuranceCost;
        addonsText.push(`Insurance: $${insuranceCost}`);
    }
    
    if (gps.checked) {
        const gpsCost = parseInt(gps.value) * totalDays;
        addonsTotal += gpsCost;
        addonsText.push(`GPS: $${gpsCost}`);
    }
    
    if (childSeat.checked) {
        const seatCost = parseInt(childSeat.value) * totalDays;
        addonsTotal += seatCost;
        addonsText.push(`Child Seat: $${seatCost}`);
    }
    
    if (driver.checked) {
        const driverCost = parseInt(driver.value);
        addonsTotal += driverCost;
        addonsText.push(`Additional Driver: $${driverCost}`);
    }
    
    // Update display
    document.getElementById('daysCount').textContent = totalDays;
    document.getElementById('basePrice').textContent = `$${basePrice}`;
    
    const addonsRow = document.getElementById('addonsRow');
    if (addonsTotal > 0) {
        addonsRow.style.display = 'flex';
        document.getElementById('addonsPrice').textContent = `$${addonsTotal}`;
    } else {
        addonsRow.style.display = 'none';
    }
    
    const totalPrice = basePrice + addonsTotal;
    document.getElementById('totalPrice').textContent = `$${totalPrice}`;
}

// ========================================
// FORM SUBMISSION
// ========================================
async function handleSubmit(e) {
    e.preventDefault();
    
    if (!selectedCar || !currentUser) {
        alert('Missing required information');
        return;
    }
    
    // Get form data
    const pickupLocation = document.getElementById('pickupLocation').value;
    const dropoffLocation = document.getElementById('dropoffLocation').value;
    
    const bookingData = {
        userId: currentUser.id,
        carId: selectedCar._id || selectedCar.id,
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        driverLicense: document.getElementById('licenseNumber').value,
        pickupLocation: pickupLocation === 'Custom' ? document.getElementById('customPickup').value : pickupLocation,
        pickupAddress: pickupLocation === 'Custom' ? document.getElementById('customPickup').value : pickupLocation,
        pickupDate: document.getElementById('startDate').value,
        pickupTime: document.getElementById('startTime').value,
        returnLocation: dropoffLocation === 'Custom' ? document.getElementById('customDropoff').value : (dropoffLocation === 'Same' ? pickupLocation : dropoffLocation),
        returnAddress: dropoffLocation === 'Custom' ? document.getElementById('customDropoff').value : (dropoffLocation === 'Same' ? pickupLocation : dropoffLocation),
        returnDate: document.getElementById('endDate').value,
        returnTime: document.getElementById('endTime').value,
        totalDays: totalDays,
        pricePerDay: pricePerDay,
        totalPrice: pricePerDay * totalDays + addonsTotal,
        specialRequests: document.getElementById('notes').value
    };
    
    try {
        // Disable submit button
        const submitBtn = document.querySelector('.btn-submit');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });
        
        if (response.ok) {
            const result = await response.json();
            
            // Show success modal
            document.getElementById('bookingIdDisplay').textContent = result._id.substring(0, 8).toUpperCase();
            showModal('successModal');
            
            // Clear selected car
            localStorage.removeItem('selectedCar');
            
        } else {
            throw new Error('Booking failed');
        }
    } catch (error) {
        console.error('Error submitting booking:', error);
        document.getElementById('errorMessage').textContent = 'An error occurred while processing your booking. Please try again.';
        showModal('errorModal');
        
        // Re-enable submit button
        const submitBtn = document.querySelector('.btn-submit');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Submit Booking Request';
    }
}

// ========================================
// MODAL FUNCTIONS
// ========================================
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
}

window.closeModal = closeModal;

console.log('📝 Booking page with smart back button initialized');