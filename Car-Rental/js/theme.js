const currentTheme = localStorage.getItem('theme') || 'light';

document.documentElement.setAttribute('data-theme', currentTheme);

const themeToggleButtons = document.querySelectorAll('.theme-toggle');

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    
    localStorage.setItem('theme', newTheme);
    
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
}

themeToggleButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        toggleTheme();
        
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

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        toggleTheme();
    }
});

const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

darkModeMediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
    }
});

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

window.toggleTheme = toggleTheme;