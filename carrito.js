const cartItemsDiv = document.getElementById('cart-items');
const cartTotalP = document.getElementById('cart-total');
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Obtener las opciones de entrega
const pickupRadio = document.getElementById('pickup');
const deliveryRadio = document.getElementById('delivery');
const addressContainer = document.getElementById('address-container');

// Función para mostrar/ocultar el campo de dirección
function toggleAddressField() {
    if (deliveryRadio.checked) {
        addressContainer.style.display = 'block'; // Muestra el campo de dirección
    } else {
        addressContainer.style.display = 'none'; // Oculta el campo de dirección
    }
}

// Inicializar el estado del campo de dirección al cargar la página
toggleAddressField();

// Agregar event listeners para mostrar/ocultar la dirección cuando se cambia la opción de entrega
pickupRadio.addEventListener('change', toggleAddressField);
deliveryRadio.addEventListener('change', toggleAddressField);

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
            const removeProduct = confirm('¿Estás seguro de que quieres eliminar este producto?');
            if (removeProduct) {
                cart.splice(index, 1);
            }
        }
    } else if (event.target.classList.contains('remove')) {
        const removeProduct = confirm('¿Estás seguro de que quieres eliminar este producto?');
        if (removeProduct) {
            cart.splice(index, 1);
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
});

document.getElementById('checkout').addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const deliveryOption = document.querySelector('input[name="delivery"]:checked'); // Obtener la opción seleccionada de entrega
    const address = document.getElementById('address').value; // Obtener la dirección si corresponde

    // Verificar si los campos están vacíos
    if (name === "" || !deliveryOption) {
        alert("Por favor, ingresa tu nombre y selecciona un método de entrega.");
        return;
    }

    const deliveryMethod = deliveryOption.value; // "Retira en local" o "Pedido a repartir"

    if (cart.length === 0) {
        alert('El carrito está vacío.');
    } else {
        let orderDetails = `*Pedido de ${name}*\n`;
        orderDetails += `Método de entrega: ${deliveryMethod}\n`;

        if (deliveryMethod === "Pedido a repartir") {
            if (address === "") {
                alert("Por favor, ingresa una dirección para el reparto.");
                return;
            }
            orderDetails += `Dirección de entrega: ${address}\n`;
            // Añadir el cargo por reparto
            orderDetails += `Reparto - $1500\n`;
        }

        orderDetails += `\nProductos:\n`;

        cart.forEach(item => {
            orderDetails += `${item.name} x${item.quantity} - $${(item.price * item.quantity).toLocaleString()}\n`;
        });

        let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Si el método de entrega es "Pedido a repartir", sumar $1500 al total
        if (deliveryMethod === "Pedido a repartir") {
            total += 1500;
        }

        orderDetails += `\nTotal: $${total.toLocaleString()}`;
        
        const encodedMessage = encodeURIComponent(orderDetails);
        const phoneNumber = '56927294017'; // Cambia esto por tu número de WhatsApp
        const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        // Abrir el enlace en una nueva ventana para que el usuario lo envíe
        window.open(whatsappLink, '_blank');
        
        // Limpiar el carrito después de realizar el pedido
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
});

updateCartDisplay();
