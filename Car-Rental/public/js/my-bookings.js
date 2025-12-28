/**
 * MY BOOKINGS PAGE
 * User booking management and tracking
 */

// ========================================
// STATE
// ========================================
let currentUser = null;
let allBookings = [];
let filteredBookings = [];

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    checkAuth();
    
    // Load user bookings
    await loadBookings();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize theme
    initializeTheme();
});

// ========================================
// AUTHENTICATION
// ========================================
function checkAuth() {
    const user = localStorage.getItem('user');
    
    if (!user) {
        alert('Please sign in to view your bookings');
        window.location.href = '/signin';
        return;
    }
    
    try {
        currentUser = JSON.parse(user);
    } catch (error) {
        console.error('Error parsing user data:', error);
        window.location.href = '/signin';
    }
}

// ========================================
// LOAD BOOKINGS
// ========================================
async function loadBookings() {
    try {
        const response = await fetch(`/api/bookings/user/${currentUser.id}`);
        
        if (response.ok) {
            allBookings = await response.json();
            filteredBookings = [...allBookings];
            renderBookings();
            console.log(`✅ Loaded ${allBookings.length} bookings`);
        } else {
            throw new Error('Failed to load bookings');
        }
    } catch (error) {
        console.error('Error loading bookings:', error);
        showEmptyState();
    }
}

// ========================================
// RENDER BOOKINGS
// ========================================
function renderBookings() {
    const bookingsList = document.getElementById('bookingsList');
    const emptyState = document.getElementById('emptyState');
    
    if (filteredBookings.length === 0) {
        showEmptyState();
        return;
    }
    
    emptyState.style.display = 'none';
    
    bookingsList.innerHTML = filteredBookings.map(booking => {
        const car = booking.carId;
        const carName = car ? `${car.brand} ${car.model}` : 'Car details unavailable';
        const carImage = car?.image || 'https://via.placeholder.com/200x140';
        
        return `
            <div class="booking-card" data-booking-id="${booking._id}">
                <div class="booking-card-header">
                    <span class="booking-id">Booking #${booking._id.substring(0, 8).toUpperCase()}</span>
                    <span class="booking-status ${booking.status}">${booking.status.toUpperCase()}</span>
                </div>
                <div class="booking-card-body">
                    <div class="booking-car-image">
                        <img src="${carImage}" alt="${carName}">
                    </div>
                    <div class="booking-details">
                        <h3 class="booking-car-name">${carName}</h3>
                        <div class="booking-info-grid">
                            <div class="booking-info-item">
                                <i class="fas fa-calendar-check"></i>
                                <span>Pickup: ${formatDate(booking.pickupDate)}</span>
                            </div>
                            <div class="booking-info-item">
                                <i class="fas fa-calendar-times"></i>
                                <span>Return: ${formatDate(booking.returnDate)}</span>
                            </div>
                            <div class="booking-info-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${booking.pickupLocation}</span>
                            </div>
                            <div class="booking-info-item">
                                <i class="fas fa-dollar-sign"></i>
                                <span>Total: $${booking.totalPrice}</span>
                            </div>
                        </div>
                        ${booking.adminNotes ? `
                            <div style="margin-top: 1rem; padding: 0.75rem; background: var(--bg-primary); border-radius: var(--radius-md); border-left: 3px solid var(--accent);">
                                <strong style="color: var(--accent);">Admin Notes:</strong>
                                <p style="margin-top: 0.5rem; color: var(--text-secondary);">${booking.adminNotes}</p>
                            </div>
                        ` : ''}
                    </div>
                    <div class="booking-actions">
                        <button class="btn-view" onclick="viewBookingDetails('${booking._id}')">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                        ${booking.status === 'pending' ? `
                            <button class="btn-cancel" onclick="cancelBooking('${booking._id}')">
                                <i class="fas fa-times"></i> Cancel
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ========================================
// VIEW BOOKING DETAILS
// ========================================
window.viewBookingDetails = function(bookingId) {
    const booking = allBookings.find(b => b._id === bookingId);
    if (!booking) return;
    
    const car = booking.carId;
    const carName = car ? `${car.brand} ${car.model}` : 'Car details unavailable';
    const carImage = car?.image || 'https://via.placeholder.com/300x200';
    
    const detailsHTML = `
        <div class="details-header">
            <h2>Booking #${booking._id.substring(0, 8).toUpperCase()}</h2>
            <span class="booking-status details-status ${booking.status}">${booking.status.toUpperCase()}</span>
        </div>
        
        <div class="details-car">
            <div class="details-car-image">
                <img src="${carImage}" alt="${carName}">
            </div>
            <div class="details-car-info">
                <h3>${carName}</h3>
                ${car ? `
                    <div class="car-specs" style="margin-top: 1rem;">
                        <div class="car-spec">
                            <i class="fas fa-tachometer-alt"></i>
                            <span>${car.horsepower} HP</span>
                        </div>
                        <div class="car-spec">
                            <i class="fas fa-users"></i>
                            <span>${car.seats} Seats</span>
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
        
        <div class="details-section">
            <h4><i class="fas fa-user"></i> Customer Information</h4>
            <div class="details-grid">
                <div class="detail-item">
                    <span class="detail-label">Full Name</span>
                    <span class="detail-value">${booking.fullName}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Email</span>
                    <span class="detail-value">${booking.email}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Phone</span>
                    <span class="detail-value">${booking.phone}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Driver's License</span>
                    <span class="detail-value">${booking.driverLicense}</span>
                </div>
            </div>
        </div>
        
        <div class="details-section">
            <h4><i class="fas fa-calendar"></i> Rental Period</h4>
            <div class="details-grid">
                <div class="detail-item">
                    <span class="detail-label">Pickup Date</span>
                    <span class="detail-value">${formatDate(booking.pickupDate)} at ${booking.pickupTime}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Return Date</span>
                    <span class="detail-value">${formatDate(booking.returnDate)} at ${booking.returnTime}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Duration</span>
                    <span class="detail-value">${booking.totalDays} day${booking.totalDays > 1 ? 's' : ''}</span>
                </div>
            </div>
        </div>
        
        <div class="details-section">
            <h4><i class="fas fa-map-marker-alt"></i> Locations</h4>
            <div class="details-grid">
                <div class="detail-item">
                    <span class="detail-label">Pickup Location</span>
                    <span class="detail-value">${booking.pickupLocation}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Pickup Address</span>
                    <span class="detail-value">${booking.pickupAddress}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Return Location</span>
                    <span class="detail-value">${booking.returnLocation}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Return Address</span>
                    <span class="detail-value">${booking.returnAddress}</span>
                </div>
            </div>
        </div>
        
        ${booking.specialRequests ? `
            <div class="details-section">
                <h4><i class="fas fa-comment"></i> Special Requests</h4>
                <p style="padding: 1rem; background: var(--bg-primary); border-radius: var(--radius-md);">${booking.specialRequests}</p>
            </div>
        ` : ''}
        
        ${booking.adminNotes ? `
            <div class="details-section">
                <h4><i class="fas fa-user-shield"></i> Admin Notes</h4>
                <p style="padding: 1rem; background: var(--bg-primary); border-radius: var(--radius-md); border-left: 3px solid var(--accent);">${booking.adminNotes}</p>
            </div>
        ` : ''}
        
        <div class="details-price">
            <h4>Total Amount</h4>
            <div class="price-amount">$${booking.totalPrice}</div>
            <p style="margin-top: 0.5rem; opacity: 0.9;">
                ${booking.totalDays} days × $${booking.pricePerDay}/day
            </p>
        </div>
        
        <div style="text-align: center; margin-top: 2rem; padding-top: 2rem; border-top: 2px solid var(--border);">
            <small style="color: var(--text-muted);">
                Booked on ${formatDate(booking.createdAt)}
            </small>
        </div>
    `;
    
    const modal = document.getElementById('detailsModal');
    document.getElementById('bookingDetailsContent').innerHTML = detailsHTML;
    modal.classList.add('active');
};

// ========================================
// CANCEL BOOKING
// ========================================
let bookingToCancel = null;

window.cancelBooking = function(bookingId) {
    bookingToCancel = bookingId;
    const modal = document.getElementById('cancelModal');
    modal.classList.add('active');
};

document.getElementById('confirmCancelBtn')?.addEventListener('click', async () => {
    if (!bookingToCancel) return;
    
    try {
        const response = await fetch(`/api/bookings/${bookingToCancel}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: 'cancelled',
                adminNotes: 'Cancelled by user'
            })
        });
        
        if (response.ok) {
            closeModal('cancelModal');
            await loadBookings();
            alert('Booking cancelled successfully');
        } else {
            throw new Error('Failed to cancel booking');
        }
    } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Error cancelling booking. Please try again.');
    }
    
    bookingToCancel = null;
});

// ========================================
// FILTERS
// ========================================
function setupEventListeners() {
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    statusFilter?.addEventListener('change', applyFilters);
    sortFilter?.addEventListener('change', applyFilters);
}

function applyFilters() {
    const statusFilter = document.getElementById('statusFilter').value;
    const sortFilter = document.getElementById('sortFilter').value;
    
    // Filter by status
    filteredBookings = allBookings.filter(booking => {
        if (statusFilter === 'all') return true;
        return booking.status === statusFilter;
    });
    
    // Sort
    filteredBookings.sort((a, b) => {
        switch (sortFilter) {
            case 'newest':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'oldest':
                return new Date(a.createdAt) - new Date(b.createdAt);
            case 'price-high':
                return b.totalPrice - a.totalPrice;
            case 'price-low':
                return a.totalPrice - b.totalPrice;
            default:
                return 0;
        }
    });
    
    renderBookings();
}

// ========================================
// HELPER FUNCTIONS
// ========================================
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function showEmptyState() {
    const bookingsList = document.getElementById('bookingsList');
    const emptyState = document.getElementById('emptyState');
    
    bookingsList.innerHTML = '';
    emptyState.style.display = 'flex';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal?.classList.remove('active');
}

window.closeModal = closeModal;

// ========================================
// SIGN OUT
// ========================================
function handleSignOut() {
    if (confirm('Are you sure you want to sign out?')) {
        localStorage.removeItem('user');
        window.location.href = '/signin';
    }
}

window.handleSignOut = handleSignOut;

// ========================================
// THEME
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
        
        const icon = themeToggle.querySelector('i');
        icon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    });
}

console.log('📋 My Bookings page initialized');