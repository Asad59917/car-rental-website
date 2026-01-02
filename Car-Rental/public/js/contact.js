// Contact Page JavaScript - UPDATED WITH API INTEGRATION

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
// FAQ ACCORDION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other items
            const wasActive = item.classList.contains('active');
            
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!wasActive) {
                item.classList.add('active');
            }
        });
    });
});

// ========================================
// FORM SUBMISSION HANDLER - UPDATED
// ========================================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());
    
    // Validate form
    if (!validateForm(data)) {
        return;
    }
    
    // Submit form to API
    await submitForm(data);
});

function validateForm(data) {
    // Basic validation
    if (!data.firstName || !data.lastName || !data.email || !data.subject || !data.message) {
        showNotification('Please fill in all required fields', 'error');
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    
    return true;
}

async function submitForm(data) {
    // Show loading state
    const submitBtn = contactForm.querySelector('.btn-submit');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        const result = await response.json();
        
        if (response.ok) {
            console.log('✅ Form submitted successfully:', result);
            
            // Reset form
            contactForm.reset();
            
            // Show success modal
            showSuccessModal();
            
            showNotification('Message sent successfully!', 'success');
        } else {
            console.error('❌ Form submission failed:', result);
            showNotification(result.error || 'An error occurred. Please try again.', 'error');
        }
    } catch (error) {
        console.error('❌ Network error:', error);
        showNotification('Network error. Please check your connection and try again.', 'error');
    } finally {
        // Reset button state
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
}

function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.toast-notification');
    existingNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `toast-notification toast-${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    notification.innerHTML = `
        <i class="fas ${icons[type] || icons.info}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal when clicking overlay
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('successModal');
    if (modal) {
        const overlay = modal.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', closeModal);
        }
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// ========================================
// INITIALIZATION
// ========================================
function init() {
    initMobileMenu();
    initializeTheme();
    checkUserAuthentication();
    
    // Sign in button
    const signinBtn = document.getElementById('signinBtn');
    if (signinBtn) {
        signinBtn.addEventListener('click', () => {
            window.location.href = '/signin';
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

console.log('✅ Contact page initialized with API integration');