// ========================================
// ADMIN DASHBOARD - COMPLETE UPDATED VERSION
// Replace your entire admin-script.js with this file
// ========================================

// ========================================
// STATE MANAGEMENT
// ========================================
const state = {
    currentSection: 'dashboard',
    users: [],
    cars: [],
    bookings: [],
    currentUser: null,
    currentCar: null,
    currentBooking: null
};

// ========================================
// DOM ELEMENTS
// ========================================
const elements = {
    sidebar: document.getElementById('sidebar'),
    sidebarToggle: document.getElementById('sidebarToggle'),
    mobileMenuToggle: document.getElementById('mobileMenuToggle'),
    navItems: document.querySelectorAll('.nav-item'),
    contentSections: document.querySelectorAll('.content-section'),
    pageTitle: document.getElementById('pageTitle'),
    themeToggle: document.getElementById('themeToggle'),
    logoutBtn: document.getElementById('logoutBtn'),
    userModal: document.getElementById('userModal'),
    carModal: document.getElementById('carModal'),
    bookingModal: document.getElementById('bookingModal'),
    userForm: document.getElementById('userForm'),
    carForm: document.getElementById('carForm'),
    bookingForm: document.getElementById('bookingForm'),
    usersTable: document.getElementById('usersTable'),
    carsGrid: document.getElementById('carsGrid'),
    bookingsTable: document.getElementById('bookingsTable'),
    recentBookingsTable: document.getElementById('recentBookingsTable'),
    totalUsers: document.getElementById('totalUsers'),
    totalCars: document.getElementById('totalCars'),
    totalBookings: document.getElementById('totalBookings')
};

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Admin Dashboard Starting...');
    initializeEventListeners();
    loadDashboardData();
    checkAuthStatus();
    initializeTheme();
    console.log('✅ Admin Dashboard Initialized Successfully');
});

function initializeEventListeners() {
    console.log('📋 Setting up event listeners...');
    
    // Sidebar toggles
    if (elements.sidebarToggle) {
        elements.sidebarToggle.addEventListener('click', toggleSidebar);
    }
    if (elements.mobileMenuToggle) {
        elements.mobileMenuToggle.addEventListener('click', toggleMobileSidebar);
    }
    
    // Navigation items
    elements.navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            navigateToSection(section);
        });
    });
    
    // Theme toggle
    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Logout
    if (elements.logoutBtn) {
        elements.logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // Close modals on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAllModals();
            }
        });
    });
    
    // Add buttons
    const addUserBtn = document.getElementById('addUserBtn');
    const addCarBtn = document.getElementById('addCarBtn');
    const addBookingBtn = document.getElementById('addBookingBtn');
    
    if (addUserBtn) addUserBtn.addEventListener('click', () => openUserModal());
    if (addCarBtn) addCarBtn.addEventListener('click', () => openCarModal());
    if (addBookingBtn) addBookingBtn.addEventListener('click', () => openBookingModal());
    
    // Form submissions
    if (elements.userForm) elements.userForm.addEventListener('submit', handleUserSubmit);
    if (elements.carForm) elements.carForm.addEventListener('submit', handleCarSubmit);
    if (elements.bookingForm) elements.bookingForm.addEventListener('submit', handleBookingSubmit);
    
    console.log('✅ Event listeners configured');
}

// ========================================
// AUTHENTICATION
// ========================================
function checkAuthStatus() {
    const adminUser = localStorage.getItem('adminUser');
    if (!adminUser) {
        console.log('⚠️ No admin user in localStorage');
    } else {
        console.log('✅ Admin user authenticated');
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('adminUser');
        window.location.href = '/';
    }
}

// ========================================
// NAVIGATION
// ========================================
function navigateToSection(section) {
    console.log('📍 Navigating to:', section);
    state.currentSection = section;
    
    // Update active nav item
    elements.navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === section) {
            item.classList.add('active');
        }
    });
    
    // Update content sections
    elements.contentSections.forEach(contentSection => {
        contentSection.classList.remove('active');
        if (contentSection.id === `${section}-section`) {
            contentSection.classList.add('active');
        }
    });
    
    // Update page title
    const titles = {
        dashboard: 'Dashboard',
        users: 'User Management',
        cars: 'Car Management',
        bookings: 'Booking Management',
        analytics: 'Analytics & Reports',
        settings: 'Settings'
    };
    
    if (elements.pageTitle) {
        elements.pageTitle.textContent = titles[section] || 'Dashboard';
    }
    
    // Load section-specific data
    loadSectionData(section);
}

function loadSectionData(section) {
    switch(section) {
        case 'users':
            loadUsers();
            break;
        case 'cars':
            loadCars();
            break;
        case 'bookings':
            loadBookings();
            break;
        case 'analytics':
            console.log('📈 Analytics section');
            break;
        case 'settings':
            console.log('⚙️ Settings section');
            break;
    }
}

// ========================================
// SIDEBAR
// ========================================
function toggleSidebar() {
    if (elements.sidebar) {
        elements.sidebar.classList.toggle('collapsed');
    }
}

function toggleMobileSidebar() {
    if (elements.sidebar) {
        elements.sidebar.classList.toggle('mobile-open');
    }
}

// ========================================
// THEME MANAGEMENT
// ========================================
function initializeTheme() {
    const savedTheme = localStorage.getItem('adminTheme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('adminTheme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = elements.themeToggle?.querySelector('i');
    if (icon) {
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// ========================================
// DATA LOADING
// ========================================
async function loadDashboardData() {
    console.log('📊 Loading dashboard data...');
    try {
        await Promise.all([
            loadUsers(),
            loadCars(),
            loadBookings()
        ]);
        
        updateDashboardStats();
        loadRecentBookings();
        console.log('✅ Dashboard data loaded successfully');
    } catch (error) {
        console.error('❌ Error loading dashboard data:', error);
    }
}

async function loadUsers() {
    try {
        const response = await fetch('/users');
        if (response.ok) {
            state.users = await response.json();
            renderUsersTable();
            updateDashboardStats();
            console.log('✅ Loaded', state.users.length, 'users');
        } else {
            console.error('Failed to load users');
        }
    } catch (error) {
        console.error('❌ Error loading users:', error);
        showNotification('Error loading users', 'error');
    }
}

async function loadCars() {
    try {
        const response = await fetch('/api/cars');
        if (response.ok) {
            state.cars = await response.json();
            renderCarsGrid();
            updateDashboardStats();
            console.log('✅ Loaded', state.cars.length, 'cars');
        } else {
            console.error('Failed to load cars');
        }
    } catch (error) {
        console.error('❌ Error loading cars:', error);
        showNotification('Error loading cars', 'error');
    }
}

async function loadBookings() {
    try {
        const response = await fetch('/api/bookings');
        if (response.ok) {
            state.bookings = await response.json();
            renderBookingsTable();
            loadRecentBookings();
            updateDashboardStats();
            console.log('✅ Loaded', state.bookings.length, 'bookings');
        } else {
            console.error('Failed to load bookings');
        }
    } catch (error) {
        console.error('❌ Error loading bookings:', error);
        showNotification('Error loading bookings', 'error');
    }
}

// ========================================
// DASHBOARD STATS
// ========================================
function updateDashboardStats() {
    if (elements.totalUsers) {
        elements.totalUsers.textContent = state.users.length;
    }
    if (elements.totalCars) {
        elements.totalCars.textContent = state.cars.length;
    }
    if (elements.totalBookings) {
        elements.totalBookings.textContent = state.bookings.length;
    }
}

// ========================================
// USERS TABLE RENDERING
// ========================================
function renderUsersTable() {
    if (!elements.usersTable) return;
    
    if (state.users.length === 0) {
        elements.usersTable.innerHTML = '<tr><td colspan="6" class="no-data">No users found</td></tr>';
        return;
    }
    
    elements.usersTable.innerHTML = state.users.map(user => `
        <tr>
            <td>${user._id?.substring(0, 8) || 'N/A'}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${new Date(user.createdAt || Date.now()).toLocaleDateString()}</td>
            <td><span class="status-badge active">Active</span></td>
            <td>
                <button class="action-btn edit" onclick="editUser('${user._id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteUser('${user._id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// ========================================
// CARS GRID RENDERING
// ========================================
function renderCarsGrid() {
    if (!elements.carsGrid) return;
    
    if (state.cars.length === 0) {
        elements.carsGrid.innerHTML = '<div class="loading-state">No cars found</div>';
        return;
    }
    
    elements.carsGrid.innerHTML = state.cars.map(car => {
        const carId = car._id || car.id;
        return `
        <div class="car-card">
            <img src="${car.image}" alt="${car.brand} ${car.model}" class="car-image">
            <div class="car-details">
                <div class="car-header">
                    <div>
                        <div class="car-name">${car.brand} ${car.model}</div>
                        <div style="font-size: 0.875rem; color: var(--admin-text-muted);">${car.year}</div>
                    </div>
                    <div class="car-price">$${car.price}/day</div>
                </div>
                <div class="car-specs">
                    <div class="car-spec">
                        <i class="fas fa-users"></i> ${car.seats} seats
                    </div>
                    <div class="car-spec">
                        <i class="fas fa-tachometer-alt"></i> ${car.horsepower} HP
                    </div>
                </div>
                <div style="margin-bottom: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <span class="status-badge ${car.status}">${car.status}</span>
                    ${car.featured ? `<span class="status-badge confirmed"><i class="fas fa-star"></i> ${car.badge || 'Featured'}</span>` : ''}
                </div>
                <div class="car-actions">
                    <button class="btn-primary" onclick="editCar('${carId}')" style="flex: 1;">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-danger" onclick="deleteCar('${carId}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    }).join('');
}

// ========================================
// BOOKINGS TABLE RENDERING
// ========================================
function renderBookingsTable() {
    if (!elements.bookingsTable) return;
    
    if (state.bookings.length === 0) {
        elements.bookingsTable.innerHTML = '<tr><td colspan="9" class="no-data">No bookings found</td></tr>';
        return;
    }
    
    elements.bookingsTable.innerHTML = state.bookings.map(booking => {
        const customerName = booking.userId?.name || booking.fullName || 'N/A';
        const carName = booking.carId ? `${booking.carId.brand} ${booking.carId.model}` : 'N/A';
        
        return `
        <tr>
            <td>#${booking._id.substring(0, 8).toUpperCase()}</td>
            <td>${customerName}</td>
            <td>${carName}</td>
            <td>${new Date(booking.pickupDate).toLocaleDateString()}</td>
            <td>${new Date(booking.returnDate).toLocaleDateString()}</td>
            <td><span class="status-badge ${booking.status}">${booking.status}</span></td>
            <td>${booking.totalDays} days</td>
            <td>$${booking.totalPrice}</td>
            <td>
                ${booking.status === 'pending' ? `
                    <button class="action-btn confirm" onclick="confirmBooking('${booking._id}')" title="Confirm">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="action-btn reject" onclick="rejectBooking('${booking._id}')" title="Reject">
                        <i class="fas fa-times"></i>
                    </button>
                ` : ''}
                <button class="action-btn view" onclick="viewBookingDetails('${booking._id}')" title="View">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn delete" onclick="deleteBooking('${booking._id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `;
    }).join('');
}

function loadRecentBookings() {
    if (!elements.recentBookingsTable) return;
    
    const recent = state.bookings.slice(0, 5);
    
    if (recent.length === 0) {
        elements.recentBookingsTable.innerHTML = '<tr><td colspan="5" class="no-data">No recent bookings</td></tr>';
        return;
    }
    
    elements.recentBookingsTable.innerHTML = recent.map(booking => {
        const customerName = booking.userId?.name || booking.fullName || 'N/A';
        const carName = booking.carId ? `${booking.carId.brand} ${booking.carId.model}` : 'N/A';
        
        return `
        <tr>
            <td>${customerName}</td>
            <td>${carName}</td>
            <td>${new Date(booking.pickupDate).toLocaleDateString()}</td>
            <td><span class="status-badge ${booking.status}">${booking.status}</span></td>
            <td>$${booking.totalPrice}</td>
        </tr>
    `;
    }).join('');
}

// ========================================
// MODAL FUNCTIONS
// ========================================
function openUserModal(userId = null) {
    const modal = elements.userModal;
    const title = document.getElementById('userModalTitle');
    
    if (userId) {
        const user = state.users.find(u => u._id === userId);
        if (user) {
            state.currentUser = user;
            title.textContent = 'Edit User';
            document.getElementById('userName').value = user.name;
            document.getElementById('userEmail').value = user.email;
            document.getElementById('userPassword').required = false;
        }
    } else {
        state.currentUser = null;
        title.textContent = 'Add New User';
        elements.userForm.reset();
        document.getElementById('userPassword').required = true;
    }
    
    modal.classList.add('active');
}

function openCarModal(carId = null) {
    const modal = elements.carModal;
    const title = document.getElementById('carModalTitle');
    
    if (carId) {
        const car = state.cars.find(c => c._id === carId || c.id === carId);
        if (car) {
            state.currentCar = car;
            title.textContent = 'Edit Car';
            document.getElementById('carBrand').value = car.brand;
            document.getElementById('carModel').value = car.model;
            document.getElementById('carYear').value = car.year;
            document.getElementById('carPrice').value = car.price;
            document.getElementById('carSeats').value = car.seats;
            document.getElementById('carHorsepower').value = car.horsepower;
            document.getElementById('carImage').value = car.image;
            document.getElementById('carStatus').value = car.status;
            document.getElementById('carFeatured').checked = car.featured || false;
            document.getElementById('carBadge').value = car.badge || 'Featured';
            document.getElementById('carCategory').value = car.category || 'sedan';
        }
    } else {
        state.currentCar = null;
        title.textContent = 'Add New Car';
        elements.carForm.reset();
        document.getElementById('carFeatured').checked = false;
        document.getElementById('carBadge').value = 'Featured';
        document.getElementById('carCategory').value = 'sedan';
    }
    
    modal.classList.add('active');
}

function openBookingModal(bookingId = null) {
    const modal = elements.bookingModal;
    const title = document.getElementById('bookingModalTitle');
    
    // Populate customer dropdown
    const customerSelect = document.getElementById('bookingCustomer');
    customerSelect.innerHTML = '<option value="">Select Customer</option>' +
        state.users.map(user => `<option value="${user._id}">${user.name}</option>`).join('');
    
    // Populate car dropdown (only available cars)
    const carSelect = document.getElementById('bookingCar');
    carSelect.innerHTML = '<option value="">Select Car</option>' +
        state.cars.filter(car => car.status === 'available').map(car => 
            `<option value="${car._id || car.id}">${car.brand} ${car.model} - $${car.price}/day</option>`
        ).join('');
    
    if (bookingId) {
        const booking = state.bookings.find(b => b._id === bookingId);
        if (booking) {
            state.currentBooking = booking;
            title.textContent = 'Edit Booking';
            // Populate form fields here if needed
        }
    } else {
        state.currentBooking = null;
        title.textContent = 'New Booking';
        elements.bookingForm.reset();
    }
    
    modal.classList.add('active');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    
    state.currentUser = null;
    state.currentCar = null;
    state.currentBooking = null;
}

// ========================================
// FORM SUBMISSIONS
// ========================================
async function handleUserSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        password: document.getElementById('userPassword').value
    };
    
    try {
        let response;
        if (state.currentUser) {
            // Update existing user
            response = await fetch(`/users/${state.currentUser._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        } else {
            // Create new user
            response = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        }
        
        if (response.ok) {
            showNotification('User saved successfully', 'success');
            closeAllModals();
            await loadUsers();
        } else {
            const error = await response.json();
            showNotification(error.error || 'Error saving user', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Network error', 'error');
    }
}

async function handleCarSubmit(e) {
    e.preventDefault();
    
    const formData = {
        brand: document.getElementById('carBrand').value,
        model: document.getElementById('carModel').value,
        year: parseInt(document.getElementById('carYear').value),
        price: parseFloat(document.getElementById('carPrice').value),
        seats: parseInt(document.getElementById('carSeats').value),
        horsepower: parseInt(document.getElementById('carHorsepower').value),
        image: document.getElementById('carImage').value,
        status: document.getElementById('carStatus').value,
        featured: document.getElementById('carFeatured').checked,
        badge: document.getElementById('carBadge').value,
        category: document.getElementById('carCategory').value
    };
    
    try {
        let response;
        
        if (state.currentCar && state.currentCar._id) {
            // Update existing car
            response = await fetch(`/api/cars/${state.currentCar._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        } else {
            // Create new car
            response = await fetch('/api/cars', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        }
        
        if (response.ok) {
            showNotification('Car saved successfully', 'success');
            closeAllModals();
            await loadCars();
        } else {
            const error = await response.json();
            showNotification(error.error || 'Error saving car', 'error');
        }
    } catch (error) {
        console.error('Error saving car:', error);
        showNotification('Network error', 'error');
    }
}

async function handleBookingSubmit(e) {
    e.preventDefault();
    
    const customerId = document.getElementById('bookingCustomer').value;
    const carId = document.getElementById('bookingCar').value;
    const startDate = document.getElementById('bookingStartDate').value;
    const endDate = document.getElementById('bookingEndDate').value;
    const status = document.getElementById('bookingStatus').value;
    
    const customer = state.users.find(u => u._id === customerId);
    const car = state.cars.find(c => (c._id || c.id) === carId);
    
    if (!customer || !car) {
        showNotification('Please select customer and car', 'error');
        return;
    }
    
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    const total = days * car.price;
    
    const formData = {
        userId: customerId,
        carId,
        fullName: customer.name,
        email: customer.email,
        phone: '000-000-0000',
        driverLicense: 'ADMIN-CREATED',
        pickupLocation: 'Admin Created',
        pickupAddress: 'Admin Created',
        pickupDate: startDate,
        pickupTime: '09:00',
        returnLocation: 'Admin Created',
        returnAddress: 'Admin Created',
        returnDate: endDate,
        returnTime: '18:00',
        totalDays: days,
        pricePerDay: car.price,
        totalPrice: total,
        status,
        specialRequests: 'Created by admin'
    };
    
    try {
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            showNotification('Booking created successfully', 'success');
            closeAllModals();
            await loadBookings();
        } else {
            const error = await response.json();
            showNotification(error.error || 'Error creating booking', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Network error', 'error');
    }
}

// ========================================
// USER CRUD OPERATIONS
// ========================================
window.editUser = function(userId) {
    console.log('Editing user:', userId);
    openUserModal(userId);
};

window.deleteUser = async function(userId) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
        const response = await fetch(`/users/${userId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification('User deleted successfully', 'success');
            await loadUsers();
        } else {
            showNotification('Error deleting user', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Network error', 'error');
    }
};

// ========================================
// CAR CRUD OPERATIONS
// ========================================
window.editCar = function(carId) {
    console.log('Editing car:', carId);
    const car = state.cars.find(c => c._id === carId || c.id === carId);
    if (car) {
        openCarModal(car._id || car.id);
    }
};

window.deleteCar = async function(carId) {
    if (!confirm('Are you sure you want to delete this car?')) return;
    
    try {
        const response = await fetch(`/api/cars/${carId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification('Car deleted successfully', 'success');
            await loadCars();
        } else {
            showNotification('Error deleting car', 'error');
        }
    } catch (error) {
        console.error('Error deleting car:', error);
        showNotification('Network error', 'error');
    }
};

// ========================================
// BOOKING MANAGEMENT FUNCTIONS
// ========================================
window.confirmBooking = async function(bookingId) {
    const adminNotes = prompt('Add confirmation notes (optional):');
    
    if (confirm('Confirm this booking?')) {
        try {
            const response = await fetch(`/api/bookings/${bookingId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'confirmed',
                    adminNotes: adminNotes || ''
                })
            });
            
            if (response.ok) {
                showNotification('Booking confirmed successfully', 'success');
                await loadBookings();
            } else {
                const error = await response.json();
                showNotification(error.error || 'Error confirming booking', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Network error', 'error');
        }
    }
};

window.rejectBooking = async function(bookingId) {
    const reason = prompt('Please provide a reason for rejection:');
    
    if (!reason) {
        alert('Rejection reason is required');
        return;
    }
    
    if (confirm('Reject this booking?')) {
        try {
            const response = await fetch(`/api/bookings/${bookingId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'rejected',
                    adminNotes: reason
                })
            });
            
            if (response.ok) {
                showNotification('Booking rejected', 'success');
                await loadBookings();
            } else {
                const error = await response.json();
                showNotification(error.error || 'Error rejecting booking', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Network error', 'error');
        }
    }
};

window.viewBookingDetails = function(bookingId) {
    const booking = state.bookings.find(b => b._id === bookingId);
    if (!booking) return;
    
    const customerName = booking.userId?.name || booking.fullName || 'N/A';
    const customerEmail = booking.userId?.email || booking.email || 'N/A';
    const carName = booking.carId ? `${booking.carId.brand} ${booking.carId.model}` : 'N/A';
    
    const detailsHTML = `
        <div style="padding: 2rem;">
            <div style="text-align: center; margin-bottom: 2rem;">
                <span class="status-badge ${booking.status}" style="font-size: 1.2rem; padding: 0.75rem 1.5rem;">
                    ${booking.status.toUpperCase()}
                </span>
            </div>
            
            <div style="display: grid; gap: 2rem;">
                <div style="padding: 1.5rem; background: var(--admin-bg-secondary); border-radius: 12px;">
                    <h3 style="margin-bottom: 1rem; color: var(--admin-primary);">
                        <i class="fas fa-user"></i> Customer Information
                    </h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                        <div><strong>Name:</strong><br>${customerName}</div>
                        <div><strong>Email:</strong><br>${customerEmail}</div>
                        <div><strong>Phone:</strong><br>${booking.phone}</div>
                        <div><strong>License:</strong><br>${booking.driverLicense}</div>
                    </div>
                </div>
                
                <div style="padding: 1.5rem; background: var(--admin-bg-secondary); border-radius: 12px;">
                    <h3 style="margin-bottom: 1rem; color: var(--admin-primary);">
                        <i class="fas fa-car"></i> Vehicle
                    </h3>
                    <p style="font-size: 1.1rem;"><strong>${carName}</strong></p>
                </div>
                
                <div style="padding: 1.5rem; background: var(--admin-bg-secondary); border-radius: 12px;">
                    <h3 style="margin-bottom: 1rem; color: var(--admin-primary);">
                        <i class="fas fa-map-marker-alt"></i> Pickup Details
                    </h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                        <div><strong>Location:</strong><br>${booking.pickupLocation}</div>
                        <div><strong>Address:</strong><br>${booking.pickupAddress}</div>
                        <div><strong>Date:</strong><br>${new Date(booking.pickupDate).toLocaleDateString()}</div>
                        <div><strong>Time:</strong><br>${booking.pickupTime}</div>
                    </div>
                </div>
                
                <div style="padding: 1.5rem; background: var(--admin-bg-secondary); border-radius: 12px;">
                    <h3 style="margin-bottom: 1rem; color: var(--admin-primary);">
                        <i class="fas fa-map-marker-alt"></i> Return Details
                    </h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                        <div><strong>Location:</strong><br>${booking.returnLocation}</div>
                        <div><strong>Address:</strong><br>${booking.returnAddress}</div>
                        <div><strong>Date:</strong><br>${new Date(booking.returnDate).toLocaleDateString()}</div>
                        <div><strong>Time:</strong><br>${booking.returnTime}</div>
                    </div>
                </div>
                
                <div style="padding: 1.5rem; background: var(--admin-bg-secondary); border-radius: 12px;">
                    <h3 style="margin-bottom: 1rem; color: var(--admin-primary);">
                        <i class="fas fa-dollar-sign"></i> Pricing
                    </h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                        <div><strong>Total Days:</strong><br>${booking.totalDays}</div>
                        <div><strong>Price/Day:</strong><br>$${booking.pricePerDay}</div>
                        <div style="grid-column: 1 / -1; text-align: center; margin-top: 1rem; padding-top: 1rem; border-top: 2px solid var(--admin-border);">
                            <strong style="font-size: 1.2rem;">Total Amount:</strong><br>
                            <span style="font-size: 2.5rem; color: var(--admin-primary); font-weight: bold;">$${booking.totalPrice}</span>
                        </div>
                    </div>
                </div>
                
                ${booking.specialRequests ? `
                    <div style="padding: 1.5rem; background: var(--admin-bg-secondary); border-radius: 12px;">
                        <h3 style="margin-bottom: 1rem; color: var(--admin-primary);">
                            <i class="fas fa-comment"></i> Special Requests
                        </h3>
                        <p>${booking.specialRequests}</p>
                    </div>
                ` : ''}
                
                ${booking.adminNotes ? `
                    <div style="padding: 1.5rem; background: #fff3cd; border-radius: 12px;">
                        <h3 style="margin-bottom: 1rem; color: #856404;">
                            <i class="fas fa-sticky-note"></i> Admin Notes
                        </h3>
                        <p style="color: #856404;">${booking.adminNotes}</p>
                    </div>
                ` : ''}
                
                <div style="text-align: center; padding: 1rem; background: var(--admin-bg-secondary); border-radius: 12px;">
                    <small style="color: var(--admin-text-muted);">
                        Booking ID: ${booking._id}<br>
                        Created: ${new Date(booking.createdAt).toLocaleString()}
                    </small>
                </div>
                
                ${booking.status === 'pending' ? `
                    <div style="display: flex; gap: 1rem; justify-content: center;">
                        <button class="btn-primary" onclick="confirmBooking('${booking._id}'); closeBookingDetailsModal();" style="padding: 1rem 2rem; font-size: 1rem;">
                            <i class="fas fa-check"></i> Confirm Booking
                        </button>
                        <button class="btn-danger" onclick="rejectBooking('${booking._id}'); closeBookingDetailsModal();" style="padding: 1rem 2rem; font-size: 1rem;">
                            <i class="fas fa-times"></i> Reject Booking
                        </button>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'bookingDetailsModal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header">
                <h2><i class="fas fa-file-alt"></i> Booking Details</h2>
                <button class="modal-close" onclick="closeBookingDetailsModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                ${detailsHTML}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeBookingDetailsModal();
        }
    });
};

window.closeBookingDetailsModal = function() {
    const modal = document.getElementById('bookingDetailsModal');
    if (modal) {
        modal.remove();
    }
};

window.deleteBooking = async function(bookingId) {
    if (!confirm('Are you sure you want to delete this booking? This action cannot be undone.')) return;
    
    try {
        const response = await fetch(`/api/bookings/${bookingId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification('Booking deleted successfully', 'success');
            await loadBookings();
        } else {
            showNotification('Error deleting booking', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Network error', 'error');
    }
};

// ========================================
// NOTIFICATIONS
// ========================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6'
    };
    
    notification.innerHTML = `
        <i class="fas ${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${colors[type] || colors.info};
        color: white;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        animation: slideIn 0.3s ease;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========================================
// INITIALIZATION COMPLETE
// ========================================
console.log('✅✅✅ Admin Dashboard Script Loaded Successfully!');
console.log('📊 Features Active:');
console.log('   - User Management');
console.log('   - Car Management');
console.log('   - Booking Management (Confirm/Reject/View/Delete)');
console.log('   - Dashboard Stats');
console.log('   - Theme Toggle');
console.log('   - Responsive Sidebar');