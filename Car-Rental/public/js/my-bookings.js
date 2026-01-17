function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (!mobileMenuToggle || !mobileNav || !mobileNavOverlay) return;
    
    function toggleMobileMenu() {
        const isActive = mobileNav.classList.contains('active');
        
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
    
    function openMobileMenu() {
        mobileMenuToggle.classList.add('active');
        mobileNav.classList.add('active');
        mobileNavOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMobileMenu() {
        mobileMenuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    mobileNavOverlay.addEventListener('click', closeMobileMenu);
    
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024 && mobileNav.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}


function initHeaderScrollEffect() {
    const header = document.querySelector('.modern-header');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

let currentUser = null;
let allBookings = [];
let filteredBookings = [];

document.addEventListener('DOMContentLoaded', async () => {

    initMobileMenu();
    
    initHeaderScrollEffect();
    
    checkAuth();
    
    initializeUserMenu();
    
    await loadBookings();
    
    setupEventListeners();
    
    initializeTheme();
});

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

function initializeUserMenu() {
    if (!currentUser) return;
    
    const welcomeMessage = localStorage.getItem('hasLoggedInBefore') === 'true' ? 'Welcome back' : 'Welcome';
    
    const userMenuContainer = document.getElementById('userMenuContainer');
    if (userMenuContainer) {
        userMenuContainer.innerHTML = `
            <div class="user-menu-container">
                <button class="btn-user-menu" id="userMenuBtn">
                    <svg class="user-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <div class="user-info">
                        <span class="user-welcome">${welcomeMessage}</span>
                        <span class="user-name">${currentUser.name}</span>
                    </div>
                    <svg class="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
                <div class="user-dropdown" id="userDropdown">
                    <div class="dropdown-header">
                        <div class="user-avatar">
                            ${currentUser.name.charAt(0).toUpperCase()}
                        </div>
                        <div class="user-details">
                            <p class="dropdown-user-name">${currentUser.name}</p>
                            <p class="dropdown-user-email">${currentUser.email}</p>
                        </div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <button class="dropdown-item" id="signoutBtn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        `;
        
        setupUserMenuListeners();
    }
    
    const mobileUserSection = document.getElementById('mobileUserSection');
    if (mobileUserSection) {
        mobileUserSection.innerHTML = `
            <div class="mobile-user-section">
                <div class="mobile-user-info">
                    <div class="mobile-user-avatar">${currentUser.name.charAt(0).toUpperCase()}</div>
                    <div>
                        <p class="mobile-user-name">${currentUser.name}</p>
                        <p class="mobile-user-email">${currentUser.email}</p>
                    </div>
                </div>
                <button class="mobile-nav-btn" id="mobileSignoutBtn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span>Sign Out</span>
                </button>
            </div>
        `;
        
        const mobileSignoutBtn = document.getElementById('mobileSignoutBtn');
        if (mobileSignoutBtn) {
            mobileSignoutBtn.addEventListener('click', handleSignOut);
        }
    }
}

function setupUserMenuListeners() {
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');
    const signoutBtn = document.getElementById('signoutBtn');
    
    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
        });
        
        document.addEventListener('click', (e) => {
            if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('active');
            }
        });
    }
    
    if (signoutBtn) {
        signoutBtn.addEventListener('click', () => {
            handleSignOut();
        });
    }
}

function handleSignOut() {
    if (confirm('Are you sure you want to sign out?')) {
        localStorage.removeItem('user');
        window.location.href = '/signin';
    }
}

window.handleSignOut = handleSignOut;

async function loadBookings() {
    try {
        const response = await fetch(`/api/bookings/user/${currentUser.id}`);
        
        if (response.ok) {
            allBookings = await response.json();
            filteredBookings = [...allBookings];
            renderBookings();
        
        } else {
            throw new Error('Failed to load bookings');
        }
    } catch (error) {
        console.error('Error loading bookings:', error);
        showEmptyState();
    }
}

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
                                <span>Total: AED ${booking.totalPrice}</span>
                            </div>
                        </div>
                        ${booking.adminNotes ? `
                            <div style="margin-top: 1rem; padding: 0.75rem; background: var(--bg-primary); border-radius: 0.75rem; border-left: 3px solid var(--accent-primary);">
                                <strong style="color: var(--accent-primary);">Admin Notes:</strong>
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
                <p style="padding: 1rem; background: var(--bg-primary); border-radius: 0.75rem;">${booking.specialRequests}</p>
            </div>
        ` : ''}
        
        ${booking.adminNotes ? `
            <div class="details-section">
                <h4><i class="fas fa-user-shield"></i> Admin Notes</h4>
                <p style="padding: 1rem; background: var(--bg-primary); border-radius: 0.75rem; border-left: 3px solid var(--accent-primary);">${booking.adminNotes}</p>
            </div>
        ` : ''}
        
        <div class="details-price">
            <h4>Total Amount</h4>
            <div class="price-amount">AED ${booking.totalPrice}</div>
            <p style="margin-top: 0.5rem; opacity: 0.9;">
                ${booking.totalDays} days × AED ${booking.pricePerDay}Dhs/day
            </p>
        </div>
        
        <div style="text-align: center; margin-top: 2rem; padding-top: 2rem; border-top: 2px solid var(--border-color);">
            <small style="color: var(--text-muted);">
                Booked on ${formatDate(booking.createdAt)}
            </small>
        </div>
    `;
    
    const modal = document.getElementById('detailsModal');
    document.getElementById('bookingDetailsContent').innerHTML = detailsHTML;
    modal.classList.add('active');
};

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

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const themeToggles = document.querySelectorAll('.theme-toggle');
    themeToggles.forEach(toggle => {
        toggle?.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    });
}
