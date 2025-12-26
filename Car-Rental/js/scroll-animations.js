/**
 * SCROLL ANIMATIONS MODULE
 * Handles scroll-triggered animations and parallax effects
 */

// ========================================
// SCROLL CARD ANIMATION
// ========================================
const scrollCard = document.querySelector('.scroll-card');
const scrollTitle = document.querySelector('.scroll-title');

window.addEventListener('scroll', () => {
    const scrollContainer = document.querySelector('.scroll-container');
    const rect = scrollContainer.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate scroll progress
    let scrollProgress = 0;
    if (rect.top < windowHeight && rect.bottom > 0) {
        scrollProgress = Math.max(0, Math.min(1, 
            (windowHeight - rect.top) / (windowHeight * 1.0)
        ));
    }

    // Title animation - moves up and becomes fully visible
    const titleTranslate = scrollProgress * -200;
    const titleOpacity = 0.3 + (scrollProgress * 0.7);
    scrollTitle.style.transform = `translateY(${titleTranslate}px)`;
    scrollTitle.style.opacity = titleOpacity;

    // Card 3D tilt animation
    const rotateX = 35 * (1 - scrollProgress);
    const scale = window.innerWidth <= 768 
        ? 0.7 + (scrollProgress * 0.25)
        : 1.15 - (scrollProgress * 0.15);

    scrollCard.style.transform = `
        perspective(1200px) 
        rotateX(${rotateX}deg) 
        scale(${scale})
    `;

    // Animate sections on scroll
    animateOnScroll();
});

// ========================================
// SCROLL-TRIGGERED ANIMATIONS
// ========================================
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

// Initial check on page load
animateOnScroll();

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================
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