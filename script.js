/**
 * Data structures for the application
 */
const menuItems = [
    {
        id: 'm1',
        title: 'Burger Signature Premium',
        description: 'Bœuf wagyu, cheddar affiné, sauce secrète, frites maison.',
        price: 18.50,
        category: 'burger',
        image: IMAGE_PATHS.burger_premium
    },
    {
        id: 'm2',
        title: 'Pizza Napolitaine Authentique',
        description: 'Mozzarella di bufala, tomate San Marzano, basilic frais.',
        price: 16.00,
        category: 'pizza',
        image: IMAGE_PATHS.pizza_premium
    },
    {
        id: 'm3',
        title: 'Salade César Royale',
        description: 'Poulet rôti, croûtons à l\'ail, parmesan AOP, sauce onctueuse.',
        price: 14.50,
        category: 'salad',
        image: IMAGE_PATHS.salad_premium
    },
    {
        id: 'm4',
        title: 'Entrecôte Grillée (300g)',
        description: 'Viande maturée, beurre persillé, accompagnée de légumes rôtis.',
        price: 28.00,
        category: 'meat',
        image: IMAGE_PATHS.steak_premium
    }
];

const usersData = [
    {
        id: 'u1',
        name: 'Sophie Martin',
        email: 'sophie.m@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Sophie+Martin&background=random',
        status: 'Actif',
        lastOrder: '06 Mar 2026',
        totalSpent: 145.50
    },
    {
        id: 'u2',
        name: 'Thomas Bernard',
        email: 't.bernard@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Thomas+Bernard&background=random',
        status: 'Inactif',
        lastOrder: '28 Fév 2026',
        totalSpent: 42.00
    },
    {
        id: 'u3',
        name: 'Céline Dubois',
        email: 'cdubois_design@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Céline+Dubois&background=random',
        status: 'Actif',
        lastOrder: '05 Mar 2026',
        totalSpent: 308.20
    },
    {
        id: 'u4',
        name: 'Lucas Leroy',
        email: 'lucas.l@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Lucas+Leroy&background=random',
        status: 'Actif',
        lastOrder: '01 Mar 2026',
        totalSpent: 85.00
    }
];

let cart = [];

/**
 * DOM Elements
 */
const menuGrid = document.getElementById('menu-grid');
const orderItemsContainer = document.getElementById('order-items');
const subtotalEl = document.getElementById('subtotal');
const taxEl = document.getElementById('tax');
const totalEl = document.getElementById('total');
const cartCountElements = document.querySelectorAll('.cart-count');
const catButtons = document.querySelectorAll('.cat-btn');

const navLinks = document.querySelectorAll('.nav-links li');
const sections = document.querySelectorAll('.content-section');
const pageTitle = document.getElementById('page-title');
const pageSubtitle = document.getElementById('page-subtitle');

const usersTbody = document.getElementById('users-tbody');

/**
 * Initialization
 */
function init() {
    renderMenu('all');
    renderUsers();
    setupEventListeners();
}

/**
 * Render Menu Items
 */
function renderMenu(categoryFilter) {
    menuGrid.innerHTML = '';

    const filteredItems = categoryFilter === 'all'
        ? menuItems
        : menuItems.filter(item => item.category === categoryFilter);

    filteredItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'food-card';
        card.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="food-image">
            <div class="food-info">
                <h3 class="food-title">${item.title}</h3>
                <p class="food-desc">${item.description}</p>
                <div class="food-bottom">
                    <span class="price">${item.price.toFixed(2)} $</span>
                    <button class="add-btn" onclick="addToCart('${item.id}')">
                        <i class='bx bx-plus'></i>
                    </button>
                </div>
            </div>
        `;
        menuGrid.appendChild(card);
    });
}

/**
 * Render Users Table
 */
function renderUsers() {
    usersTbody.innerHTML = '';

    usersData.forEach(user => {
        const tr = document.createElement('tr');

        const statusClass = user.status === 'Actif' ? 'status-active' : 'status-inactive';

        tr.innerHTML = `
            <td>
                <div class="user-cell">
                    <img src="${user.avatar}" alt="${user.name}" class="user-avatar">
                    <span class="user-name">${user.name}</span>
                </div>
            </td>
            <td>${user.email}</td>
            <td><span class="status-badge ${statusClass}">${user.status}</span></td>
            <td>${user.lastOrder}</td>
            <td style="font-weight: 600;">${user.totalSpent.toFixed(2)} $</td>
            <td>
                <button class="action-btn" title="Éditer"><i class='bx bx-edit-alt'></i></button>
                <button class="action-btn" title="Supprimer"><i class='bx bx-trash'></i></button>
            </td>
        `;
        usersTbody.appendChild(tr);
    });
}

/**
 * Cart Functionality
 */
window.addToCart = function (itemId) {
    const item = menuItems.find(m => m.id === itemId);
    if (!item) return;

    const existingCartItem = cart.find(c => c.item.id === itemId);
    if (existingCartItem) {
        existingCartItem.quantity += 1;
    } else {
        cart.push({
            item: item,
            quantity: 1
        });
    }

    updateCartUI();
};

window.changeQuantity = function (itemId, delta) {
    const cartItem = cart.find(c => c.item.id === itemId);
    if (!cartItem) return;

    cartItem.quantity += delta;
    if (cartItem.quantity <= 0) {
        cart = cart.filter(c => c.item.id !== itemId);
    }

    updateCartUI();
};

window.removeFromCart = function (itemId) {
    cart = cart.filter(c => c.item.id !== itemId);
    updateCartUI();
};

function updateCartUI() {
    orderItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        orderItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class='bx bx-shopping-bag'></i>
                <p>Votre panier est vide.</p>
            </div>
        `;
        subtotalEl.textContent = '0,00 $';
        taxEl.textContent = '0,00 $';
        totalEl.textContent = '0,00 $';

        cartCountElements.forEach(el => el.textContent = '0');
        return;
    }

    let subtotal = 0;
    let totalItems = 0;

    cart.forEach(cartObj => {
        const itemTotal = cartObj.item.price * cartObj.quantity;
        subtotal += itemTotal;
        totalItems += cartObj.quantity;

        const cartElement = document.createElement('div');
        cartElement.className = 'cart-item';
        cartElement.innerHTML = `
            <img src="${cartObj.item.image}" alt="${cartObj.item.title}" class="cart-item-img">
            <div class="cart-item-info">
                <h4 class="cart-item-title">${cartObj.item.title}</h4>
                <div class="cart-item-price">${(cartObj.item.price).toFixed(2)} $</div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="changeQuantity('${cartObj.item.id}', -1)"><i class='bx bx-minus'></i></button>
                    <span class="qty">${cartObj.quantity}</span>
                    <button class="qty-btn" onclick="changeQuantity('${cartObj.item.id}', 1)"><i class='bx bx-plus'></i></button>
                </div>
            </div>
            <button class="remove-btn" onclick="removeFromCart('${cartObj.item.id}')"><i class='bx bx-trash'></i></button>
        `;
        orderItemsContainer.appendChild(cartElement);
    });

    const tax = subtotal * 0.10;
    const total = subtotal + tax;

    subtotalEl.textContent = subtotal.toFixed(2) + ' $';
    taxEl.textContent = tax.toFixed(2) + ' $';
    totalEl.textContent = total.toFixed(2) + ' $';

    cartCountElements.forEach(el => el.textContent = totalItems.toString());
}

/**
 * Event Listeners & Navigation Setup
 */
function setupEventListeners() {
    // Category Filtering
    catButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            catButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderMenu(btn.getAttribute('data-category'));
        });
    });

    // Navigation Sidebar
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Remove active from all links
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Hide all sections
            sections.forEach(sec => sec.classList.remove('active'));

            // Show targeted section
            const targetId = link.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');

            // Update Header titles dynamically
            if (targetId === 'menu-section') {
                pageTitle.textContent = "Nos Délices";
                pageSubtitle.textContent = "Découvrez notre menu premium et passez votre commande.";
            } else if (targetId === 'users-section') {
                pageTitle.textContent = "Utilisateurs";
                pageSubtitle.textContent = "Gérez la liste de vos clients et leurs informations.";
            } else if (targetId === 'analytics-section') {
                pageTitle.textContent = "Statistiques";
                pageSubtitle.textContent = "Votre performance en un coup d'œil.";
            } else if (targetId === 'settings-section') {
                pageTitle.textContent = "Paramètres";
                pageSubtitle.textContent = "Configurez votre application système.";
            }
        });
    });

    // Mobile Cart Trigger
    const cartTrigger = document.getElementById('cart-trigger');
    const orderSidebar = document.getElementById('order-sidebar');
    const closeCartBtn = document.getElementById('close-cart');

    if (cartTrigger) {
        cartTrigger.addEventListener('click', () => {
            orderSidebar.classList.add('open');
        });
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            orderSidebar.classList.remove('open');
        });
    }
}

// Start application
init();
