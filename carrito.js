const cartItemsDiv = document.getElementById('cart-items');
const cartTotalP = document.getElementById('cart-total');
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartDisplay() {
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Tu carrito está vacío.</p>';
    } else {
        cartItemsDiv.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <p>${item.name} x${item.quantity} - $${(item.price * item.quantity).toLocaleString()}</p>
                <button class="quantity-btn decrease" data-index="${index}">-</button>
                <button class="quantity-btn increase" data-index="${index}">+</button>
                <button class="delete-btn remove" data-index="${index}">Eliminar</button>
            </div>
        `).join('');
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotalP.textContent = `Total: $${total.toLocaleString()}`;
}

cartItemsDiv.addEventListener('click', (event) => {
    const index = event.target.dataset.index;

    if (event.target.classList.contains('increase')) {
        cart[index].quantity += 1;
    } else if (event.target.classList.contains('decrease')) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
    } else if (event.target.classList.contains('remove')) {
        cart.splice(index, 1);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
});

document.getElementById('checkout').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('El carrito está vacío.');
    } else {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        alert(`Gracias por tu compra. Total a pagar: $${total.toLocaleString()}`);
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
});

updateCartDisplay();
