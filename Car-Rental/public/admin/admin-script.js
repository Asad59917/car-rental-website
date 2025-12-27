// ========================================
// ADMIN DASHBOARD - MAIN JAVASCRIPT
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
    
    // Modals
    userModal: document.getElementById('userModal'),
    carModal: document.getElementById('carModal'),
    bookingModal: document.getElementById('bookingModal'),
    
    // Forms
    userForm: document.getElementById('userForm'),
    carForm: document.getElementById('carForm'),
    bookingForm: document.getElementById('bookingForm'),
    
    // Tables
    usersTable: document.getElementById('usersTable'),
    carsGrid: document.getElementById('carsGrid'),
    bookingsTable: document.getElementById('bookingsTable'),
    recentBookingsTable: document.getElementById('recentBookingsTable'),
    
    // Stats
    totalUsers: document.getElementById('totalUsers'),
    totalCars: document.getElementById('totalCars'),
    totalBookings: document.getElementById('totalBookings')
};

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadDashboardData();
    checkAuthStatus();
    initializeTheme();
});

function initializeEventListeners() {
    // Sidebar toggle
    elements.sidebarToggle?.addEventListener('click', toggleSidebar);
    elements.mobileMenuToggle?.addEventListener('click', toggleMobileSidebar);
    
    // Navigation
    elements.navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            navigateToSection(section);
        });
    });
    
    // Theme toggle
    elements.themeToggle?.addEventListener('click', toggleTheme);
    
    // Logout
    elements.logoutBtn?.addEventListener('click', handleLogout);
    
    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // Close modal on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAllModals();
            }
        });
    });
    
    // Add buttons
    document.getElementById('addUserBtn')?.addEventListener('click', () => openUserModal());
    document.getElementById('addCarBtn')?.addEventListener('click', () => openCarModal());
    document.getElementById('addBookingBtn')?.addEventListener('click', () => openBookingModal());
    
    // Forms
    elements.userForm?.addEventListener('submit', handleUserSubmit);
    elements.carForm?.addEventListener('submit', handleCarSubmit);
    elements.bookingForm?.addEventListener('submit', handleBookingSubmit);
    
    // Search and filters
    document.getElementById('userSearch')?.addEventListener('input', filterUsers);
    document.getElementById('carSearch')?.addEventListener('input', filterCars);
    document.getElementById('bookingSearch')?.addEventListener('input', filterBookings);
    
    document.getElementById('userFilter')?.addEventListener('change', filterUsers);
    document.getElementById('carFilter')?.addEventListener('change', filterCars);
    document.getElementById('bookingFilter')?.addEventListener('change', filterBookings);
    
    // Quick actions
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
        btn.addEventListener('click', handleQuickAction);
    });
}

// ========================================
// AUTHENTICATION
// ========================================
function checkAuthStatus() {
    // Check if admin is logged in
    const adminUser = localStorage.getItem('adminUser');
    
    if (!adminUser) {
        // Redirect to login page or show login modal
        // For demo purposes, we'll allow access
        console.log('Admin authentication check...');
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
    
    // Load section data
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
            loadAnalytics();
            break;
    }
}

// ========================================
// SIDEBAR
// ========================================
function toggleSidebar() {
    elements.sidebar?.classList.toggle('collapsed');
}

function toggleMobileSidebar() {
    elements.sidebar?.classList.toggle('mobile-open');
}

// ========================================
// THEME
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
    await Promise.all([
        loadUsers(),
        loadCars(),
        loadBookings()
    ]);
    
    updateDashboardStats();
    loadRecentBookings();
}

async function loadUsers() {
    try {
        const response = await fetch('/users');
        if (response.ok) {
            state.users = await response.json();
            renderUsersTable();
            updateDashboardStats();
        }
    } catch (error) {
        console.error('Error loading users:', error);
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
        } else {
            console.error('Failed to load cars from database');
            // If API fails, try to initialize with sample data
            await initializeSampleCars();
        }
    } catch (error) {
        console.error('Error loading cars:', error);
        // If API fails, try to initialize with sample data
        await initializeSampleCars();
    }
}

// Initialize database with sample cars if empty
async function initializeSampleCars() {
    try {
        const sampleCars = getSampleCars();
        
        // Try to add each sample car to database
        for (const car of sampleCars) {
            await fetch('/api/cars', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(car)
            });
        }
        
        // Reload cars from database
        await loadCars();
        showNotification('Sample cars initialized', 'success');
    } catch (error) {
        console.error('Error initializing sample cars:', error);
        state.cars = getSampleCars();
        renderCarsGrid();
        updateDashboardStats();
    }
}

async function loadBookings() {
    // Since we don't have a bookings endpoint yet, use sample data
    state.bookings = getSampleBookings();
    renderBookingsTable();
    updateDashboardStats();
}

function loadAnalytics() {
    // Load analytics charts
    console.log('Loading analytics...');
}

// ========================================
// SAMPLE DATA
// ========================================
function getSampleCars() {
    return [
        {
            id: 1,
            brand: 'Ford',
            model: 'Mustang',
            year: 2024,
            price: 250,
            seats: 4,
            horsepower: 450,
            image: 'https://www.figma.com/api/mcp/asset/85162a70-b54f-4585-80bd-98137a2a120e',
            status: 'available',
            featured: true,
            badge: 'Popular'
        },
        {
            id: 2,
            brand: 'Lexus',
            model: 'LC Series',
            year: 2024,
            price: 350,
            seats: 4,
            horsepower: 335,
            image: 'https://www.figma.com/api/mcp/asset/9ad5e5ca-f5dd-43f6-a06b-ba61121fc9d8',
            status: 'available',
            featured: true,
            badge: 'Luxury'
        },
        {
            id: 3,
            brand: 'Audi',
            model: 'A3',
            year: 2024,
            price: 180,
            seats: 5,
            horsepower: 240,
            image: 'https://www.figma.com/api/mcp/asset/70450f8f-74b2-4d23-85d4-4fc248d6e557',
            status: 'rented',
            featured: true,
            badge: 'New'
        }
    ];
}

function getSampleBookings() {
    return [
        {
            id: 1,
            customerId: 1,
            customerName: 'John Doe',
            carId: 1,
            carName: 'Ford Mustang',
            startDate: '2024-12-28',
            endDate: '2024-12-30',
            status: 'confirmed',
            total: 500
        },
        {
            id: 2,
            customerId: 2,
            customerName: 'Jane Smith',
            carId: 3,
            carName: 'Audi A3',
            startDate: '2024-12-29',
            endDate: '2024-12-31',
            status: 'pending',
            total: 360
        }
    ];
}

// ========================================
// RENDERING
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
                    ${car.featured ? `<span class="status-badge confirmed"><i class="fas fa-star"></i> Featured (${car.badge || 'Featured'})</span>` : ''}
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

function renderBookingsTable() {
    if (!elements.bookingsTable) return;
    
    if (state.bookings.length === 0) {
        elements.bookingsTable.innerHTML = '<tr><td colspan="8" class="no-data">No bookings found</td></tr>';
        return;
    }
    
    elements.bookingsTable.innerHTML = state.bookings.map(booking => `
        <tr>
            <td>#${booking.id}</td>
            <td>${booking.customerName}</td>
            <td>${booking.carName}</td>
            <td>${new Date(booking.startDate).toLocaleDateString()}</td>
            <td>${new Date(booking.endDate).toLocaleDateString()}</td>
            <td><span class="status-badge ${booking.status}">${booking.status}</span></td>
            <td>$${booking.total}</td>
            <td>
                <button class="action-btn edit" onclick="editBooking(${booking.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteBooking(${booking.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function loadRecentBookings() {
    if (!elements.recentBookingsTable) return;
    
    const recent = state.bookings.slice(0, 5);
    
    if (recent.length === 0) {
        elements.recentBookingsTable.innerHTML = '<tr><td colspan="5" class="no-data">No bookings yet</td></tr>';
        return;
    }
    
    elements.recentBookingsTable.innerHTML = recent.map(booking => `
        <tr>
            <td>${booking.customerName}</td>
            <td>${booking.carName}</td>
            <td>${new Date(booking.startDate).toLocaleDateString()}</td>
            <td><span class="status-badge ${booking.status}">${booking.status}</span></td>
            <td>$${booking.total}</td>
        </tr>
    `).join('');
}

// ========================================
// MODAL FUNCTIONS
// ========================================
function openUserModal(userId = null) {
    const modal = elements.userModal;
    const title = document.getElementById('userModalTitle');
    
    if (userId) {
        // Edit mode
        const user = state.users.find(u => u._id === userId);
        if (user) {
            state.currentUser = user;
            title.textContent = 'Edit User';
            document.getElementById('userName').value = user.name;
            document.getElementById('userEmail').value = user.email;
            document.getElementById('userPassword').required = false;
        }
    } else {
        // Add mode
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
        // Edit mode - find by _id or id
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
        }
    } else {
        // Add mode
        state.currentCar = null;
        title.textContent = 'Add New Car';
        elements.carForm.reset();
        document.getElementById('carFeatured').checked = false;
        document.getElementById('carBadge').value = 'Featured';
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
    
    // Populate car dropdown
    const carSelect = document.getElementById('bookingCar');
    carSelect.innerHTML = '<option value="">Select Car</option>' +
        state.cars.filter(car => car.status === 'available').map(car => 
            `<option value="${car.id}">${car.brand} ${car.model} - $${car.price}/day</option>`
        ).join('');
    
    if (bookingId) {
        // Edit mode
        const booking = state.bookings.find(b => b.id === bookingId);
        if (booking) {
            state.currentBooking = booking;
            title.textContent = 'Edit Booking';
            // Populate form fields
        }
    } else {
        // Add mode
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
        badge: document.getElementById('carBadge').value
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
    const carId = parseInt(document.getElementById('bookingCar').value);
    const startDate = document.getElementById('bookingStartDate').value;
    const endDate = document.getElementById('bookingEndDate').value;
    const status = document.getElementById('bookingStatus').value;
    
    const customer = state.users.find(u => u._id === customerId);
    const car = state.cars.find(c => c.id === carId);
    
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    const total = days * car.price;
    
    const formData = {
        customerId,
        customerName: customer.name,
        carId,
        carName: `${car.brand} ${car.model}`,
        startDate,
        endDate,
        status,
        total
    };
    
    if (state.currentBooking) {
        // Update
        const index = state.bookings.findIndex(b => b.id === state.currentBooking.id);
        state.bookings[index] = { ...state.currentBooking, ...formData };
    } else {
        // Create
        const newBooking = {
            id: state.bookings.length + 1,
            ...formData
        };
        state.bookings.push(newBooking);
    }
    
    showNotification('Booking saved successfully', 'success');
    closeAllModals();
    renderBookingsTable();
    loadRecentBookings();
    updateDashboardStats();
}

// ========================================
// CRUD OPERATIONS
// ========================================
window.editUser = function(userId) {
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

window.editCar = function(carId) {
    // Find car by _id (MongoDB) or id (sample data)
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

window.editBooking = function(bookingId) {
    openBookingModal(bookingId);
};

window.deleteBooking = function(bookingId) {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    
    state.bookings = state.bookings.filter(b => b.id !== bookingId);
    showNotification('Booking deleted successfully', 'success');
    renderBookingsTable();
    loadRecentBookings();
    updateDashboardStats();
};

// ========================================
// FILTERING
// ========================================
function filterUsers() {
    const searchTerm = document.getElementById('userSearch')?.value.toLowerCase() || '';
    const filterValue = document.getElementById('userFilter')?.value || 'all';
    
    // Filter logic here
    renderUsersTable();
}

function filterCars() {
    const searchTerm = document.getElementById('carSearch')?.value.toLowerCase() || '';
    const filterValue = document.getElementById('carFilter')?.value || 'all';
    
    // Filter logic here
    renderCarsGrid();
}

function filterBookings() {
    const searchTerm = document.getElementById('bookingSearch')?.value.toLowerCase() || '';
    const filterValue = document.getElementById('bookingFilter')?.value || 'all';
    
    // Filter logic here
    renderBookingsTable();
}

// ========================================
// QUICK ACTIONS
// ========================================
function handleQuickAction(e) {
    const action = e.currentTarget.dataset.action;
    
    switch(action) {
        case 'add-user':
            openUserModal();
            break;
        case 'add-car':
            openCarModal();
            break;
        case 'view-bookings':
            navigateToSection('bookings');
            break;
        case 'generate-report':
            generateReport();
            break;
    }
}

function generateReport() {
    showNotification('Report generation feature coming soon!', 'info');
}

// ========================================
// NOTIFICATIONS
// ========================================
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'var(--admin-success)' : 
                     type === 'error' ? 'var(--admin-danger)' : 
                     'var(--admin-info)'};
        color: white;
        border-radius: 0.5rem;
        box-shadow: var(--admin-shadow-lg);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

console.log('Admin dashboard initialized successfully!');