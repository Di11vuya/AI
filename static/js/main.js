// Form handling and animations
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('prediction-form');
    const submitBtn = document.getElementById('submit-btn');
    const inputs = document.querySelectorAll('.input-group input');
    const resultCard = document.getElementById('result-card');

    // Input field animations
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });

        // Real-time validation
        input.addEventListener('input', function() {
            validateInput(this);
        });
    });

    function validateInput(input) {
        const value = parseFloat(input.value);
        const min = parseFloat(input.min);
        const max = parseFloat(input.max);
        
        if (input.value && (isNaN(value) || value < min || value > max)) {
            input.style.borderColor = 'var(--danger)';
            input.style.background = 'rgba(239, 68, 68, 0.05)';
        } else {
            input.style.borderColor = '';
            input.style.background = '';
        }
    }

    // Form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            // Show loading state
            submitBtn.classList.add('loading');
            
            // Animate inputs out slightly
            inputs.forEach((input, i) => {
                setTimeout(() => {
                    input.style.opacity = '0.7';
                }, i * 30);
            });
        });
    }

    // Animate result card if present
    if (resultCard) {
        animateResultCard();
        
        // Check if result is positive (Not Diabetic) and trigger confetti
        const resultText = resultCard.querySelector('h3');
        if (resultText && resultText.textContent.includes('Not Diabetic')) {
            setTimeout(() => {
                fireConfetti();
            }, 300);
        }
    }

    // Animate confidence meter
    const meterFill = document.querySelector('.meter-fill');
    if (meterFill) {
        const confidence = meterFill.dataset.confidence || '0';
        meterFill.style.width = '0%';
        setTimeout(() => {
            meterFill.style.width = confidence + '%';
        }, 100);
    }

    // Create floating particles
    createParticles();
});

function animateResultCard() {
    const card = document.getElementById('result-card');
    if (!card) return;
    
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px) scale(0.95)';
    
    requestAnimationFrame(() => {
        card.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) scale(1)';
    });
}

// Confetti effect
function fireConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const colors = ['#6366f1', '#06b6d4', '#10b981', '#f472b6', '#f59e0b', '#818cf8'];
    const particles = [];
    const particleCount = 150;
    
    class Particle {
        constructor() {
            this.x = canvas.width / 2;
            this.y = canvas.height / 2;
            this.vx = (Math.random() - 0.5) * 15;
            this.vy = (Math.random() - 1) * 15 - 5;
            this.gravity = 0.3;
            this.friction = 0.98;
            this.size = Math.random() * 8 + 4;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 10;
            this.life = 1;
            this.decay = Math.random() * 0.01 + 0.005;
        }
        
        update() {
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.rotation += this.rotationSpeed;
            this.life -= this.decay;
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;
            
            // Draw square confetti
            ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
            
            ctx.restore();
        }
    }
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            
            if (particles[i].life <= 0) {
                particles.splice(i, 1);
            }
        }
        
        if (particles.length > 0) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    
    animate();
}

// Floating particles background
function createParticles() {
    const container = document.querySelector('.bg-animation');
    if (!container) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.background = ['rgba(99, 102, 241, 0.3)', 'rgba(6, 182, 212, 0.3)', 'rgba(244, 114, 182, 0.2)'][Math.floor(Math.random() * 3)];
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        
        container.appendChild(particle);
    }
}

// Smooth scroll to result
function scrollToResult() {
    const resultCard = document.getElementById('result-card');
    if (resultCard) {
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Handle window resize for confetti canvas
window.addEventListener('resize', function() {
    const canvas = document.getElementById('confetti-canvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});
