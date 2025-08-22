// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Navbar scroll behavior
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled', 'shadow-sm');
            } else {
                navbar.classList.remove('navbar-scrolled', 'shadow-sm');
            }
        });
    }

    // Product search functionality
    const searchInput = document.getElementById('productSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const products = document.querySelectorAll('.product-card');
            
            products.forEach(product => {
                const title = product.querySelector('.card-title').textContent.toLowerCase();
                const description = product.querySelector('.card-text').textContent.toLowerCase();
                const category = product.dataset.category.toLowerCase();
                
                if (title.includes(searchTerm) || 
                    description.includes(searchTerm) || 
                    category.includes(searchTerm)) {
                    product.style.display = '';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    }

    // Product filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            const products = document.querySelectorAll('.product-card');
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            products.forEach(product => {
                if (category === 'all' || product.dataset.category === category) {
                    product.style.display = '';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    });

    // Smooth scrolling for anchor links
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

    // Form validation
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Using Formspree for form submission
            const formData = new FormData(this);
            try {
                const response = await fetch('https://formspree.io/f/your-form-id', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    showAlert('success', 'Thank you for your message. We will get back to you soon!');
                    this.reset();
                    form.classList.remove('was-validated');
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                showAlert('danger', 'Oops! There was a problem submitting your form. Please try again later.');
                console.error('Form submission error:', error);
            }
        });
    }

    // Inquiry form handling
    const inquiryForm = document.getElementById('inquiryForm');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            try {
                const response = await fetch('https://formspree.io/f/your-form-id', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    showAlert('success', 'Thank you for your inquiry. We will get back to you with a quote soon!');
                    this.reset();
                    form.classList.remove('was-validated');
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                showAlert('danger', 'Oops! There was a problem submitting your inquiry. Please try again later.');
                console.error('Inquiry form submission error:', error);
            }
        });
    }

    // Alert helper function
    function showAlert(type, message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.role = 'alert';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        const container = document.querySelector('.alert-container');
        if (container) {
            container.appendChild(alertDiv);
            setTimeout(() => {
                alertDiv.remove();
            }, 5000);
        }
    }

    // Image lazy loading
    const images = document.querySelectorAll('img[data-src]');
    const imageOptions = {
        threshold: 0,
        rootMargin: '0px 0px 50px 0px'
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('fade-in');
                observer.unobserve(img);
            }
        });
    }, imageOptions);

    images.forEach(img => imageObserver.observe(img));

    // WhatsApp button visibility
    const whatsappButton = document.querySelector('.whatsapp-float');
    if (whatsappButton) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                whatsappButton.style.display = 'flex';
            } else {
                whatsappButton.style.display = 'none';
            }
        });
    }

    // Product quantity increment/decrement
    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        const decrementBtn = input.parentElement.querySelector('.decrement');
        const incrementBtn = input.parentElement.querySelector('.increment');

        decrementBtn?.addEventListener('click', () => {
            const currentValue = parseInt(input.value);
            if (currentValue > 1) {
                input.value = currentValue - 1;
                updateProductTotal(input);
            }
        });

        incrementBtn?.addEventListener('click', () => {
            const currentValue = parseInt(input.value);
            input.value = currentValue + 1;
            updateProductTotal(input);
        });

        input.addEventListener('change', () => {
            if (parseInt(input.value) < 1) {
                input.value = 1;
            }
            updateProductTotal(input);
        });
    });

    // Update product total price
    function updateProductTotal(input) {
        const productCard = input.closest('.product-card');
        if (!productCard) return;

        const priceElement = productCard.querySelector('.product-price');
        const totalElement = productCard.querySelector('.product-total');
        
        if (priceElement && totalElement) {
            const price = parseFloat(priceElement.dataset.price);
            const quantity = parseInt(input.value);
            const total = price * quantity;
            totalElement.textContent = `₹${total.toFixed(2)}`;
        }
    }
}); 