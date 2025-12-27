// ========================================
// SMOOTH SCROLL NAVIGATION
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const navbarHeight = document.querySelector('.navbar').offsetHeight;
      const targetPosition = target.offsetTop - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ========================================
// NAVBAR SCROLL BEHAVIOR
// ========================================

let lastScroll = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll <= 0) {
    navbar.classList.remove('hidden');
    return;
  }

  if (currentScroll > lastScroll && currentScroll > 100) {
    // Scrolling down
    navbar.classList.add('hidden');
  } else {
    // Scrolling up
    navbar.classList.remove('hidden');
  }

  lastScroll = currentScroll;
});

// ========================================
// SCROLL ANIMATIONS
// ========================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(element => {
  observer.observe(element);
});

// ========================================
// PORTFOLIO FILTERING
// ========================================

const tabButtons = document.querySelectorAll('.tab-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all buttons
    tabButtons.forEach(btn => btn.classList.remove('active'));

    // Add active class to clicked button
    button.classList.add('active');

    // Get category to filter
    const category = button.getAttribute('data-category');

    // Filter portfolio items
    portfolioItems.forEach(item => {
      const itemCategory = item.getAttribute('data-category');

      if (category === 'all' || itemCategory === category) {
        item.classList.remove('hidden');
        // Re-trigger animation
        item.classList.remove('visible');
        setTimeout(() => {
          item.classList.add('visible');
        }, 10);
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// ========================================
// ACTIVE NAVIGATION LINK
// ========================================

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// ========================================
// STATS COUNTER ANIMATION
// ========================================

const stats = document.querySelectorAll('.stat-number');
let statsAnimated = false;

const animateStats = () => {
  stats.forEach(stat => {
    const target = stat.textContent;
    const number = parseInt(target.replace(/\D/g, ''));
    const suffix = target.replace(/[0-9]/g, '');
    const duration = 2000;
    const increment = number / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < number) {
        stat.textContent = Math.floor(current) + suffix;
        requestAnimationFrame(updateCounter);
      } else {
        stat.textContent = target;
      }
    };

    updateCounter();
  });
};

// Trigger stats animation when about section is visible
const aboutSection = document.querySelector('#about');
if (aboutSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        animateStats();
        statsAnimated = true;
      }
    });
  }, { threshold: 0.3 });

  statsObserver.observe(aboutSection);
}

// ========================================
// LAZY LOADING IMAGES
// ========================================

const images = document.querySelectorAll('img[src]');

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.classList.add('loaded');
      observer.unobserve(img);
    }
  });
});

images.forEach(img => {
  imageObserver.observe(img);
});

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

// Debounce function for scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for resize events
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ========================================
// PRELOAD CRITICAL ASSETS
// ========================================

window.addEventListener('load', () => {
  // Remove any loading states
  document.body.classList.add('loaded');
});

// ========================================
// CONSOLE EASTER EGG
// ========================================

console.log('%c👋 Hello!', 'font-size: 20px; font-weight: bold; color: #8b2bc6;');
console.log('%cWelcome to Abdelrahman Mohamed Portfolio', 'font-size: 14px; color: #32a89c;');
console.log('%cAre you a developer? Contact me! 🚀', 'font-size: 12px; color: #999;');

// ========================================
// LIGHTBOX FUNCTIONALITY
// ========================================

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.querySelector('.lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');

// Get all portfolio images
const portfolioImages = document.querySelectorAll('.portfolio-item .portfolio-image');

// Add click event to each portfolio image
portfolioImages.forEach(img => {
  img.addEventListener('click', function () {
    lightbox.classList.add('active');
    lightboxImg.src = this.src;
    lightboxCaption.textContent = this.alt;
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
  });
});

// Close lightbox when clicking the X button
lightboxClose.addEventListener('click', closeLightbox);

// Close lightbox when clicking outside the image
lightbox.addEventListener('click', function (e) {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

// Close lightbox with Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && lightbox.classList.contains('active')) {
    closeLightbox();
  }
});

// Function to close lightbox
function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = 'auto';
}
