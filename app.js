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

// --- AMF CART & BACKEND MOCK (localStorage) ---
const AMF_CART_KEY = 'amf_cart';
const AMF_ORDERS_KEY = 'amf_orders';

function getCart() {
    return JSON.parse(localStorage.getItem(AMF_CART_KEY) || '[]');
}

function saveCart(cart) {
    localStorage.setItem(AMF_CART_KEY, JSON.stringify(cart));
}

function addToCart(id, name, price, img) {
    let cart = getCart();
    let existing = cart.find(i => i.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id, name, price, img, qty: 1 });
    }
    saveCart(cart);
    alert(name + " added to cart! Proceed to checkout via the top menu.");
}

// Attach to Shop Buttons
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.shop-page')) {
        const products = document.querySelectorAll('.product-card');
        products.forEach((card, index) => {
            const btn = card.querySelector('.btn-primary');
            if (btn && btn.innerText.includes('ADD TO CART')) {
                // clone button to remove old listeners
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                
                newBtn.onclick = () => {
                    const name = card.querySelector('h3').innerText;
                    const priceText = card.querySelector('.price').innerText.replace('€', '').trim();
                    const price = parseFloat(priceText);
                    const img = card.querySelector('img').src;
                    addToCart('prod_'+index, name, price, img);
                };
            }
        });
    }

    // Render Cart Page
    if (document.querySelector('.cart-page')) {
        renderCartPage();
    }

    // Checkout Logic
    if (document.querySelector('.checkout-page') || window.location.pathname.includes('checkout')) {
        const form = document.querySelector('form');
        const cart = getCart();
        let subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        let total = subtotal > 0 ? subtotal + 50 : 0; // assuming 50 flat shipping
        
        const payBtn = document.querySelector('button[type="submit"]') || document.querySelector('.btn-primary');
        if (payBtn) payBtn.innerText = 'Pay €' + total.toFixed(2) + ' securely';

        if (form) {
            form.onsubmit = (e) => {
                e.preventDefault();
                if (cart.length === 0) {
                    alert("Cart is empty!");
                    return;
                }
                const order = {
                    id: 'ORD-' + Math.floor(Math.random() * 10000),
                    date: new Date().toLocaleString(),
                    total: total,
                    items: cart.length,
                    status: 'Pending',
                    customer: form.querySelector('input[type="text"]')?.value || 'Guest'
                };
                
                let orders = JSON.parse(localStorage.getItem(AMF_ORDERS_KEY) || '[]');
                orders.unshift(order);
                localStorage.setItem(AMF_ORDERS_KEY, JSON.stringify(orders));
                
                localStorage.removeItem(AMF_CART_KEY); // clear cart
                alert("Payment successful! Order " + order.id + " placed.");
                window.location.href = "index.html";
            };
        }
    }

    // Admin Dashboard Live Data
    if (document.querySelector('.sidebar')) {
        const orders = JSON.parse(localStorage.getItem(AMF_ORDERS_KEY) || '[]');
        
        // Dashboard Metrics
        const kpiNumbers = document.querySelectorAll('#dashboard .number');
        if (kpiNumbers.length >= 2) {
            let totalSales = orders.reduce((sum, o) => sum + o.total, 0);
            kpiNumbers[0].innerText = '€' + totalSales.toLocaleString('en-IE', {minimumFractionDigits: 2});
            kpiNumbers[1].innerText = orders.filter(o => o.status === 'Pending').length;
        }

        // Recent Activity Table
        const activityTable = document.querySelector('#dashboard table');
        if (activityTable && orders.length > 0) {
            let html = '<tr><th>Action</th><th>Details</th><th>Time</th></tr>';
            orders.slice(0, 5).forEach(o => {
                html += <tr><td><span class="status active">New Order</span></td><td> - €</td><td>Just now</td></tr>;
            });
            // append existing mockup rows
            html += <tr><td><span class="status pending">Waitlist</span></td><td>Sarah joined waitlist for Parlour Pot</td><td>2 hrs ago</td></tr>;
            activityTable.innerHTML = html;
        }
        
        // Orders Table (if we add it later, for now just dashboard overview is populated)
    }
});

function renderCartPage() {
    const cart = getCart();
    const container = document.querySelector('.cart-page .col-8');
    const summaryContainer = document.querySelector('.cart-page .order-summary');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<h3>Your Cart is Empty</h3><br><a href="shop.html" class="btn btn-primary">Go Shopping</a>';
        if (summaryContainer) {
            const spans = summaryContainer.querySelectorAll('.summary-line span:last-child');
            if (spans.length >= 3) {
                spans[0].innerText = '€0.00';
                spans[1].innerText = '€0.00';
            }
            const totalSpan = summaryContainer.querySelector('.total-line span:last-child');
            if (totalSpan) totalSpan.innerText = '€0.00';
        }
        return;
    }

    let html = '';
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.qty;
        html += 
        <div class="cart-item" style="display:flex; align-items:center; gap:20px; border-bottom:1px solid #ddd; padding:15px 0;">
            <img src="\" alt="\" width="100" style="border-radius:4px;">
            <div style="flex:1;">
                <h4>\</h4>
                <p>€\</p>
            </div>
            <input type="number" value="\" min="1" onchange="updateQty('\', this.value)" style="width:60px; padding:5px; border:1px solid #ccc;">
            <a href="#" class="remove" onclick="removeFromCart('\'); return false;" style="color:var(--clr-primary); font-weight:bold;">Remove</a>
        </div>
        ;
    });
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
