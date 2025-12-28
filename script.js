// Sample jewelry products data
const products = [
    {
        id: 1,
        name: "Traditional Mangalsutra",
        price: 24999.99,
        category: "necklaces",
        description: "Sacred mangalsutra with black beads and gold pendant, symbolizing marital bliss and prosperity.",
        image: "asset/20250925_080542.jpg",
        inStock: true
    },
    {
        id: 2,
        name: "Kundan Pearl Necklace",
        price: 8999.99,
        category: "necklaces",
        description: "Exquisite kundan work necklace with lustrous pearls and traditional Indian craftsmanship.",
        image: "asset/20250925_090339.jpg",
        inStock: true
    },
    {
        id: 3,
        name: "Traditional Jhumkas",
        price: 2999.99,
        category: "earrings",
        description: "Classic Indian jhumkas with intricate filigree work and traditional bell design.",
        image: "asset/20250925_090345.jpg",
        inStock: true
    },
    {
        id: 4,
        name: "Gold Bangles Set",
        price: 12999.99,
        category: "bracelets",
        description: "Traditional Indian gold bangles with meenakari work and traditional patterns.",
        image: "asset/20250925_090556.jpg",
        inStock: true
    },
    {
        id: 5,
        name: "Navratna Ring",
        price: 18999.99,
        category: "rings",
        description: "Sacred navratna ring with nine precious stones representing the nine planets.",
        image: "asset/20251008_114129.jpg",
        inStock: true
    },
    {
        id: 6,
        name: "Temple Jhumkas",
        price: 5999.99,
        category: "earrings",
        description: "Ornate temple-style jhumkas with traditional Indian motifs and gold work.",
        image: "asset/20251008_114135.jpg",
        inStock: true
    },
    {
        id: 7,
        name: "Layered Gold Necklace",
        price: 4499.99,
        category: "necklaces",
        description: "Elegant layered gold necklace with traditional Indian chain patterns.",
        image: "asset/20251022_145801.jpg",
        inStock: true
    },
    {
        id: 8,
        name: "Lac Bangles Set",
        price: 1999.99,
        category: "bracelets",
        description: "Colorful traditional lac bangles with intricate designs and patterns.",
        image: "asset/20251022_145820.jpg",
        inStock: true
    },
    {
        id: 9,
        name: "Antique Gold Ring",
        price: 7999.99,
        category: "rings",
        description: "Vintage-inspired gold ring with traditional Indian craftsmanship and motifs.",
        image: "asset/20251022_145828.jpg",
        inStock: true
    },
    {
        id: 10,
        name: "Diamond Studs",
        price: 14999.99,
        category: "earrings",
        description: "Classic diamond stud earrings in traditional Indian gold setting.",
        image: "asset/20251022_145840.jpg",
        inStock: true
    },
    {
        id: 11,
        name: "Om Pendant Necklace",
        price: 3499.99,
        category: "necklaces",
        description: "Sacred Om symbol pendant necklace with traditional Indian chain.",
        image: "asset/20251022_150028.jpg",
        inStock: true
    },
    {
        id: 12,
        name: "Traditional Kada",
        price: 2499.99,
        category: "bracelets",
        description: "Traditional Indian kada bracelet with intricate gold work and cultural significance.",
        image: "asset/20251022_150250.jpg",
        inStock: true
    },
    {
        id: 13,
        name: "Gold Earrings Collection",
        price: 8999.99,
        category: "earrings",
        description: "Beautiful traditional gold earrings with modern elegance.",
        image: "asset/20251022_150314.jpg",
        inStock: true
    },
    {
        id: 14,
        name: "Premium Jewelry Set",
        price: 19999.99,
        category: "necklaces",
        description: "Stunning premium jewelry set with intricate traditional designs.",
        image: "asset/20251022_150326.jpg",
        inStock: true
    }
];

// API base URL - adjust this to match your server URL
const API_BASE_URL = window.location.origin.includes('localhost') 
    ? 'http://localhost:3000/api' 
    : '/api';

// Custom products from MongoDB
let customProducts = [];
let productsLoaded = false;

// Load products from API
async function loadProductsFromAPI(forceRefresh = false) {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) {
            throw new Error('Failed to load products');
        }
        const apiProducts = await response.json();
        
        // Get default product IDs (numeric IDs) for comparison
        const defaultProductIds = new Set(products.map(p => String(p.id)));
        
        // If refreshing, remove old custom products first
        if (forceRefresh && productsLoaded) {
            // Remove custom products from the products array
            const customProductIds = new Set(customProducts.map(p => String(p.id)));
            for (let i = products.length - 1; i >= 0; i--) {
                if (customProductIds.has(String(products[i].id))) {
                    products.splice(i, 1);
                }
            }
            customProducts = [];
        }
        
        // Filter and process custom products from MongoDB
        // Only include products that are marked as custom source
        const newCustomProducts = apiProducts
            .filter(p => p.source === 'custom' || !p.source)
            .map(product => {
                // Convert MongoDB _id to id for compatibility
                if (product._id && !product.id) {
                    product.id = product._id.toString();
                }
                // Ensure category is set (default to 'custom' if not set)
                if (!product.category) {
                    product.category = 'custom';
                }
                // Make sure we have a valid ID
                if (!product.id) {
                    product.id = product._id ? product._id.toString() : Date.now().toString();
                }
                return product;
            })
            .filter(product => {
                // Exclude if it's actually a default product (by ID match)
                // This shouldn't happen, but just in case
                return !defaultProductIds.has(String(product.id));
            });
        
        // Add custom products to the products array
        newCustomProducts.forEach(product => {
            // Check if product already exists (shouldn't happen after forceRefresh, but safe check)
            const exists = products.some(p => String(p.id) === String(product.id));
            if (!exists) {
                products.push(product);
            }
        });
        
        // Update customProducts array
        customProducts = newCustomProducts;
        
        productsLoaded = true;
        console.log(`Loaded ${customProducts.length} custom products from database`);
        
        // Refresh display if page is already loaded
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            displayProducts();
        }
    } catch (error) {
        console.error('Error loading products from API:', error);
        productsLoaded = true; // Set to true even on error to prevent infinite waiting
        // Fallback: continue with default products only
    }
}

// Load products on page load
loadProductsFromAPI();

// Global variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentFilter = 'all';
let currentQuantity = 1;

// DOM elements
const productGrid = document.getElementById('product-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const modal = document.getElementById('product-modal');
const closeModal = document.querySelector('.close');
const closeCart = document.querySelector('.close-cart');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Initialize the website
document.addEventListener('DOMContentLoaded', async function() {
    // Wait for products to load if they haven't already
    if (!productsLoaded) {
        await loadProductsFromAPI();
    }
    
    displayProducts();
    updateCartDisplay();
    setupEventListeners();
    setupSmoothScrolling();
    setupAnimations();
    
    // Refresh products when page becomes visible (in case products were added in another tab)
    document.addEventListener('visibilitychange', async function() {
        if (!document.hidden && productsLoaded) {
            // Reload products from API to get latest additions
            const oldCustomCount = customProducts.length;
            await loadProductsFromAPI(true); // forceRefresh = true
            if (customProducts.length !== oldCustomCount) {
                console.log('Products refreshed - new products detected');
            }
        }
    });
});

// Display products based on current filter
function displayProducts() {
    const filteredProducts = currentFilter === 'all' 
        ? products 
        : products.filter(product => product.category === currentFilter);
    
    productGrid.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'font-size: 3rem;\\'>💎</div>'">
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">₹${product.price.toFixed(2)}</p>
            <p class="product-description">${product.description}</p>
            <button class="add-to-cart" onclick="openProductModal('${product.id}')">
                View Details
            </button>
        </div>
    `;
    
    return card;
}

// Open product modal
function openProductModal(productId) {
    // Handle both string and number IDs
    const product = products.find(p => String(p.id) === String(productId) || p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    
    document.getElementById('modal-product-name').textContent = product.name;
    document.getElementById('modal-product-price').textContent = `₹${product.price.toFixed(2)}`;
    document.getElementById('modal-product-description').textContent = product.description;
    const modalImage = document.getElementById('modal-product-image');
    modalImage.src = product.image;
    modalImage.alt = product.name;
    modalImage.onerror = function() {
        this.style.display = 'none';
        this.parentElement.innerHTML = '<div style="font-size: 3rem;">💎</div>';
    };
    
    currentQuantity = 1;
    document.getElementById('qty-display').textContent = currentQuantity;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close product modal
function closeProductModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Add to cart functionality
function addToCart() {
    const productName = document.getElementById('modal-product-name').textContent;
    const productPrice = parseFloat(document.getElementById('modal-product-price').textContent.replace('₹', ''));
    const productSize = document.getElementById('product-size').value;
    const quantity = parseInt(document.getElementById('qty-display').textContent);
    
    const existingItem = cart.find(item => 
        item.name === productName && item.size === productSize
    );
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: Date.now(),
            name: productName,
            price: productPrice,
            size: productSize,
            quantity: quantity,
            image: document.getElementById('modal-product-image').alt
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    closeProductModal();
    showSuccessMessage('Item added to cart!');
}

// Update cart display
function updateCartDisplay() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    cartTotal.textContent = totalPrice.toFixed(2);
    
    displayCartItems();
}

// Display cart items
function displayCartItems() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Your cart is empty</p>';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">${getProductIcon(item.name)}</div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${item.price.toFixed(2)} x ${item.quantity}</div>
                <div style="font-size: 0.9rem; color: #666;">Size: ${item.size}</div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">×</button>
        `;
        cartItems.appendChild(cartItem);
    });
}

// Get product icon based on name
function getProductIcon(name) {
    // Use the demo image for all products
    return `<img src="511920FCMAA00_1.webp" alt="${name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 5px;" onerror="this.style.display='none'; this.parentElement.innerHTML='💎'">`;
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

// Open cart sidebar
function openCartSidebar() {
    cartSidebar.classList.add('open');
    document.body.style.overflow = 'hidden';
}

// Close cart sidebar
function closeCartSidebar() {
    cartSidebar.classList.remove('open');
    document.body.style.overflow = 'auto';
}

// Quantity controls
function increaseQuantity() {
    currentQuantity++;
    document.getElementById('qty-display').textContent = currentQuantity;
}

function decreaseQuantity() {
    if (currentQuantity > 1) {
        currentQuantity--;
        document.getElementById('qty-display').textContent = currentQuantity;
    }
}

// Filter products
function filterProducts(category) {
    currentFilter = category;
    
    // Update active filter button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    displayProducts();
}

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => filterProducts(e.target.dataset.filter));
    });
    
    // Cart icon
    cartIcon.addEventListener('click', openCartSidebar);
    
    // Modal close
    closeModal.addEventListener('click', closeProductModal);
    closeCart.addEventListener('click', closeCartSidebar);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeProductModal();
        }
        if (e.target === cartSidebar) {
            closeCartSidebar();
        }
    });
    
    // Quantity controls
    document.getElementById('qty-plus').addEventListener('click', increaseQuantity);
    document.getElementById('qty-minus').addEventListener('click', decreaseQuantity);
    
    // Add to cart button
    document.getElementById('add-to-cart').addEventListener('click', addToCart);
    
    // Mobile menu
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
    
    // Contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterForm);
    }
    
    // Category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            filterProducts(category);
            document.querySelector(`[data-filter="${category}"]`).click();
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // CTA button
    document.querySelector('.cta-button').addEventListener('click', () => {
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    });
}

// Handle contact form submission
function handleContactForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = e.target.querySelector('input[type="text"]').value;
    const email = e.target.querySelector('input[type="email"]').value;
    const message = e.target.querySelector('textarea').value;
    
    // Simulate form submission
    showSuccessMessage('Thank you for your message! We\'ll get back to you soon.');
    e.target.reset();
}

// Handle newsletter form submission
function handleNewsletterForm(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    // Simulate newsletter subscription
    showSuccessMessage('Thank you for subscribing to our newsletter!');
    e.target.reset();
}

// Show success message
function showSuccessMessage(message) {
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Setup smooth scrolling for navigation links
function setupSmoothScrolling() {
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
}

// Setup animations and effects
function setupAnimations() {
    // Intersection Observer for fade-in animations
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
    
    // Observe elements for animation
    document.querySelectorAll('.category-card, .product-card, .about-text, .contact-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// Search functionality
function setupSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search jewelry...';
    searchInput.className = 'search-input';
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
        
        displayFilteredProducts(filteredProducts);
    });
}

// Display filtered products
function displayFilteredProducts(filteredProducts) {
    productGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No products found</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

// Checkout functionality
function proceedToCheckout() {
    if (cart.length === 0) {
        showSuccessMessage('Your cart is empty!');
        return;
    }
    
    // Simulate checkout process
    showSuccessMessage('Redirecting to checkout...');
    
    setTimeout(() => {
        // In a real application, this would redirect to a payment processor
        alert('Checkout functionality would be implemented here with a payment processor like Stripe or PayPal.');
    }, 1000);
}

// Add checkout event listener
document.addEventListener('DOMContentLoaded', () => {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }
});

// Product zoom functionality
function setupProductZoom() {
    const productImages = document.querySelectorAll('.product-image-container img');
    
    productImages.forEach(img => {
        img.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.1)';
            img.style.transition = 'transform 0.3s ease';
        });
        
        img.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
        });
    });
}

// Initialize product zoom when modal opens
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('product-modal');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                if (modal.style.display === 'block') {
                    setupProductZoom();
                }
            }
        });
    });
    
    observer.observe(modal, { attributes: true });
});

// Wishlist functionality (bonus feature)
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

function toggleWishlist(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingIndex = wishlist.findIndex(item => item.id === productId);
    
    if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1);
        showSuccessMessage('Removed from wishlist');
    } else {
        wishlist.push(product);
        showSuccessMessage('Added to wishlist');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistDisplay();
}

function updateWishlistDisplay() {
    const wishlistCount = document.getElementById('wishlist-count');
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
    }
}

// Initialize wishlist display
document.addEventListener('DOMContentLoaded', () => {
    updateWishlistDisplay();
});

// Performance optimization: Lazy loading for images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
    showSuccessMessage('Something went wrong. Please try again.');
});

// Service Worker registration for PWA functionality (bonus)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
