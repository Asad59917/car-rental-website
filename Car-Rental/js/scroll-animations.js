let currentSlide = 2;
let currentTestimonial = 0;
let isMobile = window.innerWidth <= 768;
let isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;

const burgerMenu = document.getElementById('burgerMenu');
const navMobile = document.getElementById('navMobile');
const closeMenu = document.getElementById('closeMenu');
const mobileThemeToggle = document.getElementById('mobileThemeToggle');

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

const detailsCarNamesWrapper = document.getElementById('detailsCarNamesWrapper');
const detailsSlidesWrapper = document.getElementById('detailsSlidesWrapper');
const galleryImages = document.getElementById('galleryImages');

const carsShowcase = document.getElementById('carsShowcase');

const testimonialNumber = document.getElementById('testimonialNumber');
const companyBadge = document.getElementById('companyBadge');
const testimonialQuote = document.getElementById('testimonialQuote');
const authorName = document.querySelector('.author-name');
const authorRole = document.querySelector('.author-role');
const progressBar = document.getElementById('progressBar');
const navPrev = document.getElementById('navPrev');
const navNext = document.getElementById('navNext');

const themeToggle = document.getElementById('themeToggle');
const footerThemeToggle = document.querySelector('.footer-theme-toggle');

const scrollCard = document.querySelector('.scroll-card');
const scrollTitle = document.querySelector('.scroll-title');

const carsArray = [
    {
        id: 'mustang',
        brand: 'FORD',
        model: 'MUSTANG',
        name: 'Ford Mustang',
        image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80',
        styling: {
            width: '100%',
            scale: '1',
            marginTop: isMobile ? '-50px' : '-230px',
        },
        textStyling: {
            brandFontSize: isMobile ? '2rem' : '3.5rem',
            brandFontSizeActive: isMobile ? '1.5rem' : '2.5rem',
            modelFontSize: isMobile ? '4rem' : '8rem',
            modelFontSizeActive: isMobile ? '3rem' : '6rem',
        },
        specs: {
            gas: '700 KM',
            seats: '4',
            horsepower: '450'
        },
        gallery: [
            'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80',
            'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1964&q=80',
            'https://images.unsplash.com/photo-1555212697-194d092e3b8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1964&q=80',
            'https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1964&q=80'
        ]
    },
    {
        id: 'audi-a3',
        brand: 'AUDI',
        model: 'A3',
        name: 'Audi A3',
        image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1936&q=80',
        styling: {
            width: '110%',
            scale: '1',
            marginLeft: isMobile ? '0' : '-90px',
            marginTop: isMobile ? '-30px' : '-110px',
        },
        textStyling: {
            brandFontSize: isMobile ? '2rem' : '3.5rem',
            brandFontSizeActive: isMobile ? '1.5rem' : '2.5rem',
            modelFontSize: isMobile ? '4rem' : '8rem',
            modelFontSizeActive: isMobile ? '3rem' : '6rem',
        },
        specs: {
            gas: '650 KM',
            seats: '5',
            horsepower: '240'
        },
        gallery: [
            'https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1936&q=80',
            'https://images.unsplash.com/photo-1555212697-194d092e3b8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1964&q=80',
            'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-4.0.3&auto=format&fit=crop&w=1964&q=80',
            'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1964&q=80'
        ]
    },
    {
        id: 'lexus-lc',
        brand: 'LEXUS',
        model: 'LC SERIES',
        name: 'Lexus LC Series',
        image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80',
        styling: {
            width: '100%',
            scale: '1',
            marginTop: isMobile ? '-40px' : '-200px',
        },
        textStyling: {
            brandFontSize: isMobile ? '2rem' : '3.5rem',
            brandFontSizeActive: isMobile ? '1.5rem' : '2.5rem',
            modelFontSize: isMobile ? '4rem' : '8rem',
            modelFontSizeActive: isMobile ? '3rem' : '6rem',
        },
        specs: {
            gas: '800 KM',
            seats: '4',
            horsepower: '335'
        },
        gallery: [
            'https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80',
            'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1964&q=80',
            'https://images.unsplash.com/photo-1555212697-194d092e3b8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1964&q=80',
            'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-4.0.3&auto=format&fit=crop&w=1964&q=80'
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

const featuredCars = [
    {
        id: 1,
        brand: 'Ford',
        model: 'Mustang',
        price: 250,
        horsepower: 450,
        seats: 4,
        image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80',
        badge: 'Popular'
    },
    {
        id: 2,
        brand: 'Lexus',
        model: 'LC Series',
        price: 350,
        horsepower: 335,
        seats: 4,
        image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80',
        badge: 'Luxury'
    },
    {
        id: 3,
        brand: 'Audi',
        model: 'A3',
        price: 180,
        horsepower: 240,
        seats: 5,
        image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1936&q=80',
        badge: 'New'
    }
];

function initBurgerMenu() {
    if (!burgerMenu || !navMobile || !closeMenu) return;
    
    burgerMenu.addEventListener('click', () => {
        burgerMenu.classList.add('active');
        navMobile.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeMenu.addEventListener('click', () => {
        burgerMenu.classList.remove('active');
        navMobile.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    const mobileLinks = navMobile.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            burgerMenu.classList.remove('active');
            navMobile.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    document.addEventListener('click', (e) => {
        if (navMobile.classList.contains('active') && 
            !navMobile.contains(e.target) && 
            !burgerMenu.contains(e.target)) {
            burgerMenu.classList.remove('active');
            navMobile.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

function initTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
    
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (footerThemeToggle) footerThemeToggle.addEventListener('click', toggleTheme);
    if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);
    
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            toggleTheme();
        }
    });
}

function initCarousel() {
    if (!carNamesWrapper || !carSlidesWrapper || !pageControlDots) return;
    
    carNamesWrapper.innerHTML = '';
    carSlidesWrapper.innerHTML = '';
    pageControlDots.innerHTML = '';
    
    carsArray.forEach((car, index) => {
        const carName = document.createElement('div');
        carName.className = 'car-name';
        carName.setAttribute('data-index', index);
        carName.setAttribute('data-id', car.id);
        
        const brandFontSize = isMobile ? car.textStyling.brandFontSizeActive : car.textStyling.brandFontSize;
        const modelFontSize = isMobile ? car.textStyling.modelFontSizeActive : car.textStyling.modelFontSize;
        
        carName.innerHTML = `
            <div class="car-brand" style="font-size: ${brandFontSize}">${car.brand}</div>
            <div class="car-model" style="font-size: ${modelFontSize}">${car.model}</div>
        `;
        carNamesWrapper.appendChild(carName);
        
        const carSlide = document.createElement('div');
        carSlide.className = 'car-slide';
        carSlide.setAttribute('data-index', index);
        carSlide.setAttribute('data-id', car.id);
        
        const marginTop = isMobile ? car.styling.marginTop : car.styling.marginTop;
        
        carSlide.innerHTML = `
            <img src="${car.image}" alt="${car.name}" style="margin-top: ${marginTop}">
        `;
        carSlidesWrapper.appendChild(carSlide);
        
        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.setAttribute('data-index', index);
        dot.setAttribute('data-id', car.id);
        pageControlDots.appendChild(dot);
    });
    
    updateCarousel();
}

function updateCarousel() {
    if (!carNamesWrapper || !carSlidesWrapper) return;
    
    const slideWidth = 100;
    const nameHeight = isMobile ? 150 : 200;
    
    const slideOffset = -currentSlide * slideWidth;
    carSlidesWrapper.style.transform = `translateX(${slideOffset}%)`;
    
    const nameOffset = -currentSlide * nameHeight;
    carNamesWrapper.style.transform = `translateY(${nameOffset}px)`;
    
    const carNames = document.querySelectorAll('.car-name');
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
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + carsArray.length) % carsArray.length;
    updateCarousel();
}

function initDetailsPage() {
    if (!detailsBtn || !detailsPage || !backButton) return;
    
    detailsBtn.addEventListener('click', () => {
        updateDetailsPage();
        detailsPage.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    backButton.addEventListener('click', () => {
        detailsPage.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && detailsPage.classList.contains('active')) {
            detailsPage.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    updateDetailsPage();
}

function updateDetailsPage() {
    if (!detailsCarNamesWrapper || !detailsSlidesWrapper || !galleryImages) return;
    
    const currentCar = carsArray[currentSlide];
    
    detailsCarNamesWrapper.innerHTML = '';
    detailsSlidesWrapper.innerHTML = '';
    galleryImages.innerHTML = '';
    
    const carName = document.createElement('div');
    carName.className = 'car-name active';
    
    const brandFontSize = isMobile ? '1.5rem' : '2.5rem';
    const modelFontSize = isMobile ? '3rem' : '6rem';
    
    carName.innerHTML = `
        <div class="car-brand" style="font-size: ${brandFontSize}">${currentCar.brand}</div>
        <div class="car-model" style="font-size: ${modelFontSize}">${currentCar.model}</div>
    `;
    detailsCarNamesWrapper.appendChild(carName);
    
    const carSlide = document.createElement('div');
    carSlide.className = 'car-slide';
    carSlide.innerHTML = `<img src="${currentCar.image}" alt="${currentCar.name}">`;
    detailsSlidesWrapper.appendChild(carSlide);
    
    const specValues = document.querySelectorAll('.spec-value');
    if (specValues.length >= 3) {
        specValues[0].textContent = currentCar.specs.gas;
        specValues[1].textContent = currentCar.specs.seats;
        specValues[2].textContent = currentCar.specs.horsepower;
    }
    
    currentCar.gallery.forEach((img, index) => {
        const galleryImage = document.createElement('div');
        galleryImage.className = 'gallery-image';
        galleryImage.innerHTML = `<img src="${img}" alt="${currentCar.name} - View ${index + 1}">`;
        galleryImages.appendChild(galleryImage);
    });
}

function initFeaturedCars() {
    if (!carsShowcase) return;
    
    carsShowcase.innerHTML = featuredCars.map((car, index) => `
        <div class="showcase-card fade-in-up" style="animation-delay: ${0.1 * (index + 1)}s;">
            <div class="showcase-image">
                <img src="${car.image}" alt="${car.brand} ${car.model}">
                <div class="showcase-badge">${car.badge}</div>
            </div>
            <div class="showcase-content">
                <div class="showcase-header">
                    <h3>${car.brand} ${car.model}</h3>
                    <div class="showcase-price">$${car.price}<span>/day</span></div>
                </div>
                <div class="showcase-specs">
                    <div class="spec-item">
                        <i class="fas fa-tachometer-alt"></i>
                        <span>${car.horsepower} HP</span>
                    </div>
                    <div class="spec-item">
                        <i class="fas fa-user-friends"></i>
                        <span>${car.seats} Seats</span>
                    </div>
                    <div class="spec-item">
                        <i class="fas fa-cogs"></i>
                        <span>Auto</span>
                    </div>
                </div>
                <button class="btn btn-primary btn-full" onclick="bookCar(${car.id})">Book Now</button>
            </div>
        </div>
    `).join('');
}

function initTestimonials() {
    if (!testimonialNumber || !testimonialQuote) return;
    
    updateTestimonial(0);
    
    let testimonialInterval = setInterval(() => nextTestimonial(), 6000);
    
    if (navNext) {
        navNext.addEventListener('click', () => {
            clearInterval(testimonialInterval);
            nextTestimonial();
            testimonialInterval = setInterval(() => nextTestimonial(), 6000);
        });
    }
    
    if (navPrev) {
        navPrev.addEventListener('click', () => {
            clearInterval(testimonialInterval);
            prevTestimonial();
            testimonialInterval = setInterval(() => nextTestimonial(), 6000);
        });
    }
}

function updateTestimonial(index) {
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
        const badgeText = companyBadge.querySelector('.badge-text');
        if (badgeText) {
            badgeText.style.opacity = '0';
            badgeText.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                badgeText.textContent = testimonial.company;
                badgeText.style.opacity = '1';
                badgeText.style.transform = 'translateX(0)';
            }, 200);
        }
    }
    
    if (testimonialQuote) {
        testimonialQuote.style.opacity = '0';
        testimonialQuote.style.transform = 'translateY(20px)';
        setTimeout(() => {
            testimonialQuote.textContent = testimonial.quote;
            testimonialQuote.style.opacity = '1';
            testimonialQuote.style.transform = 'translateY(0)';
        }, 300);
    }
    
    if (authorName && authorRole) {
        authorName.textContent = testimonial.author;
        authorRole.textContent = testimonial.role;
    }
    
    if (progressBar) {
        const progressPercent = ((index + 1) / testimonialsData.length) * 100;
        progressBar.style.width = progressPercent + '%';
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

function initScrollAnimations() {
    if (!scrollCard || !scrollTitle) return;
    
    window.addEventListener('scroll', handleScrollAnimations);
    
    animateOnScroll();
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
    const scale = isMobile 
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
    const elements = document.querySelectorAll('.fade-in-up, .animate-on-scroll');
    
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight * 0.85) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            el.classList.add('visible');
        }
    });
}

function checkUserAuthentication() {
    const user = JSON.parse(localStorage.getItem('user'));
    const signinBtn = document.getElementById('signinBtn');
    
    if (user && signinBtn) {
        createUserMenu(user);
    }
}

function createUserMenu(user) {
    const signinBtn = document.getElementById('signinBtn');
    const isReturningUser = localStorage.getItem('hasLoggedInBefore') === 'true';
    const welcomeMessage = isReturningUser ? 'Welcome back' : 'Welcome';
    
    localStorage.setItem('hasLoggedInBefore', 'true');
    
    const userMenuHTML = `
        <div class="user-menu-container">
            <button class="btn-user-menu" id="userMenuBtn">
                <i class="fas fa-user"></i>
                <div class="user-info">
                    <span class="user-welcome">${welcomeMessage}</span>
                    <span class="user-name">${user.name}</span>
                </div>
                <i class="fas fa-chevron-down"></i>
            </button>
        </div>
    `;
    
    signinBtn.outerHTML = userMenuHTML;
    setupUserMenuListeners();
}

function setupUserMenuListeners() {
    const userMenuBtn = document.getElementById('userMenuBtn');
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', () => {
            handleSignOut();
        });
    }
}

function handleSignOut() {
    localStorage.removeItem('user');
    window.location.reload();
}

function bookCar(carId) {
    const user = localStorage.getItem('user');
    
    if (!user) {
        alert('Please sign in to book a car');
        window.location.href = '/signin';
        return;
    }
    
    localStorage.setItem('selectedCar', carId);
    alert(`Booking functionality coming soon!\nSelected Car ID: ${carId}`);
}

window.bookCar = bookCar;

function handleResponsive() {
    isMobile = window.innerWidth <= 768;
    isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
    
    updateCarousel();
    
    if (detailsPage.classList.contains('active')) {
        updateDetailsPage();
    }
}

function setupEventListeners() {
    if (arrowLeft) arrowLeft.addEventListener('click', prevSlide);
    if (arrowRight) arrowRight.addEventListener('click', nextSlide);
    
    if (pageControlDots) {
        pageControlDots.addEventListener('click', (e) => {
            if (e.target.classList.contains('dot')) {
                currentSlide = parseInt(e.target.getAttribute('data-index'));
                updateCarousel();
            }
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (detailsPage && detailsPage.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
    
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
    
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            handleResponsive();
        }, 250);
    });
}

function init() {
    console.log('🚗 Car Rental application initializing...');
    
    initBurgerMenu();
    initTheme();
    initCarousel();
    initDetailsPage();
    initFeaturedCars();
    initTestimonials();
    initScrollAnimations();
    
    checkUserAuthentication();
    
    setupEventListeners();
    
    console.log('✅ Car Rental application initialized successfully');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}