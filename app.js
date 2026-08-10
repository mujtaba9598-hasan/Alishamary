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
                startCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0 });

    counters.forEach(counter => {
        observer.observe(counter);
        // Fallback: forcefully start after 2 seconds if observer fails
        setTimeout(() => startCounter(counter), 2000);
    });

    function startCounter(counter) {
        if(counter.started) return;
        counter.started = true;
        const targetText = counter.getAttribute('data-target');
        const isDecimal = targetText.includes('.');
        const target = parseFloat(targetText);
        const noPlus = counter.getAttribute('data-no-plus') === 'true';
        
        const inc = target / 40; 
        let count = 0;
        
        const updateCount = () => {
            if (count < target) {
                count += inc;
                if (count > target) count = target;
                if (isDecimal) {
                    counter.innerText = count.toFixed(1);
                } else {
                    counter.innerText = Math.ceil(count).toLocaleString('en-IE');
                }
                setTimeout(updateCount, 40);
            } else {
                const suffix = noPlus ? '' : '+';
                if (isDecimal) {
                    counter.innerText = target.toFixed(1) + suffix;
                } else {
                    counter.innerText = target.toLocaleString('en-IE') + suffix;
                }
            }
        };
        updateCount();
    }
    // Replace everything except the h1 if we had one, actually container replaces the entire col-8 content
    // wait, col-8 had some other things? No, let's just make sure we only overwrite the items
    container.innerHTML = html;

    // Update summary
    if (summaryContainer) {
        const spans = summaryContainer.querySelectorAll('.summary-line span:last-child');
        if(spans.length >= 1) spans[0].innerText = '€' + subtotal.toFixed(2);
        
        let total = subtotal + 50.00; // 50 flat shipping
        const totalSpan = summaryContainer.querySelector('.total-line span:last-child');
        if (totalSpan) totalSpan.innerText = '€' + total.toFixed(2);
    }
}

window.updateQty = function(id, qty) {
    let cart = getCart();
    let item = cart.find(i => i.id === id);
    if (item) {
        item.qty = parseInt(qty);
        saveCart(cart);
        renderCartPage();
    }
}

window.removeFromCart = function(id) {
    let cart = getCart();
    cart = cart.filter(i => i.id !== id);
    saveCart(cart);
    renderCartPage();
}

