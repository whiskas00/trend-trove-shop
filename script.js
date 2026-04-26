const products = [
    { id: 1, name: "Базовая футболка", price: 1500, category: "tops" },
    { id: 2, name: "Худи оверсайз", price: 3200, category: "tops" },
    { id: 3, name: "Джинсы прямого кроя", price: 2800, category: "bottoms" }
];
let cart = [];

const findProduct = (id) => products.find(p => p.id === Number(id));

const addToCart = (productId) => {
    const product = findProduct(productId);
    if (product) {
        cart.push(product);
        renderCart();
        saveCartToLocalStorage();
        console.log(`Товар "${product.name}" добавлен в корзину`);
    }
};

const removeFromCart = (index) => {
    cart.splice(index, 1);
    renderCart();
    saveCartToLocalStorage();
};

const calculateTotal = () => {
    let total = 0;
    cart.forEach(item => total += item.price);
    return total;
};

const renderCart = () => {
    const cartItemsElement = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');
    
    cartItemsElement.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsElement.innerHTML = '<p>Корзина пуста</p>';
        totalElement.textContent = '0';
        return;
    }
    
    const ul = document.createElement('ul');
    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${item.name} — ${item.price} руб. 
            <button class="remove-btn" data-index="${index}">Удалить</button>
        `;
        ul.appendChild(li);
    });
    cartItemsElement.appendChild(ul);
    
    totalElement.textContent = calculateTotal();
    
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            removeFromCart(index);
        });
    });
};

const processPayment = () => {
    if (cart.length === 0) {
        alert('Корзина пуста! Добавьте товары перед оплатой.');
        return;
    }
    const total = calculateTotal();
    alert(`Оплата прошла успешно!\nСумма: ${total} руб.\nСпасибо за покупку!`);
    cart = [];
    renderCart();
    saveCartToLocalStorage();
};

const filterProducts = (category) => {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const productCategory = card.dataset.category;
        
        if (category === 'all' || productCategory === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
};

const saveCartToLocalStorage = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        renderCart();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    
    loadCartFromLocalStorage();
    
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.dataset.id;
            addToCart(productId);
        });
    });
    
    const payBtn = document.getElementById('pay-btn');
    if (payBtn) {
        payBtn.addEventListener('click', processPayment);
    }
    
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            filterProducts(e.target.value);
        });
    }
    
    renderCart();
});