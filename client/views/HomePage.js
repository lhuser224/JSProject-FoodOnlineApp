class HomePage extends Component {
    render() {
        const navbarHTML = new Navbar().render();
        const products = this.store.getProducts();

        return `
            ${navbarHTML}
            
            <div class="hero-wrapper">
                <div class="hero-overlay"></div>
                <div class="hero-container">
                    <h1 class="hero-title">Đặt Đồ Ăn, Giao Hàng Nhanh Chỉ Từ 20 phút</h1>
                    <p class="hero-subtitle">Có 10,000+ Địa điểm ở TP. HCM từ 00:00 - 23:59</p>
                    
                    <div class="search-box-large">
                        <input type="text" placeholder="Tìm địa điểm, món ăn, địa chỉ...">
                        <button class="btn-search"><i class="fa-solid fa-magnifying-glass"></i></button>
                    </div>

                    <div class="quick-tags">
                        <span class="tag active">All</span>
                        <span class="tag">Đồ ăn</span>
                        <span class="tag">Đồ uống</span>
                        <span class="tag">Đồ chay</span>
                        <span class="tag">Bánh kem</span>
                        <span class="tag">Tráng miệng</span>
                        <span class="tag">Homemade</span>
                        <span class="tag">Vỉa hè</span>
                    </div>
                </div>
            </div>

            <div class="container main-content-area">
                <aside class="sidebar-wireframe">
                    <h3 class="filter-title">Filters</h3>
                    
                    <div class="filter-section">
                        <h4>Categories</h4>
                        <label class="checkbox-row"><input type="checkbox"> Food</label>
                        <label class="checkbox-row"><input type="checkbox"> Drink</label>
                        <label class="checkbox-row"><input type="checkbox"> Dessert</label>
                    </div>

                    <div class="filter-section">
                        <h4>Price Range</h4>
                        <div class="price-inputs">
                            <input type="number" class="price-box" placeholder="Min" value="0">
                            <span class="dash">-</span>
                            <input type="number" class="price-box" placeholder="Max" value="100">
                        </div>
                        <input type="range" class="range-slider" min="0" max="100">
                    </div>

                    <div class="filter-section">
                        <h4>Distance</h4>
                        <label class="checkbox-row"><input type="checkbox"> Under 1 km</label>
                        <label class="checkbox-row"><input type="checkbox"> 1 – 3 km</label>
                        <label class="checkbox-row"><input type="checkbox"> Over 3 km</label>
                    </div>

                    <div class="filter-section">
                        <div class="sort-box">
                            <span>Sort by:</span>
                            <select>
                                <option>Nearest</option>
                                <option>Price: Low to High</option>
                                <option>Rating: High to Low</option>
                            </select>
                        </div>
                    </div>
                    
                    <button class="btn btn-primary w-100 mt-20">Apply Filter</button>
                </aside>

                <main class="product-section">
                    <div class="section-head">
                        <h3>Ưu đãi hôm nay</h3>
                    </div>

                    <div class="grid-v2">
                        ${products.map(p => `
                            <div class="card-v2" data-product-id="${p.id}" style="cursor: pointer;">
                                <div class="card-thumb">
                                    <div class="badge-deal"><i class="fa-solid fa-ticket"></i> Giảm 15k</div>
                                    <div class="badge-time">15 min</div>
                                    <div class="img-placeholder"><i class="fa-solid fa-utensils"></i></div>
                                    <div class="overlay-hover">Xem ngay</div>
                                </div>
                                <div class="card-details">
                                    <h4 class="food-name" title="${p.name}">
                                        <i class="fa-solid fa-crown text-warning"></i> ${p.name}
                                    </h4>
                                    <p class="food-address">${p.address || 'Địa chỉ mặc định'}</p>
                                    <div class="card-meta">
                                        <div class="rating"><i class="fa-solid fa-star"></i> 4.8</div>
                                        <div class="sold-count">(999+)</div>
                                    </div>
                                    <div class="card-bottom">
                                        <div class="price-tag">$${p.price.toFixed(2)}</div>
                                        <button class="btn-plus btn-add-fast" data-id="${p.id}">
                                            <i class="fa-solid fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </main>
            </div>
        `;
    }

    afterRender() {
        // 1. Khởi tạo sự kiện mặc định cho Navbar
        const navbar = new Navbar();
        navbar.bindEvents();

        const products = this.store.getProducts() || [];

        /**
         * Hàm bổ trợ: Cập nhật con số trên giỏ hàng mà không reload trang
         */
        const updateNavbarCart = () => {
            const cartBadge = document.querySelector('.cart-number'); // Thay selector đúng của bạn (.cart-count, .badge...)
            if (cartBadge) {
                const currentCount = this.store.getCart().length; // Giả sử store có getCart()
                cartBadge.innerText = currentCount;
                
                // Thêm hiệu ứng nhấn mạnh khi có thay đổi
                cartBadge.style.transform = 'scale(1.3)';
                cartBadge.style.transition = '0.3s';
                setTimeout(() => cartBadge.style.transform = 'scale(1)', 300);
            }
        };

        /**
         * 2. Logic cho nút "Thêm nhanh" (+) 
         */
        document.querySelectorAll('.btn-add-fast').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Ngăn không cho sự kiện click lan ra Card cha (mở Detail)
                
                const id = parseInt(btn.getAttribute('data-id'));
                const product = products.find(p => p.id === id);

                if (product) {
                    this.store.addToCart(product);
                    updateNavbarCart(); // Cập nhật số lượng trên Navbar ngay lập tức
                    alert(`🛒 Đã thêm "${product.name}" vào giỏ hàng!`);
                }
            });
        });

        /**
         * 3. Logic click vào Card để mở Popup chi tiết (Product Detail)
         */
        document.querySelectorAll('.card-v2').forEach(card => {
            card.addEventListener('click', () => {
                const id = parseInt(card.getAttribute('data-product-id'));
                const product = products.find(p => p.id === id);
                
                if (product) {
                    this.renderProductDetail(product, updateNavbarCart);
                }
            });
        });
    }
    renderProductDetail(product, updateCartCallback) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.cssText = `
            position: fixed; top:0; left:0; width:100%; height:100%;
            background: rgba(0,0,0,0.6); display: flex; align-items: center;
            justify-content: center; z-index: 1000; backdrop-filter: blur(4px);
        `;

        modal.innerHTML = `
            <div class="modal-content detail-popup" style="background: #fff; width: 500px; border-radius: 16px; overflow: hidden; position: relative; animation: slideUp 0.3s ease;">
                <div style="height: 200px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; position: relative;">
                    <i class="fa-solid fa-utensils fa-4x" style="color: #ccc;"></i>
                    <button id="close-detail" style="position: absolute; top: 15px; right: 15px; background: #fff; border: none; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">✕</button>
                </div>

                <div style="padding: 20px;">
                    <h2 style="margin: 0 0 5px 0;">${product.name}</h2>
                    <p style="color: #666; font-size: 0.9rem; margin-bottom: 15px;">Mô tả: Món ăn được chế biến từ nguyên liệu tươi ngon nhất trong ngày.</p>
                    
                    <div style="max-height: 300px; overflow-y: auto; padding-right: 5px;">
                        <div class="opt-group" style="margin-bottom: 20px;">
                            <div style="display: flex; justify-content: space-between; background: #f8f9fa; padding: 10px; border-radius: 8px; margin-bottom: 10px;">
                                <strong style="color: #333;">Chọn Size</strong>
                                <span style="font-size: 0.75rem; color: #ee4d2d; background: #fff1f0; padding: 2px 8px; border-radius: 4px;">Bắt buộc</span>
                            </div>
                            <label class="opt-item" style="display: flex; justify-content: space-between; margin: 12px 0; cursor:pointer;">
                                <span><input type="radio" name="size" value="M" checked> Size M</span>
                                <span style="color: #888;">+ $0.00</span>
                            </label>
                            <label class="opt-item" style="display: flex; justify-content: space-between; margin: 12px 0; cursor:pointer;">
                                <span><input type="radio" name="size" value="L"> Size L</span>
                                <span style="color: #888;">+ $2.00</span>
                            </label>
                        </div>

                        <div class="opt-group" style="margin-bottom: 20px;">
                            <div style="background: #f8f9fa; padding: 10px; border-radius: 8px; margin-bottom: 10px;">
                                <strong style="color: #333;">Topping thêm</strong>
                            </div>
                            <label class="opt-item" style="display: flex; justify-content: space-between; margin: 12px 0; cursor:pointer;">
                                <span><input type="checkbox" class="topping-item" value="Egg" data-price="1"> Thêm trứng</span>
                                <span style="color: #888;">+ $1.00</span>
                            </label>
                            <label class="opt-item" style="display: flex; justify-content: space-between; margin: 12px 0; cursor:pointer;">
                                <span><input type="checkbox" class="topping-item" value="Cheese" data-price="1.5"> Thêm phô mai</span>
                                <span style="color: #888;">+ $1.50</span>
                            </label>
                        </div>
                    </div>

                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">

                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div style="display: flex; align-items: center; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                            <button id="minus-qty" style="padding: 8px 15px; border: none; background: #fff; cursor: pointer;">-</button>
                            <span id="qty-val" style="padding: 0 15px; font-weight: bold;">1</span>
                            <button id="plus-qty" style="padding: 8px 15px; border: none; background: #fff; cursor: pointer;">+</button>
                        </div>
                        <button id="confirm-add-btn" class="btn btn-primary" style="background: #ee4d2d; border: none; color: #fff; font-weight: bold; cursor: pointer;">
                            Thêm vào giỏ - $<span id="total-price">${product.price.toFixed(2)}</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.bindDetailEvents(modal, product, updateCartCallback);
    }
    bindDetailEvents(modal, product, updateCartCallback) {
        let quantity = 1;
        const qtyVal = modal.querySelector('#qty-val');
        const totalPriceSpan = modal.querySelector('#total-price');
        const toppings = modal.querySelectorAll('.topping-item');
        const sizes = modal.querySelectorAll('input[name="size"]');

        const calculateTotal = () => {
            let basePrice = product.price;
            
            // Cộng tiền size
            const selectedSize = modal.querySelector('input[name="size"]:checked').value;
            if (selectedSize === 'L') basePrice += 2;

            // Cộng tiền topping
            toppings.forEach(t => {
                if (t.checked) basePrice += parseFloat(t.dataset.price);
            });

            totalPriceSpan.innerText = (basePrice * quantity).toFixed(2);
        };

        // Sự kiện cộng trừ số lượng
        modal.querySelector('#plus-qty').onclick = () => { quantity++; qtyVal.innerText = quantity; calculateTotal(); };
        modal.querySelector('#minus-qty').onclick = () => { if(quantity > 1) { quantity--; qtyVal.innerText = quantity; calculateTotal(); } };

        // Sự kiện thay đổi option
        toppings.forEach(t => t.onchange = calculateTotal);
        sizes.forEach(s => s.onchange = calculateTotal);

        // Sự kiện đóng
        modal.querySelector('#close-detail').onclick = () => modal.remove();

        // Sự kiện XÁC NHẬN
        modal.querySelector('#confirm-add-btn').onclick = () => {
            const selectedOptions = {
                size: modal.querySelector('input[name="size"]:checked').value,
                extras: Array.from(toppings).filter(t => t.checked).map(t => t.value),
                quantity: quantity,
                totalPrice: parseFloat(totalPriceSpan.innerText)
            };

            // Lưu vào store (kèm theo các option đã chọn)
            this.store.addToCart({ ...product, ...selectedOptions });
            
            updateCartCallback();
            alert(`Đã thêm món vào giỏ hàng!`);
            modal.remove();
        };
    }    
}