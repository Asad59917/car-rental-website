const loginToggle = document.getElementById('loginToggle');
const signupToggle = document.getElementById('signupToggle');
const toggleSlider = document.getElementById('toggleSlider');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

const loginFormSubmit = document.getElementById('loginFormSubmit');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');
const toggleLoginPassword = document.getElementById('toggleLoginPassword');

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

const googleLoginBtn = document.getElementById('googleLoginBtn');
const googleSignupBtn = document.getElementById('googleSignupBtn');

const GOOGLE_CLIENT_ID = '135800377028-s25a01piss36ae0bibjhnmadmai78r2t.apps.googleusercontent.com';

loginToggle.addEventListener('click', () => {
    loginToggle.classList.add('active');
    signupToggle.classList.remove('active');
    toggleSlider.classList.remove('signup');
    
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
    
    loginError.textContent = '';
    signupError.textContent = '';
});

signupToggle.addEventListener('click', () => {
    signupToggle.classList.add('active');
    loginToggle.classList.remove('active');
    toggleSlider.classList.add('signup');
    
    signupForm.classList.add('active');
    loginForm.classList.remove('active');
    
    loginError.textContent = '';
    signupError.textContent = '';
});

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

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

loginFormSubmit.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = loginEmail.value.trim();
    const password = loginPassword.value;
    
    if (!validateEmail(email)) {
        showError(loginError, 'Please enter a valid email address');
        return;
    }
    
    if (!validatePassword(password)) {
        showError(loginError, 'Password must be at least 6 characters');
        return;
    }
    
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
            setButtonSuccess(loginBtn);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        } else {
            setButtonLoading(loginBtn, false);
            showError(loginError, data.error || 'Login failed. Please try again.');
        }
    } catch (error) {
        setButtonLoading(loginBtn, false);
        showError(loginError, 'Network error. Please check your connection.');
        console.error('Login error:', error);
    }
});

signupFormSubmit.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = signupName.value.trim();
    const email = signupEmail.value.trim();
    const password = signupPassword.value;
    const confirmPass = confirmPassword.value;
    
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
            setButtonSuccess(signupBtn);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        } else {
            setButtonLoading(signupBtn, false);
            showError(signupError, data.error || 'Registration failed. Please try again.');
        }
    } catch (error) {
        setButtonLoading(signupBtn, false);
        showError(signupError, 'Network error. Please check your connection.');
        console.error('Signup error:', error);
    }
});

function initializeGoogleSignIn() {
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCallback,
            auto_select: false,
            cancel_on_tap_outside: true,
            ux_mode: 'popup'
        });
        
        console.log('✅ Google Sign-In initialized successfully');
    } else {
        console.warn('⚠️ Google Sign-In library not loaded yet, retrying...');
        setTimeout(initializeGoogleSignIn, 500);
    }
}

async function handleGoogleCallback(response) {
    console.log('Google callback received');
    
    try {
        const credential = response.credential;
        
        const res = await fetch('/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ credential })
        });
        
        const data = await res.json();
        
        if (res.ok) {
            console.log('✅ Google authentication successful');
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = '/';
        } else {
            console.error('❌ Google authentication failed:', data.error);
            showError(loginError, data.error || 'Google Sign-In failed');
            showError(signupError, data.error || 'Google Sign-In failed');
        }
    } catch (error) {
        console.error('❌ Google Sign-In error:', error);
        showError(loginError, 'Failed to authenticate with Google');
        showError(signupError, 'Failed to authenticate with Google');
    }
}

googleLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Google Login button clicked');
    
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
        try {
            google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed()) {
                    console.warn('Google prompt not displayed, trying alternative method');
                    showGoogleOneTap();
                } else if (notification.isSkippedMoment()) {
                    console.log('Google prompt skipped by user');
                }
            });
        } catch (error) {
            console.error('Error showing Google prompt:', error);
            showError(loginError, 'Unable to load Google Sign-In. Please try again.');
        }
    } else {
        console.error('Google Sign-In library not available');
        showError(loginError, 'Google Sign-In is not available. Please refresh the page.');
    }
});

googleSignupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Google Signup button clicked');
    
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
        try {
            google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed()) {
                    console.warn('Google prompt not displayed, trying alternative method');
                    showGoogleOneTap();
                } else if (notification.isSkippedMoment()) {
                    console.log('Google prompt skipped by user');
                }
            });
        } catch (error) {
            console.error('Error showing Google prompt:', error);
            showError(signupError, 'Unable to load Google Sign-In. Please try again.');
        }
    } else {
        console.error('Google Sign-In library not available');
        showError(signupError, 'Google Sign-In is not available. Please refresh the page.');
    }
});

function showGoogleOneTap() {
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
        google.accounts.id.prompt();
    }
}

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

const rememberMe = document.getElementById('rememberMe');

window.addEventListener('load', () => {
    console.log('Page loaded, initializing...');
    
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
        loginEmail.value = savedEmail;
        rememberMe.checked = true;
    }
    
    setTimeout(() => {
        initializeGoogleSignIn();
    }, 100);
});

loginFormSubmit.addEventListener('submit', () => {
    if (rememberMe.checked) {
        localStorage.setItem('rememberedEmail', loginEmail.value);
    } else {
        localStorage.removeItem('rememberedEmail');
    }
});

document.querySelector('.forgot-password')?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Password reset functionality would be implemented here.\n\nTypically this would:\n1. Send a reset link to the user\'s email\n2. Allow them to create a new password');
});

document.querySelector('.back-button')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/';
});

document.querySelector('.terms-checkbox a')?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Terms & Conditions page would open here');
});

window.bookCar = function(carId) {
    const user = localStorage.getItem('user');
    if (!user) {
        alert('Please sign in to book a car');
        window.location.href = '/signin';
        return;
    }
    
    localStorage.setItem('selectedCar', carId);
    window.location.href = '/booking.html';
};