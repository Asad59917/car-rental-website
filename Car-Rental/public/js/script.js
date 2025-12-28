// ========== DOM ELEMENTS ==========
const loginToggle = document.getElementById('loginToggle');
const signupToggle = document.getElementById('signupToggle');
const toggleSlider = document.getElementById('toggleSlider');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// Login form elements
const loginFormSubmit = document.getElementById('loginFormSubmit');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');
const toggleLoginPassword = document.getElementById('toggleLoginPassword');

// Signup form elements
const signupFormSubmit = document.getElementById('signupFormSubmit');
const signupName = document.getElementById('signupName');
const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');
const confirmPassword = document.getElementById('confirmPassword');
const agreeTerms = document.getElementById('agreeTerms');
const signupBtn = document.getElementById('signupBtn');
const signupError = document.getElementById('signupError');
const toggleSignupPassword = document.getElementById('toggleSignupPassword');
const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');

// Google buttons
const googleLoginBtn = document.getElementById('googleLoginBtn');
const googleSignupBtn = document.getElementById('googleSignupBtn');

// ========== TOGGLE BETWEEN LOGIN AND SIGNUP ==========
loginToggle.addEventListener('click', () => {
    loginToggle.classList.add('active');
    signupToggle.classList.remove('active');
    toggleSlider.classList.remove('signup');
    
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
    
    // Clear error messages
    loginError.textContent = '';
    signupError.textContent = '';
});

signupToggle.addEventListener('click', () => {
    signupToggle.classList.add('active');
    loginToggle.classList.remove('active');
    toggleSlider.classList.add('signup');
    
    signupForm.classList.add('active');
    loginForm.classList.remove('active');
    
    // Clear error messages
    loginError.textContent = '';
    signupError.textContent = '';
});

// ========== PASSWORD VISIBILITY TOGGLE ==========
toggleLoginPassword.addEventListener('click', () => {
    togglePasswordVisibility(loginPassword, toggleLoginPassword);
});

toggleSignupPassword.addEventListener('click', () => {
    togglePasswordVisibility(signupPassword, toggleSignupPassword);
});

toggleConfirmPassword.addEventListener('click', () => {
    togglePasswordVisibility(confirmPassword, toggleConfirmPassword);
});

function togglePasswordVisibility(input, icon) {
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// ========== FORM VALIDATION ==========
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// ========== LOGIN FORM SUBMISSION ==========
loginFormSubmit.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = loginEmail.value.trim();
    const password = loginPassword.value;
    
    // Validation
    if (!validateEmail(email)) {
        showError(loginError, 'Please enter a valid email address');
        return;
    }
    
    if (!validatePassword(password)) {
        showError(loginError, 'Password must be at least 6 characters');
        return;
    }
    
    // Show loading state
    setButtonLoading(loginBtn, true);
    loginError.textContent = '';
    
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Success
            setButtonSuccess(loginBtn);
            
            // Store user data (you can use localStorage or sessionStorage)
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redirect after 1.5 seconds to home page
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        } else {
            // Error
            setButtonLoading(loginBtn, false);
            showError(loginError, data.error || 'Login failed. Please try again.');
        }
    } catch (error) {
        setButtonLoading(loginBtn, false);
        showError(loginError, 'Network error. Please check your connection.');
        console.error('Login error:', error);
    }
});

// ========== SIGNUP FORM SUBMISSION ==========
signupFormSubmit.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = signupName.value.trim();
    const email = signupEmail.value.trim();
    const password = signupPassword.value;
    const confirmPass = confirmPassword.value;
    
    // Validation
    if (name.length < 2) {
        showError(signupError, 'Name must be at least 2 characters');
        return;
    }
    
    if (!validateEmail(email)) {
        showError(signupError, 'Please enter a valid email address');
        return;
    }
    
    if (!validatePassword(password)) {
        showError(signupError, 'Password must be at least 6 characters');
        return;
    }
    
    if (password !== confirmPass) {
        showError(signupError, 'Passwords do not match');
        return;
    }
    
    if (!agreeTerms.checked) {
        showError(signupError, 'Please agree to the Terms & Conditions');
        return;
    }
    
    // Show loading state
    setButtonLoading(signupBtn, true);
    signupError.textContent = '';
    
    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Success
            setButtonSuccess(signupBtn);
            
            // Store user data
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redirect after 1.5 seconds to home page
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        } else {
            // Error
            setButtonLoading(signupBtn, false);
            showError(signupError, data.error || 'Registration failed. Please try again.');
        }
    } catch (error) {
        setButtonLoading(signupBtn, false);
        showError(signupError, 'Network error. Please check your connection.');
        console.error('Signup error:', error);
    }
});

// ========== GOOGLE SIGN-IN ==========
googleLoginBtn.addEventListener('click', () => {
    handleGoogleSignIn('login');
});

googleSignupBtn.addEventListener('click', () => {
    handleGoogleSignIn('signup');
});

function handleGoogleSignIn(type) {
    // This is a placeholder for Google Sign-In functionality
    // You would need to implement Google OAuth 2.0
    alert(`Google ${type === 'login' ? 'Sign In' : 'Sign Up'} - This feature requires Google OAuth 2.0 integration.\n\nTo implement:\n1. Create a Google Cloud Project\n2. Enable Google+ API\n3. Create OAuth 2.0 credentials\n4. Add the Google Sign-In library\n5. Implement the authentication flow`);
    
    // Example implementation would look like:
    // google.accounts.id.initialize({
    //     client_id: 'YOUR_GOOGLE_CLIENT_ID',
    //     callback: handleGoogleCallback
    // });
}

// ========== HELPER FUNCTIONS ==========
function showError(element, message) {
    element.textContent = message;
    element.style.animation = 'shake 0.5s';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

function setButtonSuccess(button) {
    button.classList.remove('loading');
    button.classList.add('success');
    
    const span = button.querySelector('span');
    const icon = button.querySelector('i');
    
    if (span) span.textContent = 'Success!';
    if (icon) icon.style.display = 'none';
}

// ========== INPUT VALIDATION FEEDBACK ==========
// Real-time validation feedback for email
loginEmail.addEventListener('blur', function() {
    if (this.value && !validateEmail(this.value)) {
        this.style.borderColor = 'var(--danger-color)';
    } else {
        this.style.borderColor = '';
    }
});

signupEmail.addEventListener('blur', function() {
    if (this.value && !validateEmail(this.value)) {
        this.style.borderColor = 'var(--danger-color)';
    } else {
        this.style.borderColor = '';
    }
});

// Real-time validation for password match
confirmPassword.addEventListener('input', function() {
    if (this.value && signupPassword.value !== this.value) {
        this.style.borderColor = 'var(--danger-color)';
    } else if (this.value && signupPassword.value === this.value) {
        this.style.borderColor = 'var(--success-color)';
    } else {
        this.style.borderColor = '';
    }
});

signupPassword.addEventListener('input', function() {
    if (confirmPassword.value) {
        if (this.value !== confirmPassword.value) {
            confirmPassword.style.borderColor = 'var(--danger-color)';
        } else {
            confirmPassword.style.borderColor = 'var(--success-color)';
        }
    }
});

// ========== REMEMBER ME FUNCTIONALITY ==========
const rememberMe = document.getElementById('rememberMe');

// Check if there's saved email
window.addEventListener('load', () => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
        loginEmail.value = savedEmail;
        rememberMe.checked = true;
    }
});

// Save email when logging in
loginFormSubmit.addEventListener('submit', () => {
    if (rememberMe.checked) {
        localStorage.setItem('rememberedEmail', loginEmail.value);
    } else {
        localStorage.removeItem('rememberedEmail');
    }
});

// ========== PREVENT DEFAULT LINK BEHAVIOR ==========
document.querySelector('.forgot-password')?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Password reset functionality would be implemented here.\n\nTypically this would:\n1. Send a reset link to the user\'s email\n2. Allow them to create a new password');
});

document.querySelector('.back-button')?.addEventListener('click', (e) => {
    e.preventDefault();
    // Redirect to home page
    window.location.href = '/';
});

document.querySelector('.terms-checkbox a')?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Terms & Conditions page would open here');
});

console.log('Authentication system initialized successfully!');

// Force override the bookCar function
window.bookCar = function(carId) {
    console.log('🚗 bookCar called with car ID:', carId);
    
    const user = localStorage.getItem('user');
    if (!user) {
        alert('Please sign in to book a car');
        window.location.href = '/signin';
        return;
    }
    
    localStorage.setItem('selectedCar', carId);
    window.location.href = '/booking.html';
};

console.log('✅ bookCar function overridden!');