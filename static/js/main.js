// ============================================
// THEME TOGGLE
// ============================================
const initThemeToggle = () => {
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    if (!themeToggle) return;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        htmlElement.classList.add('theme-transitioning');
        setTimeout(() => {
            htmlElement.classList.remove('theme-transitioning');
        }, 300);
    });

    themeToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            themeToggle.click();
        }
    });
};

// ============================================
// CUSTOM CURSOR
// ============================================
const initCursor = () => {
    const cursorDot = document.querySelector('[data-cursor-dot]');
    if (!cursorDot) return;

    document.addEventListener('mousemove', (e) => {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
    });

    const hoverElements = document.querySelectorAll(
        'a, button, .project-card, .skill-card, .nav-link'
    );

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(2)';
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
};

// ============================================
// ANIMATED STATS COUNTER
// ============================================
const animateStats = () => {
    const stats = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target, parseInt(entry.target.dataset.count));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
};

const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 50;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 40);
};

// ============================================
// SCROLL ANIMATIONS
// ============================================
const initScrollAnimations = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.skill-card, .project-card').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s ease ${i * 0.1}s`;
        observer.observe(el);
    });
};

// ============================================
// PROJECT FILTER
// ============================================
const initProjectFilter = () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            projectCards.forEach(card => {
                const category = card.dataset.category;
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });
};

// ============================================
// CONTACT FORM (REAL SMTP SUBMIT)
// ============================================
const initContactForm = () => {
    const form = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.btn-submit');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        const btnIcon = submitBtn.querySelector('.btn-icon');

        btnText.style.display = 'none';
        btnIcon.style.display = 'none';
        btnLoading.style.display = 'block';
        submitBtn.disabled = true;

        const payload = {
            name: form.name.value,
            email: form.email.value,
            subject: form.subject.value,
            budget: form.budget.value,
            message: form.message.value
        };

        try {
            const res = await fetch('/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                form.style.display = 'none';
                formSuccess.classList.add('active');
            } else {
                alert('Failed to send message.');
            }
        } catch (err) {
            alert('Network error. Please try again.');
        }

        btnText.style.display = 'inline';
        btnIcon.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
    });
};

window.resetForm = () => {
    const form = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    form.reset();
    form.style.display = 'block';
    formSuccess.classList.remove('active');
};

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
const initNavbarScroll = () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        navbar.style.boxShadow =
            currentScroll > 50 ? '0 4px 20px rgba(0,0,0,0.3)' : 'none';

        navbar.style.transform =
            currentScroll > lastScroll && currentScroll > 200
                ? 'translateY(-100%)'
                : 'translateY(0)';

        lastScroll = currentScroll;
    });
};

// ============================================
// PARALLAX EFFECT
// ============================================
const initParallax = () => {
    const cards = document.querySelectorAll('.floating-card');
    if (!cards.length) return;

    window.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        cards.forEach((card, i) => {
            const speed = (i + 1) * 10;
            card.style.transform =
                `translate(${(x - 0.5) * speed}px, ${(y - 0.5) * speed}px)`;
        });
    });
};

// ============================================
// INIT ALL
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    if (window.innerWidth > 768) initCursor();

    initNavbarScroll();
    initScrollAnimations();
    initProjectFilter();
    initContactForm();
    animateStats();
    initParallax();

    console.log('🎨 Portfolio loaded successfully!');
});

// ============================================
// PAGE FADE-IN
// ============================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ============================================
// PERFORMANCE TWEAK
// ============================================
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    document.documentElement.style.setProperty('--transition-base', '0.15s');
    document.documentElement.style.setProperty('--transition-slow', '0.3s');
}
