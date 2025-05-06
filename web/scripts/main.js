import { data } from './data.js';

let currentCategoryIndex = 0;
let cartItemCount = 0;
let cartItems = {};

function loadCart() {
    const savedItems = localStorage.getItem('cartItems');
    const savedCount = localStorage.getItem('cartItemCount');

    if (savedItems) {
        cartItems = JSON.parse(savedItems);
        Object.keys(cartItems).forEach(key => {
            if (cartItems[key] <= 0) {
                delete cartItems[key];
            }
        });
    }

    cartItemCount = Object.values(cartItems).reduce((sum, quantity) => sum + quantity, 0);
    saveCart();
    updateCartCount();
}

function saveCart() {
    Object.keys(cartItems).forEach(key => {
        if (cartItems[key] <= 0) {
            delete cartItems[key];
        }
    });
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('cartItemCount', cartItemCount.toString());
}

function displayProducts(categoryIndex) {
    const category = data.categories[categoryIndex];
    const articleGrid = document.querySelector('.article-grid');
    const categoryTitle = document.getElementById('current-kategorija');

    categoryTitle.textContent = `Izdavač: ${category.name}`;

    articleGrid.innerHTML = '';

    category.products.slice(0, 15).forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('article-preview');

        const picDiv = document.createElement('div');
        picDiv.classList.add('article-preview-pic-container');

        const img = document.createElement('img');
        img.src = `images/${product.image}`;
        img.alt = product.name;
        img.classList.add('article-img');
        picDiv.appendChild(img);

        const textDiv = document.createElement('div');
        textDiv.classList.add('article-preview-text');
        textDiv.textContent = product.name;

        productDiv.appendChild(picDiv);
        productDiv.appendChild(textDiv);

        const cartWrapper = document.createElement('div');
        cartWrapper.classList.add('cart-icon-wrapper');

        const cartIcon = document.createElement('img');
        cartIcon.src = './images/cart.png';
        cartIcon.classList.add('cart-add-icon');

        const quantityBubble = document.createElement('span');
        quantityBubble.classList.add('quantity-bubble');

        const currentQuantity = cartItems[product.name] || 0;
        quantityBubble.textContent = currentQuantity;
        quantityBubble.style.display = currentQuantity > 0 ? 'flex' : 'none';

        cartWrapper.appendChild(cartIcon);
        cartWrapper.appendChild(quantityBubble);

        cartIcon.addEventListener('click', () => {
            if (!cartItems[product.name]) {
                cartItems[product.name] = 1;
            } else {
                cartItems[product.name]++;
            }

            cartItemCount++;
            saveCart();
            updateCartCount();
            populateCartWindow();

            const newQuantity = cartItems[product.name];
            quantityBubble.textContent = newQuantity;
            quantityBubble.style.display = newQuantity > 0 ? 'flex' : 'none';

        });

        cartWrapper.classList.add('hidden');
        productDiv.appendChild(cartWrapper);
        articleGrid.appendChild(productDiv);
    });
}

function updateCartCount() {
    cartItemCount = Object.values(cartItems).reduce((sum, quantity) => sum + quantity, 0);
    const cartCountSpan = document.getElementById('cart-count');

    if (cartCountSpan) {
        cartCountSpan.textContent = cartItemCount;

        if (cartItemCount > 0) {
            cartCountSpan.classList.remove('hidden');
        } else {
            cartCountSpan.classList.add('hidden');
        }
    }
}

function setupSidebarButtons() {
    const buttons = document.querySelectorAll('.kategorija-option');
    buttons.forEach((button, index) => {
        button.addEventListener('click', () => {
            currentCategoryIndex = index;
            displayProducts(index);
        });
    });
}

function populateCartWindow() {
    const cartWindow = document.querySelector('.cart-window');
    if (!cartWindow) return;

    cartWindow.innerHTML = '';

    if (Object.keys(cartItems).length === 0) {
        const emptyMsg1 = document.createElement('p');
        emptyMsg1.textContent = 'Košarica Vam je prazna :((';
        emptyMsg1.style.fontFamily = 'DPComic';
        emptyMsg1.style.marginLeft = '30px';
        emptyMsg1.style.fontSize = '20px';
        const emptyMsg2 = document.createElement('pre');
        emptyMsg2.textContent = `
     ⢀⡤⠖⠋⠉⠉⠉⠉⠙⠲⣦ 
⠀⠀⠀⡴⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣦⡀⠀⠀⠀
⠀⠀⡼⢁⡠⢼⠁⠀⢱⢄⣀⠀⠀⠀⠀⠀⠎⢿⡄⠀⠀
⠀⣸⠁⠀⣧⣼⠀⠀⣧⣼⠉⠀⠀⠀⠀⠀⠐⢬⣷⠀⠀
⡼⣿⢀⠀⣿⡟⠀⠀⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⢹⣧⠀
⣇⢹⠀⠁⠈⠀⠉⠃⠈⠃⠀⠀⠀⠀⠀⠀⠀⠀⡰⢸⡇
⠙⢿⣧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣏⣈⣉⣤⠿⠁
⠀⣠⣾⣿⠤⡀⠀⠀⠀⠀⠀⢀⣤⣶⣿⣿⣿⣿⣅⠀⠀
⢰⣧⣿⣿⣿⣦⣉⡐⠒⠒⢲⣿⣿⣿⣿⣿⣿⣶⣿⣧⠀
⠘⠿⢿⣿⣿⣿⡿⠿⠛⠿⠿⠿⣿⣿⣿⣿⣿⣿⡿⠟⠀ `;
        emptyMsg2.style.fontFamily = 'monospace';
        emptyMsg2.style.textAlign = 'center ';
        emptyMsg2.style.marginTop = '70px';
        emptyMsg2.style.fontSize = '20px';
        cartWindow.appendChild(emptyMsg1);
        cartWindow.appendChild(emptyMsg2);

        return;
    }

    const headerName = document.createElement('div');
    headerName.classList.add('cart-article-category');
    headerName.textContent = 'NAME';
    cartWindow.appendChild(headerName);

    const headerQuantity = document.createElement('div');
    headerQuantity.classList.add('cart-article-category');
    headerQuantity.textContent = 'QUANTITY';
    cartWindow.appendChild(headerQuantity);

    Object.keys(cartItems).forEach(productName => {
        const quantity = cartItems[productName];

        const nameDiv = document.createElement('div');
        nameDiv.classList.add('cart-item-name');
        nameDiv.textContent = productName;

        const quantityControls = document.createElement('div');
        quantityControls.classList.add('cart-item-quantity');

        const minusBtn = document.createElement('button');
        minusBtn.textContent = '−';
        minusBtn.classList.add('cart-display-quantity-btn', 'minus');

        const quantitySpan = document.createElement('span');
        quantitySpan.textContent = `x${quantity}`;
        quantitySpan.classList.add('cart-display-quantity-display');

        const plusBtn = document.createElement('button');
        plusBtn.textContent = '+';
        plusBtn.classList.add('cart-display-quantity-btn', 'plus');

        plusBtn.addEventListener('click', () => {
            cartItems[productName]++;
            cartItemCount++;
            saveCart();
            updateCartCount();
            populateCartWindow();
        });

        minusBtn.addEventListener('click', () => {
            if (cartItems[productName] > 1) {
                cartItems[productName]--;
            } else {
                delete cartItems[productName];
            }

            updateCartCount();
            saveCart();
            populateCartWindow();
        });

        quantityControls.appendChild(minusBtn);
        quantityControls.appendChild(quantitySpan);
        quantityControls.appendChild(plusBtn);

        cartWindow.appendChild(nameDiv);
        cartWindow.appendChild(quantityControls);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadCart();

    if (document.querySelector('.article-grid')) {
        setupSidebarButtons();
        displayProducts(currentCategoryIndex);
    }

    if (document.querySelector('.cart-window')) {
        populateCartWindow();
    }
});