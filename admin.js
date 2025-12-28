// API base URL - uses config.js for easy production updates
const API_BASE_URL = window.API_CONFIG 
    ? window.API_CONFIG.getBaseUrl() 
    : (window.location.origin.includes('localhost') 
        ? 'http://localhost:3000/api' 
        : '/api');

let customProducts = [];
let editingProductId = null;

// Load products from MongoDB via API
async function loadCustomProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error || errorData.message || 'Failed to load products';
            throw new Error(errorMessage);
        }
        const products = await response.json();
        // Filter only custom products for admin panel
        return products.filter(p => p.source === 'custom' || !p.source);
    } catch (error) {
        console.error('Error loading products:', error);
        const errorMsg = error.message.includes('Database not connected') 
            ? 'Database not connected. Please check your MongoDB connection and restart the server.'
            : `Failed to load products: ${error.message}`;
        showSuccessMessage(errorMsg);
        return [];
    }
}

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

function createPreviewCard(product) {
    const item = document.createElement('div');
    item.className = 'admin-product-card';
    // Use _id for MongoDB products, fallback to id for compatibility
    const productId = product._id || product.id;
    item.innerHTML = `
        <div class="admin-product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'; this.parentElement.innerHTML='<span class=\\'admin-placeholder\\'>💎</span>'">
        </div>
        <div class="admin-product-details">
            <p class="admin-product-name">${product.name}</p>
            <p class="admin-product-price">₹${product.price.toFixed(2)}</p>
            <p class="admin-product-description">${product.description}</p>
        </div>
        <div class="admin-product-actions">
            <button class="admin-product-action admin-product-edit" data-product-id="${productId}" aria-label="Edit product">
                <i class="fas fa-pen"></i>
                Edit
            </button>
            <button class="admin-product-action admin-product-remove" data-product-id="${productId}" aria-label="Remove product">
                <i class="fas fa-trash"></i>
                Remove
            </button>
        </div>
    `;
    return item;
}

document.addEventListener('DOMContentLoaded', () => {
    const adminForm = document.getElementById('admin-product-form');
    const adminProductList = document.getElementById('admin-product-list');
    const adminEmptyState = document.getElementById('admin-empty-state');
    const adminClearButton = document.getElementById('admin-clear-products');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const submitButton = document.getElementById('admin-submit-btn');
    const cancelEditButton = document.getElementById('admin-cancel-edit');
    const editingBadge = document.getElementById('admin-editing-badge');
    
    const defaultSubmitMarkup = submitButton ? submitButton.innerHTML : '';
    const updateSubmitMarkup = '<i class="fas fa-save"></i> Save Changes';

    // Load products on page load
    loadCustomProducts().then(products => {
        customProducts = products;
        renderAdminProductList();
    });

    function renderAdminProductList() {
        if (!adminProductList) return;

        adminProductList.innerHTML = '';

        if (customProducts.length === 0) {
            if (adminEmptyState) adminEmptyState.style.display = 'block';
            return;
        }

        if (adminEmptyState) adminEmptyState.style.display = 'none';

        customProducts.forEach(product => {
            const card = createPreviewCard(product);
            adminProductList.appendChild(card);
        });
    }

    async function handleAdminProductSubmit(e) {
        e.preventDefault();

        const name = document.getElementById('admin-product-name').value.trim();
        const description = document.getElementById('admin-product-description').value.trim();
        const priceValue = document.getElementById('admin-product-price').value;
        const image = document.getElementById('admin-product-image').value.trim();

        const price = parseFloat(priceValue);

        if (!name || !description || !price || !image) {
            showSuccessMessage('Please fill in all fields to add a product.');
            return;
        }

        if (editingProductId) {
            // Update existing product
            try {
                const response = await fetch(`${API_BASE_URL}/products/${editingProductId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name,
                        description,
                        price,
                        image,
                        category: 'custom'
                    })
                });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error || errorData.message || 'Failed to update product';
                throw new Error(errorMessage);
            }

                const updatedProduct = await response.json();
                // Update local array
                const index = customProducts.findIndex(p => (p._id || p.id) === editingProductId);
                if (index > -1) {
                    customProducts[index] = updatedProduct;
                }
                
                renderAdminProductList();
                exitEditMode(true);
                showSuccessMessage('Product updated successfully!');
            } catch (error) {
                console.error('Error updating product:', error);
                showSuccessMessage('Failed to update product. Please try again.');
            }
            return;
        }

        // Create new product
        try {
            const response = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    price,
                    category: 'custom',
                    description,
                    image,
                    inStock: true,
                    source: 'custom'
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error || errorData.message || 'Failed to create product';
                throw new Error(errorMessage);
            }

            const newProduct = await response.json();
            customProducts.push(newProduct);
            renderAdminProductList();
            adminForm.reset();
            showSuccessMessage('Product added to catalog!');
        } catch (error) {
            console.error('Error creating product:', error);
            const errorMsg = error.message.includes('Database not connected')
                ? 'Database not connected. Please check your MongoDB connection.'
                : `Failed to add product: ${error.message}`;
            showSuccessMessage(errorMsg);
        }
    }

    async function removeCustomProduct(productId) {
        if (editingProductId === productId) {
            exitEditMode(true);
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error || errorData.message || 'Failed to delete product';
                throw new Error(errorMessage);
            }

            customProducts = customProducts.filter(product => (product._id || product.id) !== productId);
            renderAdminProductList();
            showSuccessMessage('Removed product from catalog.');
        } catch (error) {
            console.error('Error deleting product:', error);
            showSuccessMessage('Failed to delete product. Please try again.');
        }
    }

    async function clearCustomProducts() {
        if (!customProducts.length) return;
        
        if (!confirm('Are you sure you want to delete all custom products? This action cannot be undone.')) {
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/products`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error || errorData.message || 'Failed to clear products';
                throw new Error(errorMessage);
            }

            customProducts = [];
            renderAdminProductList();
            exitEditMode(true);
            showSuccessMessage('Cleared all custom products.');
        } catch (error) {
            console.error('Error clearing products:', error);
            showSuccessMessage('Failed to clear products. Please try again.');
        }
    }

    function enterEditMode(productId) {
        const product = customProducts.find(item => (item._id || item.id) === productId);
        if (!product || !adminForm) return;

        editingProductId = productId;
        document.getElementById('admin-product-name').value = product.name;
        document.getElementById('admin-product-description').value = product.description;
        document.getElementById('admin-product-price').value = product.price;
        document.getElementById('admin-product-image').value = product.image;

        if (submitButton) {
            submitButton.innerHTML = updateSubmitMarkup;
        }
        if (cancelEditButton) {
            cancelEditButton.style.display = 'inline-flex';
        }
        if (editingBadge) {
            editingBadge.style.display = 'inline-flex';
            editingBadge.innerHTML = `<i class="fas fa-pen"></i> Editing: ${product.name}`;
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function exitEditMode(resetForm = false) {
        editingProductId = null;
        if (submitButton) {
            submitButton.innerHTML = defaultSubmitMarkup;
        }
        if (cancelEditButton) {
            cancelEditButton.style.display = 'none';
        }
        if (editingBadge) {
            editingBadge.style.display = 'none';
            editingBadge.textContent = '';
        }
        if (resetForm && adminForm) {
            adminForm.reset();
        }
    }

    if (cancelEditButton) {
        cancelEditButton.addEventListener('click', () => {
            exitEditMode(true);
            showSuccessMessage('Edit cancelled.');
        });
    }

    if (adminForm) {
        adminForm.addEventListener('submit', handleAdminProductSubmit);
    }

    if (adminProductList) {
        adminProductList.addEventListener('click', (event) => {
            const editButton = event.target.closest('.admin-product-edit');
            if (editButton) {
                const productId = editButton.dataset.productId;
                enterEditMode(productId);
                return;
            }

            const removeButton = event.target.closest('.admin-product-remove');
            if (removeButton) {
                const productId = removeButton.dataset.productId;
                removeCustomProduct(productId);
            }
        });
    }

    if (adminClearButton) {
        adminClearButton.addEventListener('click', clearCustomProducts);
    }

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    window.renderAdminProductList = renderAdminProductList;
});

