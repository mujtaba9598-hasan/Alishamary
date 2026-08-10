// Modal / Promo Popup logic
document.addEventListener('DOMContentLoaded', () => {
    
    // Check local storage for first visit
    const hasVisited = localStorage.getItem('amf_visited');
    const modal = document.getElementById('promo-popup');
    const closeBtn = document.getElementById('close-promo');

    if (!hasVisited && modal) {
        // Show after 3 seconds on first visit
        setTimeout(() => {
            modal.classList.add('active');
        }, 3000);
        
        // Mark as visited
        localStorage.setItem('amf_visited', 'true');
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Basic GSAP Animations (React Bits style reveal)
    if (typeof gsap !== 'undefined') {
        gsap.from('.nav-links a', {
            y: -20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out'
        });
        
        gsap.from('.logo', {
            opacity: 0,
            duration: 1,
            delay: 0.2
        });
    }

    // Counter Animation Logic
    const counters = document.querySelectorAll('.counter');
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const targetText = counter.getAttribute('data-target');
                const isDecimal = targetText.includes('.');
                const target = parseFloat(targetText);
                const noPlus = counter.getAttribute('data-no-plus') === 'true';
                
                // Calculate an increment that will finish in a reasonable time
                const inc = target / 40; 
                let count = 0;
                
                const updateCount = () => {
                    if (count < target) {
                        count += inc;
                        if (count > target) count = target;
                        
                        // Format the number (commas for thousands, or decimals if needed)
                        if (isDecimal) {
                            counter.innerText = count.toFixed(1);
                        } else {
                            counter.innerText = Math.ceil(count).toLocaleString('en-IE');
                        }
                        
                        setTimeout(updateCount, 40);
                    } else {
                        // Ensure it ends perfectly on the target and adds the plus
                        const suffix = noPlus ? '' : '+';
                        if (isDecimal) {
                            counter.innerText = target.toFixed(1) + suffix;
                        } else {
                            counter.innerText = target.toLocaleString('en-IE') + suffix;
                        }
                    }
                };
                
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.2 }); // Reduced threshold so it triggers earlier on mobile

    counters.forEach(counter => {
        observer.observe(counter);
    });
});
