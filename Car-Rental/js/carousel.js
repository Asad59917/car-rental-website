const carsArray = [
    {
        id: 'mustang',
        brand: 'FORD',
        model: 'MUSTANG',
        name: 'Ford Mustang',
        image: 'images/2024_Ford_Mustang.png',  // ✅ Updated
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
            'images/2024_Ford_Mustang.png',  // ✅ Updated
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
        image: 'images/Audi_A3.png',  // ✅ Updated
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
            'images/Audi_A3.png',  // ✅ Updated
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
        image: 'images/2024_Lexus_LC.png',  // ✅ Updated
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
            'images/2024_Lexus_LC.png',  // ✅ Updated (you may want different angles if you have them)
            'images/2024_Lexus_LC.png',
            'images/2024_Lexus_LC.png',
            'images/2024_Lexus_LC.png'
        ]
    }
];

let currentSlide = 2;

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

function initializeCarousel() {
    carNamesWrapper.innerHTML = '';
    carSlidesWrapper.innerHTML = '';
    pageControlDots.innerHTML = '';

    carsArray.forEach((car, index) => {
        const carName = document.createElement('div');
        carName.className = 'car-name';
        carName.setAttribute('data-index', index);
        carName.setAttribute('data-id', car.id);
        
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

    carsArray.forEach((car, index) => {
        const carSlide = document.createElement('div');
        carSlide.className = 'car-slide animate-in';
        carSlide.setAttribute('data-index', index);
        carSlide.setAttribute('data-id', car.id);
        
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

    updateDetailsPage();
}

function updateDetailsPage() {
    const currentCar = carsArray[currentSlide];
    
    const specValues = detailsPage.querySelectorAll('.spec-value');
    specValues[0].textContent = currentCar.specs.gas;
    specValues[1].textContent = currentCar.specs.seats;
    specValues[2].textContent = currentCar.specs.horsepower;

    const galleryImages = detailsPage.querySelectorAll('.gallery-image img');
    currentCar.gallery.forEach((img, index) => {
        if (galleryImages[index]) {
            galleryImages[index].src = img;
        }
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

arrowLeft.addEventListener('click', prevSlide);
arrowRight.addEventListener('click', nextSlide);

pageControlDots.addEventListener('click', (e) => {
    if (e.target.classList.contains('dot')) {
        currentSlide = parseInt(e.target.getAttribute('data-index'));
        updateSlider();
    }
});

document.addEventListener('keydown', (e) => {
    if (detailsPage.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
});

detailsBtn.addEventListener('click', () => {
    detailsPage.classList.add('active');
});

backButton.addEventListener('click', () => {
    detailsPage.classList.remove('active');
});

rentNowBtn.addEventListener('click', () => {
    alert(`Rent ${carsArray[currentSlide].name} - Coming soon!`);
});

rentNowDetailsBtn.addEventListener('click', () => {
    alert(`Rent ${carsArray[currentSlide].name} - Coming soon!`);
});

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        updateSlider();
    }, 250);
});

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

initializeCarousel();