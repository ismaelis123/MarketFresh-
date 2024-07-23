document.addEventListener('DOMContentLoaded', () => {
    const products = document.querySelectorAll('.product');
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    const checkoutButton = document.querySelector('.checkout');
    const invoiceDetails = document.querySelector('#invoice-details');
    const cart = [];

    products.forEach(product => {
        product.querySelector('.add-to-cart').addEventListener('click', () => {
            const productId = product.dataset.id;
            const productName = product.dataset.name;
            const productPrice = parseFloat(product.dataset.price);
            addToCart(productId, productName, productPrice);
        });
    });

    function addToCart(id, name, price) {
        const existingProductIndex = cart.findIndex(product => product.id === id);
        if (existingProductIndex > -1) {
            cart[existingProductIndex].quantity++;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }
        renderCart();
    }

    function renderCart() {
        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach(product => {
            total += product.price * product.quantity;
            const cartItem = document.createElement('li');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <span>${product.name} - $${product.price.toFixed(2)} x ${product.quantity}</span>
                <button class="remove-from-cart" data-id="${product.id}">Eliminar</button>
            `;
            cartItems.appendChild(cartItem);

            cartItem.querySelector('.remove-from-cart').addEventListener('click', () => {
                removeFromCart(product.id);
            });
        });

        cartTotal.textContent = total.toFixed(2);
    }

    function removeFromCart(id) {
        const itemIndex = cart.findIndex(product => product.id === id);
        if (itemIndex > -1) {
            cart[itemIndex].quantity--;
            if (cart[itemIndex].quantity === 0) {
                cart.splice(itemIndex, 1);
            }
        }
        renderCart();
    }

    function generateInvoice() {
        if (cart.length === 0) {
            alert('No hay productos en el carrito.');
            return;
        }

        let invoiceHTML = '<h3>Detalles de la Factura</h3><ul>';
        let total = 0;

        cart.forEach(item => {
            total += item.price * item.quantity;
            invoiceHTML += `<li>${item.name} - $${item.price.toFixed(2)} x ${item.quantity}</li>`;
        });

        invoiceHTML += `</ul><p>Total: $${total.toFixed(2)}</p><p>Gracias por su compra</p>`;
        invoiceDetails.innerHTML = invoiceHTML;

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text('Detalles de la Factura', 10, 10);
        doc.text(invoiceHTML.replace(/<[^>]*>?/gm, ''), 10, 20);
        doc.save('factura.pdf');

        cart.length = 0;
        renderCart();
    }

    checkoutButton.addEventListener('click', generateInvoice);
});
