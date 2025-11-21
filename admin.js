const STORAGE_KEY = 'customProducts';
let customProducts = [];
let editingProductId = null;

function loadCustomProducts() {
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(stored) ? stored : [];
    } catch (error) {
        return [];
    }
}

function saveCustomProducts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customProducts));
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
            <button class="admin-product-action admin-product-edit" data-product-id="${product.id}" aria-label="Edit product">
                <i class="fas fa-pen"></i>
                Edit
            </button>
            <button class="admin-product-action admin-product-remove" data-product-id="${product.id}" aria-label="Remove product">
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

    customProducts = loadCustomProducts();
    renderAdminProductList();

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

    function handleAdminProductSubmit(e) {
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
            const index = customProducts.findIndex(product => product.id === editingProductId);
            if (index > -1) {
                customProducts[index] = {
                    ...customProducts[index],
                    name,
                    price,
                    description,
                    image
                };
                saveCustomProducts();
                renderAdminProductList();
                exitEditMode(true);
                showSuccessMessage('Product updated successfully!');
            }
            return;
        }

        const newProduct = {
            id: Date.now(),
            name,
            price,
            category: 'custom',
            description,
            image,
            inStock: true,
            source: 'custom'
        };

        customProducts.push(newProduct);
        saveCustomProducts();
        renderAdminProductList();
        adminForm.reset();
        showSuccessMessage('Product added to catalog!');
    }

    function removeCustomProduct(productId) {
        if (editingProductId === productId) {
            exitEditMode(true);
        }
        customProducts = customProducts.filter(product => product.id !== productId);
        saveCustomProducts();
        renderAdminProductList();
        showSuccessMessage('Removed product from catalog.');
    }

    function clearCustomProducts() {
        if (!customProducts.length) return;
        customProducts = [];
        saveCustomProducts();
        renderAdminProductList();
        exitEditMode(true);
        showSuccessMessage('Cleared all custom products.');
    }

    function enterEditMode(productId) {
        const product = customProducts.find(item => item.id === productId);
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
                const productId = Number(editButton.dataset.productId);
                enterEditMode(productId);
                return;
            }

            const removeButton = event.target.closest('.admin-product-remove');
            if (removeButton) {
                const productId = Number(removeButton.dataset.productId);
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

