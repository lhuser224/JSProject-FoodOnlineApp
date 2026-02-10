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
                            <div class="card-v2" onclick="alert('Xem chi tiết: ${p.name}')">
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
                                    <p class="food-address">${p.address}</p>
                                    <div class="card-meta">
                                        <div class="rating"><i class="fa-solid fa-star"></i> 4.8</div>
                                        <div class="sold-count">(999+)</div>
                                    </div>
                                    <div class="card-bottom">
                                        <div class="price-tag">$${p.price.toFixed(2)}</div>
                                        <button class="btn-plus btn-add" data-id="${p.id}"><i class="fa-solid fa-plus"></i></button>
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
        new Navbar().bindEvents();

        // Logic Add to Cart
        document.querySelectorAll('.btn-add').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const id = parseInt(e.currentTarget.dataset.id);
                const product = this.store.getProducts().find(p => p.id === id);
                this.store.addToCart(product);
                Router.navigate(new HomePage());
            }
        });
    }
}