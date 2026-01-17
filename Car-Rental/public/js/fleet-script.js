/**
 * FLEET PAGE - MAIN SCRIPT (UPDATED)
 * Dynamic car loading with filters, search, categories, and mobile menu
 */

// ========================================
// MOBILE MENU MODULE
// ========================================

function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const mobileSigninBtn = document.getElementById('mobileSigninBtn');
    
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
    
    if (mobileSigninBtn) {
        mobileSigninBtn.addEventListener('click', () => {
            window.location.href = '/signin';
        });
    }
    
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

// ========================================
// HEADER SCROLL EFFECT
// ========================================

function initHeaderScrollEffect() {
    const header = document.querySelector('.modern-header');
    if (!header) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ========================================
// STATE MANAGEMENT
// ========================================
let allCars = [];
let filteredCars = [];
let currentCategory = 'all';
let currentView = 'grid';
let minPriceValue = 0;
let maxPriceValue = 1000;

// ========================================
// DOM ELEMENTS
// ========================================
const elements = {
    fleetGrid: document.getElementById('fleetGrid'),
    loadingState: document.getElementById('loadingState'),
    noResults: document.getElementById('noResults'),
    resultsCount: document.getElementById('resultsCount'),
    fleetSearch: document.getElementById('fleetSearch'),
    sortSelect: document.getElementById('sortSelect'),
    minPrice: document.getElementById('minPrice'),
    maxPrice: document.getElementById('maxPrice'),
    priceValue: document.getElementById('priceValue'),
    maxPriceValue: document.getElementById('maxPriceValue'),
    categoryBtns: document.querySelectorAll('.category-btn'),
    viewBtns: document.querySelectorAll('.view-btn'),
    themeToggle: document.getElementById('themeToggle'),
    signinBtn: document.getElementById('signinBtn')
};

// ========================================
// CATEGORY MAPPING
// ========================================
const categoryMapping = {
    'Ford Mustang': 'sports',
    'Mustang': 'sports',
    'Lexus LC': 'luxury',
    'Lexus': 'luxury',
    'Audi A3': 'sedan',
    'Audi': 'sedan',
    'BMW': 'luxury',
    'Mercedes': 'luxury',
    'Tesla': 'electric',
    'Porsche': 'sports',
    'Range Rover': 'suv',
    'Land Rover': 'suv',
    'Lamborghini': 'sports',
    'Ferrari': 'sports',
    'Bentley': 'luxury',
    'Rolls Royce': 'luxury'
};

// ========================================
// LOAD CARS FROM DATABASE
// ========================================
async function loadCars() {
    try {
        showLoading(true);
        
        const response = await fetch('/api/cars?status=available');
        
        if (response.ok) {
            allCars = await response.json();
            
            allCars = allCars.map(car => {
                if (!car.category) {
                    car.category = detectCarCategory(car);
                }
                return car;
            });
            
            filteredCars = [...allCars];
            updateCategoryCounts();
            renderCars();
            showLoading(false);
            
            console.log(`✅ Loaded ${allCars.length} cars from database`);
        } else {
            console.error('Failed to load cars');
            showLoading(false);
            showNoResults();
        }
    } catch (error) {
        console.error('Error loading cars:', error);
        showLoading(false);
        showNoResults();
    }
}

// ========================================
// DETECT CAR CATEGORY
// ========================================
function detectCarCategory(car) {
    const searchText = `${car.brand} ${car.model}`.toLowerCase();
    
    for (const [keyword, category] of Object.entries(categoryMapping)) {
        if (searchText.includes(keyword.toLowerCase())) {
            return category;
        }
    }
    
    if (car.price > 300) return 'luxury';
    if (car.horsepower > 400) return 'sports';
    if (car.seats > 5) return 'suv';
    
    return 'sedan';
}

// ========================================
// RENDER CARS
// ========================================
function renderCars() {
    if (filteredCars.length === 0) {
        showNoResults();
        return;
    }
    
    hideNoResults();
    
    elements.fleetGrid.innerHTML = filteredCars.map(car => `
        <div class="fleet-car-card" onclick="openCarModal('${car._id || car.id}')">
            <div class="car-image-wrapper">
                <img src="${car.image}" alt="${car.brand} ${car.model}">
                ${car.featured ? `<div class="car-badge">${car.badge || 'Featured'}</div>` : ''}
            </div>
            <div class="car-card-content">
                <div class="car-card-header">
                    <h3 class="car-brand-model">${car.brand} ${car.model}</h3>
                    <div class="car-price">
                        <span class="price-amount">AED ${car.price}</span>
                        <span class="price-period">Dhs/day</span>
                    </div>
                </div>
                <div class="car-specs-grid">
                    <div class="spec-item">
                        <i class="fas fa-home spec-icon"></i>
                        <span class="spec-value">${car.horsepower} HP</span>
                    </div>
                    <div class="spec-item">
                        <i class="fas fa-briefcase spec-icon"></i>
                        <span class="spec-value">${car.seats} Seats</span>
                    </div>
                    <div class="spec-item">
                        <i class="fas fa-clock spec-icon"></i>
                        <span class="spec-value">Auto</span>
                    </div>
                </div>
                <div class="car-card-footer">
                    <button class="btn-book" onclick="bookCar(event, '${car._id || car.id}')">
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    updateResultsCount();
}

// ========================================
// FILTER FUNCTIONS
// ========================================
function applyFilters() {
    filteredCars = allCars.filter(car => {
        if (currentCategory !== 'all' && car.category !== currentCategory) {
            return false;
        }
        
        if (car.price < minPriceValue || car.price > maxPriceValue) {
            return false;
        }
        
        const searchTerm = elements.fleetSearch.value.toLowerCase();
        if (searchTerm) {
            const searchText = `${car.brand} ${car.model}`.toLowerCase();
            if (!searchText.includes(searchTerm)) {
                return false;
            }
        }
        
        return true;
    });
    
    applySorting();
    renderCars();
}

function applySorting() {
    const sortValue = elements.sortSelect.value;
    
    filteredCars.sort((a, b) => {
        switch(sortValue) {
            case 'name-asc':
                return `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`);
            case 'name-desc':
                return `${b.brand} ${b.model}`.localeCompare(`${a.brand} ${a.model}`);
            case 'price-asc':
                return a.price - b.price;
            case 'price-desc':
                return b.price - a.price;
            case 'horsepower-desc':
                return b.horsepower - a.horsepower;
            default:
                return 0;
        }
    });
}

// ========================================
// CATEGORY COUNTS
// ========================================
function updateCategoryCounts() {
    const counts = {
        all: allCars.length,
        luxury: 0,
        sports: 0,
        suv: 0,
        sedan: 0,
        electric: 0
    };
    
    allCars.forEach(car => {
        if (counts.hasOwnProperty(car.category)) {
            counts[car.category]++;
        }
    });
    
    document.getElementById('countAll').textContent = counts.all;
    document.getElementById('countLuxury').textContent = counts.luxury;
    document.getElementById('countSports').textContent = counts.sports;
    document.getElementById('countSUV').textContent = counts.suv;
    document.getElementById('countSedan').textContent = counts.sedan;
    document.getElementById('countElectric').textContent = counts.electric;
}

function updateResultsCount() {
    elements.resultsCount.textContent = filteredCars.length;
}

// ========================================
// UI HELPER FUNCTIONS
// ========================================
function showLoading(show) {
    elements.loadingState.style.display = show ? 'block' : 'none';
    elements.fleetGrid.style.display = show ? 'none' : 'grid';
}

function showNoResults() {
    elements.noResults.style.display = 'block';
    elements.fleetGrid.style.display = 'none';
    updateResultsCount();
}

function hideNoResults() {
    elements.noResults.style.display = 'none';
    elements.fleetGrid.style.display = 'grid';
}

// ========================================
// RESET FILTERS
// ========================================
function resetFilters() {
    currentCategory = 'all';
    minPriceValue = 0;
    maxPriceValue = 1000;
    
    elements.fleetSearch.value = '';
    elements.sortSelect.value = 'name-asc';
    elements.minPrice.value = 0;
    elements.maxPrice.value = 1000;
    elements.priceValue.textContent = 0;
    elements.maxPriceValue.textContent = 1000;
    
    elements.categoryBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === 'all');
    });
    
    applyFilters();
}

window.resetFilters = resetFilters;

// ========================================
// CAR MODAL
// ========================================
function openCarModal(carId) {
    const car = allCars.find(c => (c._id || c.id) === carId);
    if (!car) return;
    
    const modal = document.getElementById('carModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div style="padding: 2rem;">
            <img src="${car.image}" alt="${car.brand} ${car.model}" style="width: 100%; border-radius: 1rem; margin-bottom: 2rem;">
            <h2 style="font-size: 2.5rem; margin-bottom: 0.5rem; color: var(--text-primary);">${car.brand} ${car.model}</h2>
            <p style="color: var(--text-muted); margin-bottom: 2rem;">Year: ${car.year}</p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
                <div style="text-align: center; padding: 1rem; background: var(--bg-primary); border-radius: 0.75rem;">
                    <i class="fas fa-tachometer-alt" style="font-size: 2rem; color: var(--accent-primary); margin-bottom: 0.5rem;"></i>
                    <p style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 0.25rem;">Horsepower</p>
                    <p style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary);">${car.horsepower} HP</p>
                </div>
                <div style="text-align: center; padding: 1rem; background: var(--bg-primary); border-radius: 0.75rem;">
                    <i class="fas fa-users" style="font-size: 2rem; color: var(--accent-primary); margin-bottom: 0.5rem;"></i>
                    <p style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 0.25rem;">Seats</p>
                    <p style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary);">${car.seats}</p>
                </div>
                <div style="text-align: center; padding: 1rem; background: var(--bg-primary); border-radius: 0.75rem;">
                    <i class="fas fa-cog" style="font-size: 2rem; color: var(--accent-primary); margin-bottom: 0.5rem;"></i>
                    <p style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 0.25rem;">Transmission</p>
                    <p style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary);">Auto</p>
                </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 2rem; background: var(--bg-primary); border-radius: 1rem;">
                <div>
                    <p style="font-size: 1rem; color: var(--text-muted); margin-bottom: 0.5rem;">Price per day</p>
                    <p style="font-size: 3rem; font-weight: 700; color: var(--accent-primary);">${car.price}Dhs</p>
                </div>
                <button class="btn-book" style="padding: 1.25rem 2.5rem; font-size: 1.1rem;" onclick="bookCar(event, '${car._id || car.id}')">
                    Book Now
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

function closeCarModal() {
    const modal = document.getElementById('carModal');
    modal.classList.remove('active');
}

window.openCarModal = openCarModal;
window.closeCarModal = closeCarModal;

// ========================================
// BOOKING FUNCTION
// ========================================
function bookCar(event, carId) {
    if (event) event.stopPropagation();
    
    console.log('🚗 Fleet bookCar called with ID:', carId);
    
    const user = localStorage.getItem('user');
    
    if (!user) {
        alert('Please sign in to book a car');
        window.location.href = '/signin';
        return;
    }
    
    localStorage.setItem('selectedCar', carId);
    console.log('✅ Redirecting to booking page...');
    window.location.href = '/booking.html';
}

window.bookCar = bookCar;

// ========================================
// THEME TOGGLE
// ========================================
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

// ========================================
// USER AUTHENTICATION
// ========================================
function checkUserAuthentication() {
    const user = JSON.parse(localStorage.getItem('user'));
    const signinBtn = document.getElementById('signinBtn');
    const mobileSigninBtn = document.getElementById('mobileSigninBtn');
    
    if (user && signinBtn) {
        const welcomeMessage = localStorage.getItem('hasLoggedInBefore') === 'true' ? 'Welcome back' : 'Welcome';
        
        signinBtn.outerHTML = `
            <div class="user-menu-container">
                <button class="btn-user-menu" id="userMenuBtn">
                    <svg class="user-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <div class="user-info">
                        <span class="user-welcome">${welcomeMessage}</span>
                        <span class="user-name">${user.name}</span>
                    </div>
                    <svg class="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
                <div class="user-dropdown" id="userDropdown">
                    <div class="dropdown-header">
                        <div class="user-avatar">
                            ${user.name.charAt(0).toUpperCase()}
                        </div>
                        <div class="user-details">
                            <p class="dropdown-user-name">${user.name}</p>
                            <p class="dropdown-user-email">${user.email}</p>
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
    
    if (user && mobileSigninBtn) {
        const mobileNavContent = mobileSigninBtn.parentElement;
        mobileSigninBtn.remove();
        
        const userMobileSection = document.createElement('div');
        userMobileSection.className = 'mobile-user-section';
        userMobileSection.innerHTML = `
            <div class="mobile-user-info">
                <div class="mobile-user-avatar">${user.name.charAt(0).toUpperCase()}</div>
                <div>
                    <p class="mobile-user-name">${user.name}</p>
                    <p class="mobile-user-email">${user.email}</p>
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
        `;
        mobileNavContent.appendChild(userMobileSection);
        
        const mobileSignoutBtn = document.getElementById('mobileSignoutBtn');
        if (mobileSignoutBtn) {
            mobileSignoutBtn.addEventListener('click', handleSignOut);
        }
    }
    
    updateNavigationLinks();
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
    localStorage.removeItem('user');
    window.location.reload();
}

function updateNavigationLinks() {
    const user = localStorage.getItem('user');
    const myBookingsLink = document.getElementById('myBookingsLink');
    const mobileBookingsLink = document.getElementById('mobileBookingsLink');
    
    if (user) {
        if (myBookingsLink) myBookingsLink.style.display = 'inline-block';
        if (mobileBookingsLink) mobileBookingsLink.style.display = 'flex';
    } else {
        if (myBookingsLink) myBookingsLink.style.display = 'none';
        if (mobileBookingsLink) mobileBookingsLink.style.display = 'none';
    }
}

// ========================================
// EVENT LISTENERS
// ========================================
function setupEventListeners() {
    elements.categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentCategory = btn.dataset.category;
            
            elements.categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            applyFilters();
        });
    });
    
    elements.fleetSearch?.addEventListener('input', applyFilters);
    elements.sortSelect?.addEventListener('change', applyFilters);
    
    elements.minPrice?.addEventListener('input', (e) => {
        minPriceValue = parseInt(e.target.value);
        elements.priceValue.textContent = minPriceValue;
        
        if (minPriceValue > maxPriceValue) {
            elements.maxPrice.value = minPriceValue;
            maxPriceValue = minPriceValue;
            elements.maxPriceValue.textContent = maxPriceValue;
        }
        
        applyFilters();
    });
    
    elements.maxPrice?.addEventListener('input', (e) => {
        maxPriceValue = parseInt(e.target.value);
        elements.maxPriceValue.textContent = maxPriceValue;
        
        if (maxPriceValue < minPriceValue) {
            elements.minPrice.value = maxPriceValue;
            minPriceValue = maxPriceValue;
            elements.priceValue.textContent = minPriceValue;
        }
        
        applyFilters();
    });
    
    elements.viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentView = btn.dataset.view;
            
            elements.viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            elements.fleetGrid.classList.toggle('list-view', currentView === 'list');
        });
    });
    
    elements.signinBtn?.addEventListener('click', () => {
        window.location.href = '/signin';
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCarModal();
        }
    });
}

// ========================================
// INITIALIZATION
// ========================================
async function init() {
    initMobileMenu();
    initHeaderScrollEffect();
    initializeTheme();
    checkUserAuthentication();
    setupEventListeners();
    await loadCars();
    
    console.log('🚗 Fleet page initialized with modern header');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

console.log('✅ Fleet-script.js updates applied!');