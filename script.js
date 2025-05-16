document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const menuOverlay = document.querySelector('.menu-overlay');
    const navLinks = document.querySelectorAll('nav a');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            nav.classList.toggle('menu-open');
            document.body.classList.toggle('menu-is-open');
            
            // Prevent background scrolling when menu is open
            if (nav.classList.contains('menu-open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking outside
        menuOverlay.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            nav.classList.remove('menu-open');
            document.body.classList.remove('menu-is-open');
            document.body.style.overflow = '';
        });
        
        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                nav.classList.remove('menu-open');
                document.body.classList.remove('menu-is-open');
                document.body.style.overflow = '';
            });
        });
    }
    
    // Fix hero title display on mobile
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && window.innerWidth <= 768) {
        // Force repaint to fix potential rendering issues on mobile
        heroTitle.style.opacity = '0.99';
        
        // Add fallback class for devices that might not support gradient text
        heroTitle.classList.add('mobile-optimized');
        
        // Fix iOS Safari text rendering issues
        if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
            heroTitle.style.webkitTextFillColor = 'initial';
            heroTitle.style.color = 'var(--primary-color)';
        }
    }
    
    // Ensure author links are visible on mobile - apply additional classes if needed
    const authorLinks = document.querySelectorAll('.author');
    if (authorLinks.length > 0) {
        // Apply visibility class to ensure they're properly displayed
        authorLinks.forEach(author => {
            author.classList.add('visible');
            
            // Add touch feedback for mobile
            author.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            }, {passive: true});
            
            author.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            }, {passive: true});
        });
    }
    
    // Copy citation functionality
    const copyBtn = document.getElementById('copy-citation');
    const citationText = document.getElementById('citation-text');
    
    if (copyBtn && citationText) {
        copyBtn.addEventListener('click', function() {
            const textArea = document.createElement('textarea');
            textArea.value = citationText.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            // Visual feedback
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyBtn.classList.add('copied');
            
            setTimeout(function() {
                copyBtn.innerHTML = originalText;
                copyBtn.classList.remove('copied');
            }, 2000);
        });
    }
    
    // Scroll to top functionality with performance optimization
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Pre-apply animate class to avoid intersection observer overhead
    const animateElements = document.querySelectorAll('.content-box, .feature, .highlight-box, .member, .access-card');
    animateElements.forEach(element => {
        element.classList.add('animate');
    });
    
    // Performance optimized scroll handling
    const headerHeight = document.querySelector('header').offsetHeight;
    
    // Optimize scroll events with requestAnimationFrame and passive listener
    let ticking = false;
    let lastKnownScrollPosition = 0;
    
    function handleScroll() {
        lastKnownScrollPosition = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(() => {
                // Handle sticky navigation
                if (lastKnownScrollPosition > headerHeight) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
                
                // Handle active navigation state
                setActiveNav();
                
                ticking = false;
            });
            
            ticking = true;
        }
    }
    
    // Use passive event listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Optimize smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - nav.offsetHeight;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add active state to navigation - throttled for better performance
    function setActiveNav() {
        const sections = document.querySelectorAll('section');
        const navHeight = nav.offsetHeight;
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (lastKnownScrollPosition >= sectionTop && lastKnownScrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Initialize page immediately
    document.body.classList.add('loaded');
    
    // Check if we're on a mobile device to apply additional optimizations
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Remove unnecessary event listeners for mobile
        document.querySelectorAll('.feature, .highlight-box, .member, .access-card').forEach(el => {
            el.style.willChange = 'auto'; // Reset will-change to avoid memory consumption
        });
        
        // Add touch-specific handlers if needed
        document.addEventListener('touchstart', function() {
            // This empty handler enables mobile :active CSS states
        }, { passive: true });
    }
}); 