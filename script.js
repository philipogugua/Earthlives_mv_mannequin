// ========================
// Preloader Functionality
// ========================

const preloader = document.getElementById('preloader');

// Hide preloader after 2.4 seconds (animation duration)
window.addEventListener('load', () => {
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('hidden');
        }
    }, 2400);
});

// Also hide preloader when DOM is ready (for cached pages)
document.addEventListener('DOMContentLoaded', () => {
    // Preloader will auto-hide after 2.4s due to CSS animation
});

// ========================
// Offline/Online Detection
// ========================

const offlineIndicator = document.getElementById('offline-indicator');

if (!navigator.onLine) {
    offlineIndicator.style.display = 'block';
}

window.addEventListener('offline', () => {
    offlineIndicator.style.display = 'block';
    console.log('Offline mode activated');
});

window.addEventListener('online', () => {
    offlineIndicator.style.display = 'none';
    console.log('Online mode - connection restored');
});

// ========================
// Theme Toggle Functionality
// ========================

const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;
const body = document.body;

// Check for saved theme preference in localStorage
const savedTheme = localStorage.getItem('theme');

// Initialize theme on page load
if (savedTheme) {
    setTheme(savedTheme);
} else {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
}

// Theme toggle button event listener
themeToggle.addEventListener('click', toggleTheme);

// Function to set theme
function setTheme(theme) {
    if (theme === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'light');
    }
}

// Function to toggle theme
function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

// ========================
// Carousel Functionality
// ========================

const carouselSlides = document.querySelectorAll('.carousel-slide');
const carouselDots = document.querySelectorAll('.dot');
const carouselPrevBtn = document.querySelector('.carousel-btn.prev');
const carouselNextBtn = document.querySelector('.carousel-btn.next');

let currentSlideIndex = 0;
let carouselAutoplayInterval;

// Carousel functions
function showSlide(index) {
    // Remove active class from all slides and dots
    carouselSlides.forEach(slide => slide.classList.remove('active'));
    carouselDots.forEach(dot => dot.classList.remove('active'));

    // Add active class to current slide and dot
    carouselSlides[index].classList.add('active');
    carouselDots[index].classList.add('active');
}

function nextSlide() {
    currentSlideIndex = (currentSlideIndex + 1) % carouselSlides.length;
    showSlide(currentSlideIndex);
    resetAutoplayTimer();
}

function prevSlide() {
    currentSlideIndex = (currentSlideIndex - 1 + carouselSlides.length) % carouselSlides.length;
    showSlide(currentSlideIndex);
    resetAutoplayTimer();
}

function goToSlide(index) {
    currentSlideIndex = index;
    showSlide(currentSlideIndex);
    resetAutoplayTimer();
}

function startAutoplay() {
    carouselAutoplayInterval = setInterval(nextSlide, 5000); // Auto-advance every 5 seconds
}

function stopAutoplay() {
    clearInterval(carouselAutoplayInterval);
}

function resetAutoplayTimer() {
    stopAutoplay();
    startAutoplay();
}

// Event listeners for carousel controls
carouselPrevBtn.addEventListener('click', prevSlide);
carouselNextBtn.addEventListener('click', nextSlide);

carouselDots.forEach((dot, index) => {
    dot.addEventListener('click', () => goToSlide(index));
});

// Pause autoplay on hover
const carouselContainer = document.querySelector('.carousel-wrapper');
carouselContainer.addEventListener('mouseenter', stopAutoplay);
carouselContainer.addEventListener('mouseleave', startAutoplay);

// Start carousel autoplay
startAutoplay();

// ========================
// Mobile Menu Toggle
// ========================

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Open/Close mobile menu (only on larger screens where hamburger is visible)
if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (hamburger) {
                hamburger.classList.remove('active');
            }
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (event) => {
    if (!event.target.closest('.navbar') && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (hamburger) {
            hamburger.classList.remove('active');
        }
    }
});

// ========================
// Smooth Scrolling for Navigation Links
// ========================

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const section = document.querySelector(href);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// ========================
// CTA Button Functionality
// ========================

const ctaButton = document.querySelector('.cta-button');
ctaButton.addEventListener('click', () => {
    const productsSection = document.getElementById('products');
    productsSection.scrollIntoView({ behavior: 'smooth' });
});

// ========================
// Product Details Modal Functionality
// ========================

const addButtons = document.querySelectorAll('.add-btn');
const modal = document.getElementById('product-modal');
const modalContent = modal.querySelector('.modal-content');
const closeModalBtn = modal.querySelector('.close-btn');
const modalImage1 = modal.querySelector('#modal-image-1');
const modalImage2 = modal.querySelector('#modal-image-2');
const modalTitle = modal.querySelector('.modal-title');
const modalDescription = modal.querySelector('.modal-description');
const modalExtraDetails = modal.querySelector('.modal-extra-details');
const modalPrice = modal.querySelector('.modal-price');

// Image mapping for products (with alternative images)
const productImages = {
    'female': {
        img1: './assets/images/banner7.png',
        img2: './assets/images/banner13.png'
    },
    'male': {
        img1: './assets/images/banner1.png',
        img2: './assets/images/banner14.png'
    },
    'kids': {
        img1: './assets/images/banner6.png',
        img2: './assets/images/banner15.png'
    },
    'hands': {
        img1: './assets/images/banner4.png',
        img2: './assets/images/banner12.png'
    },
    'feet': {
        img1: './assets/images/banner3.png',
        img2: './assets/images/banner11.png'
    },
    'head': {
        img1: './assets/images/banner8.png',
        img2: './assets/images/banner9.png'
    }
};

addButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Get product data from button attributes
        const model = button.getAttribute('data-model');
        const title = button.getAttribute('data-title');
        const description = button.getAttribute('data-description');
        const details = button.getAttribute('data-details');
        const price = button.getAttribute('data-price');

        // Populate modal content
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalExtraDetails.textContent = details;
        modalPrice.textContent = price;

        // Set product images (both columns)
        const images = productImages[model] || {
            img1: './assets/images/banner7.png',
            img2: './assets/images/banner7.png'
        };
        modalImage1.src = images.img1;
        modalImage1.alt = title;
        modalImage2.src = images.img2;
        modalImage2.alt = title;

        // Show modal
        modal.style.display = 'flex';
        setTimeout(() => { modal.classList.add('active'); }, 10);
    });
});

// Close modal on close button
closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    setTimeout(() => { modal.style.display = 'none'; }, 300);
});

// Close modal when clicking outside modal content
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        setTimeout(() => { modal.style.display = 'none'; }, 300);
    }
});


// ========================
// Scroll Animation for Elements
// ========================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInLeft 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe product cards and feature cards
document.querySelectorAll('.product-card, .feature-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ========================
// Active Navigation Link Highlighting
// ========================

const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${currentSection}`) {
            item.classList.add('active');
        }
    });
});

// ========================
// Page Load Animation
// ========================

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Set initial opacity
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';

// Simulate page load animation delay
setTimeout(() => {
    document.body.style.opacity = '1';
}, 100);

// ========================
// Product Model Viewers
// ========================

document.addEventListener('DOMContentLoaded', () => {
    // Check if Google Model Viewer is available
    const modelViewers = document.querySelectorAll('model-viewer');
    const productModelViewers = document.querySelectorAll('.product-model-viewer');

    // Function to handle model viewer fallback
    function handleModelViewerFallback() {
        if (!customElements.get('model-viewer')) {
            // Google Model Viewer not available, show fallbacks
            console.log('Model Viewer not available, showing fallbacks');
            productModelViewers.forEach(viewer => {
                const modelViewerElement = viewer.querySelector('model-viewer');
                const fallback = viewer.querySelector('.model-viewer-fallback');
                
                if (modelViewerElement && fallback) {
                    modelViewerElement.style.display = 'none';
                    fallback.classList.add('active');
                }
            });
        }
    }

    // Check after a short delay to ensure customElements are registered
    setTimeout(handleModelViewerFallback, 500);

    // Also try after window load
    window.addEventListener('load', handleModelViewerFallback);

    // Update model URLs if you have different models for each product
    // Example: to use different models, update the src attribute
    // productModelViewers.forEach(viewer => {
    //     const modelType = viewer.getAttribute('data-model');
    //     const modelViewer = viewer.querySelector('model-viewer');
    //     if (modelViewer) {
    //         // Set different model path based on product type
    //         // modelViewer.src = `./model/${modelType}.glb`;
    //     }
    // });
});

// ========================
// Back to Top Button Functionality
// ========================

const backToTopBtn = document.getElementById('backToTopBtn');

// Show/hide back to top button based on scroll position
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

// Scroll to top when button is clicked
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========================
// WhatsApp Button Functionality
// ========================

const whatsappBtn = document.getElementById('whatsappBtn');

// Add tooltip on hover
whatsappBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.15)';
});

whatsappBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
});

// Update WhatsApp link with your phone number
// Replace '1234567890' with your actual WhatsApp number (include country code)
// Example: +1 (555) 123-4567 becomes 15551234567
function updateWhatsAppLink() {
    const whatsappLink = whatsappBtn.querySelector('a');
    // Users can update this with their actual number
    // whatsappLink.href = 'https://wa.me/YOUR_PHONE_NUMBER?text=Hello%20EarthLives%20Mannequins!';
}

// ========================
// Progressive Web App (PWA)
// ========================

// Register service worker for offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('Service Worker registered successfully:', registration);
            })
            .catch((error) => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// Handle install prompt for PWA
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // You can optionally show your own install button here
    console.log('PWA is installable!');
});

// Handle successful PWA installation
window.addEventListener('appinstalled', () => {
    console.log('PWA installed successfully!');
    // You can track installation or hide your install button here
});

// ========================
// Utility Functions
// ========================

// Log app info on console
console.log('%cEarthLives Mannequins', 'color: #2ecc71; font-size: 24px; font-weight: bold;');
console.log('%cWelcome! Check out our landing page.', 'color: #27ae60; font-size: 14px;');
