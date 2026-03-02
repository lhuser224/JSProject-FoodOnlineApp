class SellerDashboard extends Component {
    constructor(shopId) {
        super();
        this.shopId = shopId;
        this.products = []; // Dữ liệu lấy từ DB
    }

    // --- HÀM LẤY DỮ LIỆU TỪ BACKEND (GIỮ NGUYÊN) ---
    async loadData() {
        try {
            const response = await fetch(`/FoodO/seller/${this.shopId}/foods`);
            if (!response.ok) throw new Error("Lỗi Server");
            
            this.products = await response.json();
            this.renderProducts(); 
        } catch (error) {
            console.error("Lỗi fetch:", error);
            const grid = document.querySelector('.grid-v2');
            if (grid) grid.innerHTML = `<p style="color:red">Không thể kết nối đến Database!</p>`;
        }
    }

    // --- HÀM RENDER ALERT TỰ CHẾ (THAY THẾ ALERT TRUYỀN THỐNG) ---
    renderAlert(msg, type) {
        const container = document.getElementById('status-container');
        if (container) {
            container.innerHTML = ''; // Clear cũ
            const alertDiv = document.createElement('div');
            alertDiv.id = 'status-alert'; // ID quan trọng để TestCafe soi
            
            const bgColor = type === 'success' ? '#2ecc71' : '#e74c3c';
            alertDiv.style = `background-color: ${bgColor}; color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-weight: bold; text-align: center; animation: slideIn 0.4s ease-out;`;
            
            alertDiv.innerText = msg;
            container.appendChild(alertDiv);

            setTimeout(() => { if (alertDiv) alertDiv.remove(); }, 3000);
        }
    }

    // --- HÀM RENDER DANH SÁCH SẢN PHẨM (GIỮ NGUYÊN ID/CLASS CŨ) ---
    renderProducts() {
        const grid = document.querySelector('.grid-v2');
        const countDisplay = document.getElementById('product-count');
        
        if (countDisplay) countDisplay.innerText = this.products.length;
        
        if (grid) {
            grid.innerHTML = this.products.length > 0 
                ? this.products.map(p => `
                    <div class="card-v2">
                        <div class="card-thumb">
                            <div class="img-placeholder"><i class="fa-solid fa-utensils"></i></div>
                            <div class="badge-time">${p.status === 'available' ? 'Đang bán' : 'Tạm ẩn'}</div>
                        </div>
                        <div class="card-details">
                            <h4 class="food-name">${p.name}</h4>
                            <div class="price-tag">$${p.price}</div>
                            <div class="card-bottom">
                                <label class="switch">
                                    <input type="checkbox" ${p.status === 'available' ? 'checked' : ''}>
                                    <span class="slider"></span>
                                </label>
                                <button class="btn btn-secondary btn-sm"><i class="fa-solid fa-pen"></i></button>
                            </div>
                        </div>
                    </div>
                `).join('')
                : '<p>Chưa có món ăn nào.</p>';
        }
    }

    render() {
        return `
            <style>
                @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                .main-content-area { display: flex; gap: 20px; padding: 20px; }
                .sidebar-wireframe { width: 250px; }
            </style>
            <div class="container main-content-area mt-20">
                <aside class="sidebar-wireframe">
                    <h3 class="filter-title">Quản lý Cửa hàng #${this.shopId}</h3>
                    <button class="btn btn-primary w-100 mb-10" id="btn-show-add-form" onclick="app.showForm('food')">
                        <i class="fa-solid fa-plus"></i> Thêm món mới
                    </button>
                    <p class="checkbox-row">Sản phẩm: <strong id="product-count">0</strong></p>
                </aside>

                <main class="product-section">
                    <div id="status-container"></div>

                    <div id="seller-form-display" class="order-card-modern" style="display:none; margin-bottom: 30px; border: 2px solid #ee4d2d; padding: 20px;">
                        <div id="form-inner-content"></div>
                        <div class="text-right mt-10" style="text-align:right">
                            <button class="btn btn-secondary" onclick="document.getElementById('seller-form-display').style.display='none'">Đóng</button>
                        </div>
                    </div>

                    <div class="section-head"><h3>Thực đơn từ Database</h3></div>
                    <div class="grid-v2"> <p>Đang tải dữ liệu...</p> </div>
                </main>
            </div>
        `;
    }

    afterRender() {
        this.loadData();
        const currentShopId = this.shopId;

        window.app = {
            showForm: (type) => {
                const display = document.getElementById('seller-form-display');
                const content = document.getElementById('form-inner-content');
                display.style.display = 'block';

                if (type === 'food') {
                    content.innerHTML = `
                        <h2 class="auth-title">Thêm món ăn</h2>
                        <div class="input-group"><input type="text" id="add-name" class="form-control" placeholder="Tên món"></div>
                        <div class="input-group"><input type="number" id="add-price" class="form-control" placeholder="Giá ($)"></div>
                        <div class="input-group"><input type="text" id="add-img" class="form-control" placeholder="Link hình ảnh"></div>
                        <button class="btn btn-primary w-100" id="btn-submit-test" onclick="app.submitFood()">Lưu món ăn</button>
                    `;
                }
            },

            submitFood: async () => {
                const name = document.getElementById('add-name').value;
                const price = document.getElementById('add-price').value;
                const image_url = document.getElementById('add-img').value;

                // DÙNG RENDER ALERT THAY CHO ALERT()
                if (!name || !price) {
                    this.renderAlert("Lỗi: Vui lòng nhập đầy đủ tên và giá!", "error");
                    return;
                }

                try {
                    const res = await fetch(`/FoodO/seller/${currentShopId}/add-food`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, price, image_url, category_id: 1 })
                    });
                    const result = await res.json();
                    
                    if (res.ok) {
                        this.renderAlert("Thành công: " + result.message, "success");
                        document.getElementById('seller-form-display').style.display = 'none';
                        this.loadData(); 
                    } else {
                        this.renderAlert("Lỗi: " + result.message, "error");
                    }
                } catch (err) {
                    this.renderAlert("Lỗi: Không thể kết nối Server!", "error");
                }
            }
        };
    }
}