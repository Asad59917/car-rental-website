/**
 * CAR RENTAL - MAIN SCRIPT
 * Combined module for carousel, testimonials, scroll animations, theme, and user authentication
 * Featured Cars Section - Dynamic from Admin Panel
 */

// ========================================
// USER AUTHENTICATION MODULE
// ========================================

// Check if user is logged in
function checkUserAuthentication() {
    const user = JSON.parse(localStorage.getItem('user'));
    const signinBtn = document.getElementById('signinBtn');
    
    if (user && signinBtn) {
        // User is logged in - replace sign in button with user menu
        createUserMenu(user);
    }
}

// Create user menu dropdown
function createUserMenu(user) {
    const signinBtn = document.getElementById('signinBtn');
    
    // Determine if this is a returning user
    const isReturningUser = localStorage.getItem('hasLoggedInBefore') === 'true';
    const welcomeMessage = isReturningUser ? 'Welcome back' : 'Welcome';
    
    // Mark that user has logged in before
    localStorage.setItem('hasLoggedInBefore', 'true');
    
    // Create user menu HTML
    const userMenuHTML = `
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
    
    // Replace signin button with user menu
    signinBtn.outerHTML = userMenuHTML;
    
    // Add event listeners
    setupUserMenuListeners();
}

// Setup user menu event listeners
function setupUserMenuListeners() {
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');
    const signoutBtn = document.getElementById('signoutBtn');
    
    if (userMenuBtn && userDropdown) {
        // Toggle dropdown
        userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
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

// Handle sign out
function handleSignOut() {
    // Remove user data from localStorage
    localStorage.removeItem('user');
    // Note: We keep 'hasLoggedInBefore' so they get "Welcome back" next time
    
    // Reload page to reset to sign in button
    window.location.reload();
}

// ========================================
// CAR DATA - HERO SECTION (HARDCODED)
// ========================================
const carsArray = [
    {
        id: 'mustang',
        brand: 'FORD',
        model: 'MUSTANG',
        name: 'Ford Mustang',
        image: 'https://www.figma.com/api/mcp/asset/85162a70-b54f-4585-80bd-98137a2a120e',
        styling: {
            width: '100%',
            scale: '1',
            marginLeft: '0',
            marginRight: '0',
            marginTop: '-230px',
            marginBottom: '0',
            padding: '0'
        },
        textStyling: {
            brandFontSize: '64px',
            brandFontSizeActive: '48px',
            brandColor: '',
            brandFontWeight: '600',
            brandLetterSpacing: 'normal',
            brandMarginTop: '80px',
            brandMarginBottom: '0',
            modelFontSize: '200px',
            modelFontSizeActive: '180px',
            modelColor: '',
            modelFontWeight: '600',
            modelLetterSpacing: 'normal',
            modelMarginTop: '0',
            modelMarginBottom: '0'
        },
        specs: {
            gas: '700 KM',
            seats: '4',
            horsepower: '450'
        },
        gallery: [
            'https://www.figma.com/api/mcp/asset/85162a70-b54f-4585-80bd-98137a2a120e',
            'https://www.figma.com/api/mcp/asset/85162a70-b54f-4585-80bd-98137a2a120e',
            'https://www.figma.com/api/mcp/asset/85162a70-b54f-4585-80bd-98137a2a120e',
            'https://www.figma.com/api/mcp/asset/85162a70-b54f-4585-80bd-98137a2a120e'
        ]
    },
    {
        id: 'audi-a3',
        brand: 'AUDI',
        model: 'A3',
        name: 'Audi A3',
        image: 'https://www.figma.com/api/mcp/asset/70450f8f-74b2-4d23-85d4-4fc248d6e557',
        styling: {
            width: '110%',
            scale: '1',
            marginLeft: '-90px',
            marginRight: '200px',
            marginTop: '-110px',
            marginBottom: '0',
            padding: '0'
        },
        textStyling: {
            brandFontSize: '64px',
            brandFontSizeActive: '48px',
            brandColor: '',
            brandFontWeight: '600',
            brandLetterSpacing: 'normal',
            brandMarginTop: '40px',
            brandMarginBottom: '0',
            modelFontSize: '200px',
            modelFontSizeActive: '180px',
            modelColor: '',
            modelFontWeight: '600',
            modelLetterSpacing: 'normal',
            modelMarginTop: '0',
            modelMarginBottom: '0'
        },
        specs: {
            gas: '650 KM',
            seats: '5',
            horsepower: '240'
        },
        gallery: [
            'https://www.figma.com/api/mcp/asset/70450f8f-74b2-4d23-85d4-4fc248d6e557',
            'https://www.figma.com/api/mcp/asset/70450f8f-74b2-4d23-85d4-4fc248d6e557',
            'https://www.figma.com/api/mcp/asset/70450f8f-74b2-4d23-85d4-4fc248d6e557',
            'https://www.figma.com/api/mcp/asset/70450f8f-74b2-4d23-85d4-4fc248d6e557'
        ]
    },
    {
        id: 'lexus-lc',
        brand: 'LEXUS',
        model: 'LC SERIES',
        name: 'Lexus LC Series',
        image: 'https://www.figma.com/api/mcp/asset/9ad5e5ca-f5dd-43f6-a06b-ba61121fc9d8',
        styling: {
            width: '100%',
            scale: '1',
            marginLeft: '0',
            marginRight: '0',
            marginTop: '-200px',
            marginBottom: '0',
            padding: '0'
        },
        textStyling: {
            brandFontSize: '64px',
            brandFontSizeActive: '48px',
            brandColor: '',
            brandFontWeight: '600',
            brandLetterSpacing: 'normal',
            brandMarginTop: '50px',
            brandMarginBottom: '0',
            modelFontSize: '200px',
            modelFontSizeActive: '180px',
            modelColor: '',
            modelFontWeight: '600',
            modelLetterSpacing: 'normal',
            modelMarginTop: '0',
            modelMarginBottom: '0'
        },
        specs: {
            gas: '800 KM',
            seats: '4',
            horsepower: '335'
        },
        gallery: [
            'https://www.figma.com/api/mcp/asset/cf15af61-3975-4919-a235-e3d240d020fa',
            'https://www.figma.com/api/mcp/asset/b950460d-56da-4f41-8e39-45c0c155e5e5',
            'https://www.figma.com/api/mcp/asset/4ff17011-8d4b-476f-b923-299c50e3b1bc',
            'https://www.figma.com/api/mcp/asset/82b4a2a2-6cae-426e-b406-8c949ec746a2'
        ]
    }
];

// ========================================
// TESTIMONIALS DATA
// ========================================
const testimonialsData = [
    {
        quote: "Absolutely amazing service! The Lexus LC was pristine and the team was incredibly professional.",
        author: "Sarah Chen",
        role: "Business Executive",
        company: "Linear"
    },
    {
        quote: "Best car rental experience I've ever had. The Mustang was a dream to drive.",
        author: "Michael Rodriguez",
        role: "Entrepreneur",
        company: "Vercel"
    },
    {
        quote: "Professional, reliable, and the cars are maintained perfectly. Five stars all the way!",
        author: "Elena Martinez",
        role: "Marketing Director",
        company: "Stripe"
    }
];

// ========================================
// STATE MANAGEMENT
// ========================================
let currentSlide = 2;
let currentTestimonial = 0;

// ========================================
// DOM ELEMENTS - CAROUSEL
// ========================================
const carNamesWrapper = document.getElementById('carNamesWrapper');
const carSlidesWrapper = document.getElementById('carSlidesWrapper');
const pageControlDots = document.getElementById('pageControlDots');
const arrowLeft = document.querySelector('.arrow-left');
const arrowRight = document.querySelector('.arrow-right');
const detailsBtn = document.querySelector('.details-btn');
const rentNowBtn = document.querySelector('.rent-now-btn');
const detailsPage = document.querySelector('.details-page');
const backButton = document.querySelector('.back-button');
const rentNowDetailsBtn = document.querySelector('.rent-now-details');

// ========================================
// DOM ELEMENTS - TESTIMONIALS
// ========================================
const testimonialNumber = document.getElementById('testimonialNumber');
const companyBadge = document.querySelector('.badge-text');
const testimonialQuote = document.getElementById('testimonialQuote');
const authorName = document.querySelector('.author-name');
const authorRole = document.querySelector('.author-role');
const progressBar = document.getElementById('progressBar');
const navPrev = document.getElementById('navPrev');
const navNext = document.getElementById('navNext');

// ========================================
// DOM ELEMENTS - SCROLL & THEME
// ========================================
const scrollCard = document.querySelector('.scroll-card');
const scrollTitle = document.querySelector('.scroll-title');
const themeToggleButtons = document.querySelectorAll('.theme-toggle');

// ========================================
// FEATURED CARS - LOAD FROM DATABASE
// ========================================
async function loadFeaturedCars() {
    try {
        const response = await fetch('/api/cars?featured=true');
        
        if (response.ok) {
            const cars = await response.json();
            
            if (cars.length > 0) {
                renderFeaturedCars(cars);
                console.log('✅ Featured cars loaded from database:', cars.length);
            } else {
                console.log('⚠️ No featured cars in database, using defaults');
                renderDefaultFeaturedCars();
            }
        } else {
            console.error('❌ Failed to load featured cars');
            renderDefaultFeaturedCars();
        }
    } catch (error) {
        console.error('❌ Error loading featured cars:', error);
        renderDefaultFeaturedCars();
    }
}

// ========================================
// FEATURED CARS - RENDER
// ========================================
function renderFeaturedCars(cars) {
    const showcaseContainer = document.querySelector('.cars-showcase');
    if (!showcaseContainer) return;
    
    showcaseContainer.innerHTML = cars.map((car, index) => {
        // Determine badge
        let badge = car.badge || 'Featured';
        if (!car.badge) {
            if (index === 0) badge = 'Popular';
            else if (index === 1) badge = 'Luxury';
            else if (index === 2) badge = 'New';
        }
        
        return `
            <div class="showcase-card fade-in-up" style="animation-delay: ${0.1 * (index + 1)}s;">
                <div class="showcase-image">
                    <img src="${car.image}" alt="${car.brand} ${car.model}">
                    <div class="showcase-badge">${badge}</div>
                </div>
                <div class="showcase-content">
                    <div class="showcase-header">
                        <h3>${car.brand} ${car.model}</h3>
                        <div class="showcase-price">$${car.price}<span>/day</span></div>
                    </div>
                    <div class="showcase-specs">
                        <div class="spec-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            </svg>
                            <span>${car.horsepower} HP</span>
                        </div>
                        <div class="spec-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="8" width="18" height="12" rx="2"></rect>
                            </svg>
                            <span>${car.seats} Seats</span>
                        </div>
                        <div class="spec-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 6v6l4 2"></path>
                            </svg>
                            <span>Auto</span>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-full" onclick="bookCar('${car._id || car.id}')">Book Now</button>
                </div>
            </div>
        `;
    }).join('');
}

// ========================================
// FEATURED CARS - DEFAULT FALLBACK
// ========================================
function renderDefaultFeaturedCars() {
    const defaultCars = [
        {
            id: 1,
            brand: 'Ford',
            model: 'Mustang',
            price: 250,
            horsepower: 450,
            seats: 4,
            image: 'https://www.figma.com/api/mcp/asset/85162a70-b54f-4585-80bd-98137a2a120e',
            badge: 'Popular'
        },
        {
            id: 2,
            brand: 'Lexus',
            model: 'LC Series',
            price: 350,
            horsepower: 335,
            seats: 4,
            image: 'https://www.figma.com/api/mcp/asset/9ad5e5ca-f5dd-43f6-a06b-ba61121fc9d8',
            badge: 'Luxury'
        },
        {
            id: 3,
            brand: 'Audi',
            model: 'A3',
            price: 180,
            horsepower: 240,
            seats: 5,
            image: 'https://www.figma.com/api/mcp/asset/70450f8f-74b2-4d23-85d4-4fc248d6e557',
            badge: 'New'
        }
    ];
    
    renderFeaturedCars(defaultCars);
}

// ========================================
// BOOKING FUNCTIONALITY
// ========================================
function bookCar(carId) {
    const user = localStorage.getItem('user');
    
    if (!user) {
        alert('Please sign in to book a car');
        window.location.href = '/signin';
        return;
    }
    
    localStorage.setItem('selectedCar', carId);
    alert('Booking functionality coming soon!\nSelected Car ID: ' + carId);
}

// Make bookCar globally available
window.bookCar = bookCar;

// ========================================
// CAROUSEL - INITIALIZE
// ========================================
function initializeCarousel() {
    if (!carNamesWrapper || !carSlidesWrapper || !pageControlDots) return;
    
    carNamesWrapper.innerHTML = '';
    carSlidesWrapper.innerHTML = '';
    pageControlDots.innerHTML = '';

    carsArray.forEach((car, index) => {
        const carName = document.createElement('div');
        carName.className = 'car-name';
        carName.setAttribute('data-index', index);
        carName.setAttribute('data-id', car.id);
        
        if (car.textStyling) {
            Object.entries(car.textStyling).forEach(([key, value]) => {
                const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                carName.style.setProperty(`--${cssVar}`, value);
            });
        }
        
        carName.innerHTML = `
            <div class="car-brand">${car.brand}</div>
            <div class="car-model">${car.model}</div>
        `;
        carNamesWrapper.appendChild(carName);
    });

    carsArray.forEach((car, index) => {
        const carSlide = document.createElement('div');
        carSlide.className = 'car-slide animate-in';
        carSlide.setAttribute('data-index', index);
        carSlide.setAttribute('data-id', car.id);
        
        if (car.styling) {
            Object.entries(car.styling).forEach(([key, value]) => {
                const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                carSlide.style.setProperty(`--img-${cssVar}`, value);
            });
        }
        
        carSlide.innerHTML = `<img src="${car.image}" alt="${car.name}">`;
        carSlidesWrapper.appendChild(carSlide);
    });

    carsArray.forEach((car, index) => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.setAttribute('data-index', index);
        dot.setAttribute('data-id', car.id);
        pageControlDots.appendChild(dot);
    });

    updateSlider();
}

// ========================================
// CAROUSEL - UPDATE SLIDER
// ========================================
function getResponsiveDimensions() {
    const width = window.innerWidth;
    if (width <= 480) {
        return { slideWidth: width * 0.95, gap: 50, nameHeight: 250 };
    } else if (width <= 768) {
        return { slideWidth: width * 0.95, gap: 100, nameHeight: 300 };
    } else if (width <= 1024) {
        return { slideWidth: width * 0.9, gap: 200, nameHeight: 350 };
    } else {
        return { slideWidth: 930, gap: 265, nameHeight: 352 };
    }
}

function updateSlider() {
    const dims = getResponsiveDimensions();
    const slideWidth = dims.slideWidth + dims.gap;
    
    const offset = -currentSlide * slideWidth;
    carSlidesWrapper.style.transform = `translateX(${offset}px)`;

    const nameOffset = -currentSlide * dims.nameHeight;
    carNamesWrapper.style.transform = `translateY(${nameOffset}px)`;

    const carNames = document.querySelectorAll('.main-view .car-name');
    const dots = document.querySelectorAll('.dot');

    carNames.forEach((name, index) => {
        name.classList.toggle('active', index === currentSlide);
    });

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });

    updateDetailsPage();
}

function updateDetailsPage() {
    if (!detailsPage) return;
    
    const currentCar = carsArray[currentSlide];
    
    const specValues = detailsPage.querySelectorAll('.spec-value');
    if (specValues.length >= 3) {
        specValues[0].textContent = currentCar.specs.gas;
        specValues[1].textContent = currentCar.specs.seats;
        specValues[2].textContent = currentCar.specs.horsepower;
    }

    const galleryImages = detailsPage.querySelectorAll('.gallery-image img');
    currentCar.gallery.forEach((img, index) => {
        if (galleryImages[index]) {
            galleryImages[index].src = img;
        }
    });
}

// ========================================
// CAROUSEL - NAVIGATION
// ========================================
function nextSlide() {
    currentSlide = (currentSlide + 1) % carsArray.length;
    updateSlider();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + carsArray.length) % carsArray.length;
    updateSlider();
}

// ========================================
// TESTIMONIALS - UPDATE
// ========================================
function updateTestimonial(index) {
    if (!testimonialNumber || !testimonialQuote) return;
    
    const testimonial = testimonialsData[index];
    
    const numberDisplay = testimonialNumber.querySelector('.number-display');
    if (numberDisplay) {
        numberDisplay.style.opacity = '0';
        numberDisplay.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            numberDisplay.textContent = String(index + 1).padStart(2, '0');
            numberDisplay.style.opacity = '1';
            numberDisplay.style.transform = 'scale(1)';
        }, 300);
    }

    if (companyBadge) {
        companyBadge.style.opacity = '0';
        companyBadge.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            companyBadge.textContent = testimonial.company;
            companyBadge.style.opacity = '1';
            companyBadge.style.transform = 'translateX(0)';
        }, 200);
    }

    testimonialQuote.style.opacity = '0';
    testimonialQuote.style.transform = 'translateY(20px)';
    setTimeout(() => {
        testimonialQuote.textContent = testimonial.quote;
        testimonialQuote.style.opacity = '1';
        testimonialQuote.style.transform = 'translateY(0)';
    }, 300);

    const authorInfo = document.querySelector('.author-info');
    if (authorInfo && authorName && authorRole) {
        authorInfo.style.opacity = '0';
        authorInfo.style.transform = 'translateY(20px)';
        setTimeout(() => {
            authorName.textContent = testimonial.author;
            authorRole.textContent = testimonial.role;
            authorInfo.style.opacity = '1';
            authorInfo.style.transform = 'translateY(0)';
        }, 400);
    }

    if (progressBar) {
        const progressPercent = ((index + 1) / testimonialsData.length) * 100;
        progressBar.style.height = progressPercent + '%';
    }

    currentTestimonial = index;
}

function nextTestimonial() {
    const nextIndex = (currentTestimonial + 1) % testimonialsData.length;
    updateTestimonial(nextIndex);
}

function prevTestimonial() {
    const prevIndex = (currentTestimonial - 1 + testimonialsData.length) % testimonialsData.length;
    updateTestimonial(prevIndex);
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
function handleScrollAnimations() {
    if (!scrollCard || !scrollTitle) return;
    
    const scrollContainer = document.querySelector('.scroll-container');
    if (!scrollContainer) return;
    
    const rect = scrollContainer.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    let scrollProgress = 0;
    if (rect.top < windowHeight && rect.bottom > 0) {
        scrollProgress = Math.max(0, Math.min(1, 
            (windowHeight - rect.top) / (windowHeight * 1.0)
        ));
    }

    const titleTranslate = scrollProgress * -200;
    const titleOpacity = 0.3 + (scrollProgress * 0.7);
    scrollTitle.style.transform = `translateY(${titleTranslate}px)`;
    scrollTitle.style.opacity = titleOpacity;

    const rotateX = 35 * (1 - scrollProgress);
    const scale = window.innerWidth <= 768 
        ? 0.7 + (scrollProgress * 0.25)
        : 1.15 - (scrollProgress * 0.15);

    scrollCard.style.transform = `
        perspective(1200px) 
        rotateX(${rotateX}deg) 
        scale(${scale})
    `;

    animateOnScroll();
}

function animateOnScroll() {
    const elements = document.querySelectorAll('.fade-in-up');
    
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight * 0.85) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }
    });
}

// ========================================
// THEME TOGGLE
// ========================================
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
}

// ========================================
// EVENT LISTENERS
// ========================================
function setupEventListeners() {
    // Carousel navigation
    if (arrowLeft) arrowLeft.addEventListener('click', prevSlide);
    if (arrowRight) arrowRight.addEventListener('click', nextSlide);

    if (pageControlDots) {
        pageControlDots.addEventListener('click', (e) => {
            if (e.target.classList.contains('dot')) {
                currentSlide = parseInt(e.target.getAttribute('data-index'));
                updateSlider();
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (detailsPage && detailsPage.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    // Details page
    if (detailsBtn) {
        detailsBtn.addEventListener('click', () => {
            detailsPage.classList.add('active');
        });
    }

    if (backButton) {
        backButton.addEventListener('click', () => {
            detailsPage.classList.remove('active');
        });
    }

    // Rent buttons
    if (rentNowBtn) {
        rentNowBtn.addEventListener('click', () => {
            alert(`Rent ${carsArray[currentSlide].name} - Coming soon!`);
        });
    }

    if (rentNowDetailsBtn) {
        rentNowDetailsBtn.addEventListener('click', () => {
            alert(`Rent ${carsArray[currentSlide].name} - Coming soon!`);
        });
    }

    // Touch swipe support
    const slidesWrapper = document.querySelector('.slides-wrapper');
    if (slidesWrapper) {
        let touchStartX = 0;
        let touchEndX = 0;

        slidesWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        slidesWrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchEndX < touchStartX - 50) nextSlide();
            if (touchEndX > touchStartX + 50) prevSlide();
        });
    }

    // Testimonials navigation
    if (navNext) navNext.addEventListener('click', nextTestimonial);
    if (navPrev) navPrev.addEventListener('click', prevTestimonial);

    // Auto-rotate testimonials
    let testimonialInterval = setInterval(nextTestimonial, 6000);

    if (navNext) {
        navNext.addEventListener('click', () => {
            clearInterval(testimonialInterval);
            testimonialInterval = setInterval(nextTestimonial, 6000);
        });
    }

    if (navPrev) {
        navPrev.addEventListener('click', () => {
            clearInterval(testimonialInterval);
            testimonialInterval = setInterval(nextTestimonial, 6000);
        });
    }

    // Scroll animations
    window.addEventListener('scroll', handleScrollAnimations);

    // Smooth scroll for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Theme toggle
    themeToggleButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            toggleTheme();
        });
    });

    // Theme keyboard shortcut
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            toggleTheme();
        }
    });

    // Resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateSlider();
        }, 250);
    });

    // Sign in button (if user not logged in)
    const signinBtn = document.getElementById('signinBtn');
    if (signinBtn) {
        signinBtn.addEventListener('click', () => {
            window.location.href = 'public/signin.html';
        });
    }
}

// ========================================
// INITIALIZATION
// ========================================
function init() {
    // Apply saved theme
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    // Check user authentication
    checkUserAuthentication();

    // Initialize carousel (hero section)
    initializeCarousel();

    // Load featured cars from database
    loadFeaturedCars();

    // Initialize testimonials
    updateTestimonial(0);

    // Initial scroll animation check
    animateOnScroll();

    // Setup all event listeners
    setupEventListeners();

    console.log('🚗 Car Rental application initialized');
    console.log('🎨 Theme system active');
    console.log('👤 User authentication checked');
    console.log('⭐ Featured cars loading from database...');
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export functions if needed
window.toggleTheme = toggleTheme;
window.checkUserAuthentication = checkUserAuthentication;
window.bookCar = bookCar;