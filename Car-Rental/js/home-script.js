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
            window.location.href = 'public/signin.html';
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

function checkUserAuthentication() {
    const user = JSON.parse(localStorage.getItem('user'));
    const signinBtn = document.getElementById('signinBtn');
    const mobileSigninBtn = document.getElementById('mobileSigninBtn');
    
    if (user && signinBtn) {
        createUserMenu(user);
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

function createUserMenu(user) {
    const signinBtn = document.getElementById('signinBtn');
    
    const isReturningUser = localStorage.getItem('hasLoggedInBefore') === 'true';
    const welcomeMessage = isReturningUser ? 'Welcome back' : 'Welcome';
    
    localStorage.setItem('hasLoggedInBefore', 'true');
    
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
    
    signinBtn.outerHTML = userMenuHTML;
    setupUserMenuListeners();
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

const carsArray = [
    {
        id: 'mustang',
        brand: 'FORD',
        model: 'MUSTANG',
        name: 'Ford Mustang',
        image: 'images/2024_Ford_Mustang.png',
        styling: {
            width: '100%',
            scale: '1',
            marginLeft: '0',
            marginRight: '0',
            marginTop: '0px',
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
            'images/2024_Ford_Mustang.png',
            'images/2024_Ford_Mustang.png',
            'images/2024_Ford_Mustang.png',
            'images/2024_Ford_Mustang.png'
        ]
    },
    {
        id: 'audi-a3',
        brand: 'AUDI',
        model: 'A3',
        name: 'Audi A3',
        image: 'images/Audi_A3.png',
        styling: {
            width: '100%',
            scale: '1',
            marginLeft: '0px',
            marginRight: '0px',
            marginTop: '0px',
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
            'images/Audi_A3.png',
            'images/Audi_A3.png',
            'images/Audi_A3.png',
            'images/Audi_A3.png'
        ]
    },
    {
        id: 'lexus-lc',
        brand: 'LEXUS',
        model: 'LC SERIES',
        name: 'Lexus LC Series',
        image: 'images/2024_Lexus_LC.png',
        styling: {
            width: '100%',
            scale: '1',
            marginLeft: '0',
            marginRight: '0',
            marginTop: '0px',
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
            'images/2024_Lexus_LC.png',
            'images/2024_Lexus_LC.png',
            'images/2024_Lexus_LC.png',
            'images/2024_Lexus_LC.png'
        ]
    }
];

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

let currentSlide = 2;
let currentTestimonial = 0;

const carNamesWrapper = document.getElementById('carNamesWrapper');
const carSlidesWrapper = document.getElementById('carSlidesWrapper');
const pageControlDots = document.getElementById('pageControlDots');
const arrowLeft = document.querySelector('.arrow-left');
const arrowRight = document.querySelector('.arrow-right');

const testimonialNumber = document.getElementById('testimonialNumber');
const companyBadge = document.querySelector('.badge-text');
const testimonialQuote = document.getElementById('testimonialQuote');
const authorName = document.querySelector('.author-name');
const authorRole = document.querySelector('.author-role');
const progressBar = document.getElementById('progressBar');
const navPrev = document.getElementById('navPrev');
const navNext = document.getElementById('navNext');

const scrollCard = document.querySelector('.scroll-card');
const scrollTitle = document.querySelector('.scroll-title');
const themeToggleButtons = document.querySelectorAll('.theme-toggle');

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

function renderFeaturedCars(cars) {
    const showcaseContainer = document.querySelector('.cars-showcase');
    if (!showcaseContainer) return;
    
    showcaseContainer.innerHTML = cars.map((car, index) => {
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
                        <div class="showcase-price">AED ${car.price}<span>Dhs/day</span></div>
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

function renderDefaultFeaturedCars() {
    const defaultCars = [
        {
            id: 1,
            brand: 'Ford',
            model: 'Mustang',
            price: 250,
            horsepower: 450,
            seats: 4,
            image: 'images/2024_Ford_Mustang.png',
            badge: 'Popular'
        },
        {
            id: 2,
            brand: 'Lexus',
            model: 'LC Series',
            price: 350,
            horsepower: 335,
            seats: 4,
            image: 'images/2024_Lexus_LC.png',
            badge: 'Luxury'
        },
        {
            id: 3,
            brand: 'Audi',
            model: 'A3',
            price: 180,
            horsepower: 240,
            seats: 5,
            image: 'images/Audi_A3.png',
            badge: 'New'
        }
    ];
    
    renderFeaturedCars(defaultCars);
}

function bookCar(carId) {
    const user = localStorage.getItem('user');
    
    if (!user) {
        alert('Please sign in to book a car');
        window.location.href = '/signin';
        return;
    }
    
    localStorage.setItem('selectedCar', carId);
    window.location.href = '/booking.html';
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

window.bookCar = bookCar;

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
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % carsArray.length;
    updateSlider();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + carsArray.length) % carsArray.length;
    updateSlider();
}

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

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
}

function setupEventListeners() {
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

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

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

    if (navNext) navNext.addEventListener('click', nextTestimonial);
    if (navPrev) navPrev.addEventListener('click', prevTestimonial);

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

    window.addEventListener('scroll', handleScrollAnimations);

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

    themeToggleButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            toggleTheme();
        });
    });

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            toggleTheme();
        }
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateSlider();
        }, 250);
    });

    const signinBtn = document.getElementById('signinBtn');
    if (signinBtn) {
        signinBtn.addEventListener('click', () => {
            window.location.href = 'public/signin.html';
        });
    }
}

function init() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    initMobileMenu();

    initHeaderScrollEffect();

    checkUserAuthentication();

    initializeCarousel();

    loadFeaturedCars();

    updateTestimonial(0);

    animateOnScroll();

    setupEventListeners();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

window.toggleTheme = toggleTheme;
window.checkUserAuthentication = checkUserAuthentication;
window.bookCar = bookCar;