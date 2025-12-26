/**
 * CAR CAROUSEL MODULE
 * Handles the main car slider/carousel functionality
 */

// ========================================
// CAR DATA
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
// STATE MANAGEMENT
// ========================================
let currentSlide = 2;

// ========================================
// DOM ELEMENTS
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
// INITIALIZE CAROUSEL
// ========================================
function initializeCarousel() {
    // Clear existing content
    carNamesWrapper.innerHTML = '';
    carSlidesWrapper.innerHTML = '';
    pageControlDots.innerHTML = '';

    // Create car name elements
    carsArray.forEach((car, index) => {
        const carName = document.createElement('div');
        carName.className = 'car-name';
        carName.setAttribute('data-index', index);
        carName.setAttribute('data-id', car.id);
        
        // Apply text styling
        if (car.textStyling) {
            carName.style.setProperty('--brand-font-size', car.textStyling.brandFontSize);
            carName.style.setProperty('--brand-font-size-active', car.textStyling.brandFontSizeActive);
            if (car.textStyling.brandColor) {
                carName.style.setProperty('--brand-color', car.textStyling.brandColor);
            }
            carName.style.setProperty('--brand-font-weight', car.textStyling.brandFontWeight);
            carName.style.setProperty('--brand-letter-spacing', car.textStyling.brandLetterSpacing);
            carName.style.setProperty('--brand-margin-top', car.textStyling.brandMarginTop);
            carName.style.setProperty('--brand-margin-bottom', car.textStyling.brandMarginBottom);
            
            carName.style.setProperty('--model-font-size', car.textStyling.modelFontSize);
            carName.style.setProperty('--model-font-size-active', car.textStyling.modelFontSizeActive);
            if (car.textStyling.modelColor) {
                carName.style.setProperty('--model-color', car.textStyling.modelColor);
            }
            carName.style.setProperty('--model-font-weight', car.textStyling.modelFontWeight);
            carName.style.setProperty('--model-letter-spacing', car.textStyling.modelLetterSpacing);
            carName.style.setProperty('--model-margin-top', car.textStyling.modelMarginTop);
            carName.style.setProperty('--model-margin-bottom', car.textStyling.modelMarginBottom);
        }
        
        carName.innerHTML = `
            <div class="car-brand">${car.brand}</div>
            <div class="car-model">${car.model}</div>
        `;
        carNamesWrapper.appendChild(carName);
    });

    // Create car slide elements
    carsArray.forEach((car, index) => {
        const carSlide = document.createElement('div');
        carSlide.className = 'car-slide animate-in';
        carSlide.setAttribute('data-index', index);
        carSlide.setAttribute('data-id', car.id);
        
        // Apply image styling
        if (car.styling) {
            carSlide.style.setProperty('--img-width', car.styling.width);
            carSlide.style.setProperty('--img-scale', car.styling.scale);
            carSlide.style.setProperty('--img-margin-left', car.styling.marginLeft);
            carSlide.style.setProperty('--img-margin-right', car.styling.marginRight);
            carSlide.style.setProperty('--img-margin-top', car.styling.marginTop);
            carSlide.style.setProperty('--img-margin-bottom', car.styling.marginBottom);
            carSlide.style.setProperty('--img-padding', car.styling.padding);
        }
        
        carSlide.innerHTML = `<img src="${car.image}" alt="${car.name}">`;
        carSlidesWrapper.appendChild(carSlide);
    });

    // Create pagination dots
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
// RESPONSIVE DIMENSIONS
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

// ========================================
// UPDATE SLIDER POSITION
// ========================================
function updateSlider() {
    const dims = getResponsiveDimensions();
    const slideWidth = dims.slideWidth + dims.gap;
    
    // Update slide position
    const offset = -currentSlide * slideWidth;
    carSlidesWrapper.style.transform = `translateX(${offset}px)`;

    // Update name position
    const nameOffset = -currentSlide * dims.nameHeight;
    carNamesWrapper.style.transform = `translateY(${nameOffset}px)`;

    // Update active states
    const carNames = document.querySelectorAll('.main-view .car-name');
    const dots = document.querySelectorAll('.dot');

    carNames.forEach((name, index) => {
        name.classList.toggle('active', index === currentSlide);
    });

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });

    // Update details page
    updateDetailsPage();
}

// ========================================
// UPDATE DETAILS PAGE
// ========================================
function updateDetailsPage() {
    const currentCar = carsArray[currentSlide];
    
    // Update specs
    const specValues = detailsPage.querySelectorAll('.spec-value');
    specValues[0].textContent = currentCar.specs.gas;
    specValues[1].textContent = currentCar.specs.seats;
    specValues[2].textContent = currentCar.specs.horsepower;

    // Update gallery images
    const galleryImages = detailsPage.querySelectorAll('.gallery-image img');
    currentCar.gallery.forEach((img, index) => {
        if (galleryImages[index]) {
            galleryImages[index].src = img;
        }
    });
}

// ========================================
// NAVIGATION FUNCTIONS
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
// EVENT LISTENERS
// ========================================
arrowLeft.addEventListener('click', prevSlide);
arrowRight.addEventListener('click', nextSlide);

pageControlDots.addEventListener('click', (e) => {
    if (e.target.classList.contains('dot')) {
        currentSlide = parseInt(e.target.getAttribute('data-index'));
        updateSlider();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (detailsPage.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
});

// Details page navigation
detailsBtn.addEventListener('click', () => {
    detailsPage.classList.add('active');
});

backButton.addEventListener('click', () => {
    detailsPage.classList.remove('active');
});

// Rent buttons
rentNowBtn.addEventListener('click', () => {
    alert(`Rent ${carsArray[currentSlide].name} - Coming soon!`);
});

rentNowDetailsBtn.addEventListener('click', () => {
    alert(`Rent ${carsArray[currentSlide].name} - Coming soon!`);
});

// Resize handler
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        updateSlider();
    }, 250);
});

// Touch swipe support
let touchStartX = 0;
let touchEndX = 0;

const slidesWrapper = document.querySelector('.slides-wrapper');

slidesWrapper.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

slidesWrapper.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        nextSlide();
    }
    if (touchEndX > touchStartX + 50) {
        prevSlide();
    }
}

// ========================================
// INITIALIZE ON LOAD
// ========================================
initializeCarousel();