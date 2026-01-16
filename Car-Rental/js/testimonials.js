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

let currentTestimonial = 0;

const testimonialNumber = document.getElementById('testimonialNumber');
const companyBadge = document.querySelector('.badge-text');
const testimonialQuote = document.getElementById('testimonialQuote');
const authorName = document.querySelector('.author-name');
const authorRole = document.querySelector('.author-role');
const progressBar = document.getElementById('progressBar');
const navPrev = document.getElementById('navPrev');
const navNext = document.getElementById('navNext');

function updateTestimonial(index) {
    const testimonial = testimonialsData[index];
    
    const numberDisplay = testimonialNumber.querySelector('.number-display');
    numberDisplay.style.opacity = '0';
    numberDisplay.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        numberDisplay.textContent = String(index + 1).padStart(2, '0');
        numberDisplay.style.opacity = '1';
        numberDisplay.style.transform = 'scale(1)';
    }, 300);

    companyBadge.style.opacity = '0';
    companyBadge.style.transform = 'translateX(-20px)';
    setTimeout(() => {
        companyBadge.textContent = testimonial.company;
        companyBadge.style.opacity = '1';
        companyBadge.style.transform = 'translateX(0)';
    }, 200);

    testimonialQuote.style.opacity = '0';
    testimonialQuote.style.transform = 'translateY(20px)';
    setTimeout(() => {
        testimonialQuote.textContent = testimonial.quote;
        testimonialQuote.style.opacity = '1';
        testimonialQuote.style.transform = 'translateY(0)';
    }, 300);

    const authorInfo = document.querySelector('.author-info');
    authorInfo.style.opacity = '0';
    authorInfo.style.transform = 'translateY(20px)';
    setTimeout(() => {
        authorName.textContent = testimonial.author;
        authorRole.textContent = testimonial.role;
        authorInfo.style.opacity = '1';
        authorInfo.style.transform = 'translateY(0)';
    }, 400);

    const progressPercent = ((index + 1) / testimonialsData.length) * 100;
    progressBar.style.height = progressPercent + '%';

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

navNext.addEventListener('click', nextTestimonial);
navPrev.addEventListener('click', prevTestimonial);

let testimonialInterval = setInterval(nextTestimonial, 6000);

navNext.addEventListener('click', () => {
    clearInterval(testimonialInterval);
    testimonialInterval = setInterval(nextTestimonial, 6000);
});

navPrev.addEventListener('click', () => {
    clearInterval(testimonialInterval);
    testimonialInterval = setInterval(nextTestimonial, 6000);
});

updateTestimonial(0);