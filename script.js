// ==================== 3D CANVAS ANIMATION ====================
const canvas = document.getElementById('canvas3d');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Particle system for 3D effect
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 1000;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.vz = (Math.random() - 0.5) * 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;

        if (this.z > 1000 || this.z < 0) this.vz *= -1;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        const scale = 1000 / (1000 + this.z);
        const x2d = (this.x - canvas.width / 2) * scale + canvas.width / 2;
        const y2d = (this.y - canvas.height / 2) * scale + canvas.height / 2;
        const size = 3 * scale;
        const opacity = 1 - this.z / 1000;

        const gradient = ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, size);
        gradient.addColorStop(0, `rgba(102, 126, 234, ${opacity})`);
        gradient.addColorStop(0.5, `rgba(118, 75, 162, ${opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(102, 126, 234, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Create particles
const particles = [];
for (let i = 0; i < 50; i++) {
    particles.push(new Particle());
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animate);
}
animate();

// ==================== NAVIGATION ====================
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Active nav link on scroll
function setActiveLink() {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', setActiveLink);

// ==================== TYPING EFFECT ====================
const typingText = document.querySelector('.typing-text');
const texts = [
    'Professional Media Buyer',
    'AI Website Designer',
    'Digital Marketing Expert'
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentText = texts[textIndex];

    if (!isDeleting) {
        typingText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(typeEffect, 2000);
            return;
        }
    } else {
        typingText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }
    }

    const typingSpeed = isDeleting ? 50 : 100;
    setTimeout(typeEffect, typingSpeed);
}

// Start typing effect
typeEffect();

// ==================== SMOOTH SCROLL ====================
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

// ==================== SCROLL ANIMATIONS ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Add fade-in animation to elements
const animateElements = document.querySelectorAll('.service-card, .portfolio-item, .skill-item, .stat');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ==================== PARALLAX EFFECT & NAVBAR ====================
// Combined scroll listener for better performance
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;

    // Parallax effect (throttled)
    const parallaxElements = document.querySelectorAll('.floating-card');
    parallaxElements.forEach((el, index) => {
        const speed = 0.5 + (index * 0.1);
        el.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
    });

    // Navbar background
    const navbar = document.querySelector('.navbar');
    if (scrolled > 50) {
        navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 10, 15, 0.8)';
        navbar.style.boxShadow = 'none';
    }
}, { passive: true });

// ==================== MOUSE CURSOR EFFECT (Removed for performance) ====================
// Mouse particle interaction disabled to improve performance

// ==================== STATS COUNTER ANIMATION ====================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const counter = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + '+';
            clearInterval(counter);
        } else {
            element.textContent = Math.floor(start) + '+';
        }
    }, 16);
}

// Trigger counter animation when stats are visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach((stat, index) => {
                const target = index === 0 ? 100 : 50;
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsBox = document.querySelector('.stats-box');
if (statsBox) {
    statsObserver.observe(statsBox);
}

// ==================== 3D TILT EFFECT ON CARDS ====================
const cards = document.querySelectorAll('.service-card, .portfolio-item');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ==================== LOADING ANIMATION ====================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

console.log('%c👋 Hello! I\'m Abdelrahman Mohamed', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cMedia Buyer & AI Website Developer', 'color: #f5576c; font-size: 14px;');
console.log('%cContact: 01069245994', 'color: #43e97b; font-size: 14px;');

// ==================== LIGHTBOX ====================
const lightbox = document.getElementById('lightbox');
const lightboxImage = lightbox.querySelector('.lightbox-image');
const lightboxClose = lightbox.querySelector('.lightbox-close');
const resultCards = document.querySelectorAll('.result-card');

// Open lightbox on result card click
resultCards.forEach(card => {
    card.addEventListener('click', () => {
        const imageSrc = card.getAttribute('data-image');
        lightboxImage.src = imageSrc;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
});

// Close lightbox
function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

lightboxClose.addEventListener('click', closeLightbox);

// Close on background click
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
    }
});

// ==================== BACKGROUND MUSIC ====================
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
let isPlaying = false;

// Try to autoplay music when page loads
window.addEventListener('load', () => {
    // Attempt autoplay
    const playPromise = bgMusic.play();

    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                // Autoplay started
                isPlaying = true;
                musicToggle.classList.remove('paused');
                console.log('🎵 Background music playing');
            })
            .catch((error) => {
                // Autoplay was prevented - show paused state
                isPlaying = false;
                musicToggle.classList.add('paused');
                console.log('🔇 Click the music button to start');
            });
    }
});

// Also try to play on first user interaction
document.addEventListener('click', function initAudio() {
    if (!isPlaying) {
        bgMusic.play()
            .then(() => {
                isPlaying = true;
                musicToggle.classList.remove('paused');
            })
            .catch(() => {
                // User still needs to click the music button
            });
    }
    // Remove this listener after first click
    document.removeEventListener('click', initAudio);
}, { once: true });

// Music toggle button click
musicToggle.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent triggering the document click

    if (isPlaying) {
        bgMusic.pause();
        musicToggle.classList.add('paused');
        isPlaying = false;
    } else {
        bgMusic.play()
            .then(() => {
                musicToggle.classList.remove('paused');
                isPlaying = true;
            })
            .catch((error) => {
                console.error('Error playing music:', error);
            });
    }
});

// Update button state when music ends
bgMusic.addEventListener('ended', () => {
    musicToggle.classList.add('paused');
    isPlaying = false;
});

// Volume control (optional - set volume to 30% for background music)
bgMusic.volume = 0.3;
