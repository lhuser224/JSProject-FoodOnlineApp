class CheckoutPage extends Component {
    render() {
        const navbarHTML = new Navbar().render();
        const cart = this.store.getCart();
        const total = this.store.getCartTotal();

        return `
            ${navbarHTML}
            <div class="container checkout-layout">
                <div class="checkout-form">
                    <h2>Thông tin giao hàng</h2>
                    <input type="text" class="form-control" placeholder="Họ tên" id="ship-name">
                    <input type="text" class="form-control" placeholder="Địa chỉ" id="ship-address">
                    <input type="text" class="form-control" placeholder="Số điện thoại" id="ship-phone">
                    <textarea class="form-control" placeholder="Ghi chú..."></textarea>
                </div>

                <div class="order-summary">
                    <h3>Đơn hàng của bạn</h3>
                    
                    <div class="cart-items-list" style="margin-bottom: 20px;">
                        ${cart.length === 0 
                            ? '<p style="color:#777; font-style:italic">Giỏ hàng đang trống</p>' 
                            : cart.map((item, index) => `
                                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px dashed #eee; padding:10px 0;">
                                    <div>
                                        <strong>${item.name}</strong>
                                        <div style="font-size:0.9rem; color:#555">$${item.price.toFixed(2)}</div>
                                    </div>
                                    <button class="btn-remove" data-index="${index}" style="background:none; border:none; color:red; cursor:pointer;">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            `).join('')
                        }
                    </div>

                    <div style="border-top: 2px solid #eee; padding-top: 15px; display:flex; justify-content:space-between; font-size:1.2rem; font-weight:bold;">
                        <span>Tổng tiền:</span>
                        <span style="color:#ee4d2d">$${total.toFixed(2)}</span>
                    </div>

                    <button class="btn btn-success w-100 mt-20" id="btn-pay">Đặt hàng ngay</button>
                    
                    ${cart.length === 0 ? `<button class="btn btn-secondary w-100 mt-20" onclick="Router.navigate(new HomePage())">Quay lại chọn món</button>` : ''}
                </div>
            </div>

            <div id="success-modal" class="modal-overlay" style="display: none;">
                <div class="modal-content">
                    <div class="success-icon">
                        <i class="fa-solid fa-circle-check"></i>
                    </div>
                    <h2>Order Confirmed!</h2>
                    <p>Your order has been placed successfully.</p>
                    <p class="order-id-text">Order ID: <strong id="modal-order-id">#123456</strong></p>
                    <button class="btn btn-primary" id="btn-return-menu">Return to Menu</button>
                </div>
            </div>
        `;
    }

    afterRender() {
        new Navbar().bindEvents();

        // 1. XỬ LÝ XÓA MÓN
        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.onclick = (e) => {
                const index = e.currentTarget.dataset.index;
                this.store.removeFromCart(index);
                Router.navigate(new CheckoutPage());
            }
        });

        // 2. XỬ LÝ THANH TOÁN & HIỆN POPUP
        const btnPay = document.getElementById('btn-pay');
        if(btnPay) {
            btnPay.onclick = () => {
                const currentCart = this.store.getCart();
                if(currentCart.length === 0) return alert("Giỏ hàng trống! Vui lòng chọn món.");
                
                // Validate form cơ bản
                const name = document.getElementById('ship-name').value;
                const phone = document.getElementById('ship-phone').value;
                const address = document.getElementById('ship-address').value;

                if(!name || !phone || !address) {
                    return alert("Vui lòng điền đầy đủ thông tin giao hàng!");
                }

                // --- TẠO ĐƠN HÀNG ---
                const newOrderId = '#ORD-' + Math.floor(100000 + Math.random() * 900000);
                const newOrder = {
                    id: newOrderId,
                    date: new Date().toLocaleString(),
                    total: this.store.getCartTotal(),
                    status: 'Processing',
                    items: [...currentCart]
                };

                // Lưu vào Store
                this.store.addOrder(newOrder);
                
                // Xóa giỏ hàng
                this.store.clearCart();

                // --- HIỂN THỊ POPUP ---
                const modal = document.getElementById('success-modal');
                document.getElementById('modal-order-id').innerText = newOrderId;
                modal.style.display = 'flex'; // Hiện modal lên
            }
        }

        // 3. XỬ LÝ NÚT QUAY VỀ MENU TRONG POPUP
        document.getElementById('btn-return-menu').onclick = () => {
            Router.navigate(new HomePage());
        }
    }
}