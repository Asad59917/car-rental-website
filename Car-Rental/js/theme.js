/**
 * THEME MODULE
 * Handles dark/light theme switching with localStorage persistence
 */

// ========================================
// THEME INITIALIZATION
// ========================================

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';

// Apply theme on page load
document.documentElement.setAttribute('data-theme', currentTheme);

// ========================================
// DOM ELEMENTS
// ========================================
const themeToggleButtons = document.querySelectorAll('.theme-toggle');

// ========================================
// THEME TOGGLE FUNCTION
// ========================================
function toggleTheme() {
    // Get current theme
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    // Determine new theme
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Apply new theme
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Save preference to localStorage
    localStorage.setItem('theme', newTheme);
    
    // Add animation class to body
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    // Log theme change (optional)
    console.log(`Theme switched to: ${newTheme}`);
}

// ========================================
// EVENT LISTENERS
// ========================================

// Add click event to all theme toggle buttons
themeToggleButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        toggleTheme();
        
        // Add ripple effect animation
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'var(--accent-primary)';
        ripple.style.width = '100%';
        ripple.style.height = '100%';
        ripple.style.top = '0';
        ripple.style.left = '0';
        ripple.style.opacity = '0.3';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// ========================================
// KEYBOARD SHORTCUT
// ========================================

// Optional: Toggle theme with Ctrl/Cmd + Shift + D
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        toggleTheme();
    }
});

// ========================================
// SYSTEM THEME DETECTION (OPTIONAL)
// ========================================

// Listen for system theme changes
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

darkModeMediaQuery.addEventListener('change', (e) => {
    // Only auto-switch if user hasn't set a preference
    if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
    }
});

// ========================================
// RIPPLE ANIMATION
// ========================================

// Add CSS animation for ripple effect
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========================================
// EXPORT FUNCTIONS (if needed)
// ========================================

// Make toggleTheme available globally if needed
window.toggleTheme = toggleTheme;

console.log('🎨 Theme system initialized. Current theme:', currentTheme);
console.log('💡 Tip: Press Ctrl/Cmd + Shift + D to toggle theme');