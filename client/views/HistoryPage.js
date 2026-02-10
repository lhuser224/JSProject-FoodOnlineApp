class HistoryPage extends Component {
    constructor() {
        super();
        this.selectedOrderId = null;
    }

    isCancellable(orderDateStr) {
        // Parse ngày giờ chuẩn xác hơn
        const orderTime = new Date(orderDateStr).getTime();
        const currentTime = new Date().getTime();
        return (currentTime - orderTime) < 60000; // 60 giây
    }

    render() {
        const navbarHTML = new Navbar().render();
        const orders = this.store.getOrders();

        // 1. Nếu chưa có đơn hàng
        if (orders.length === 0) {
            return `
                ${navbarHTML}
                <div class="container main-content-area">
                    <div class="history-empty-state">
                        <img src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" alt="Empty" width="120">
                        <h3>Chưa có đơn hàng nào</h3>
                        <p>Hãy đặt món ăn ngon ngay bây giờ!</p>
                        <button class="btn btn-primary mt-20" id="btn-go-shopping">Đặt món ngay</button>
                    </div>
                </div>
            `;
        }

        // 2. Nếu có đơn hàng
        return `
            ${navbarHTML}
            <div class="container main-content-area history-layout">
                <h2 class="page-title">Lịch sử đơn hàng</h2>
                
                <div class="history-tabs-modern">
                    <button class="tab-modern active">Tất cả</button>
                    <button class="tab-modern">Đang xử lý</button>
                    <button class="tab-modern">Đã giao</button>
                    <button class="tab-modern">Đã hủy</button>
                </div>

                <div class="order-list-container">
                    ${orders.map(order => {
                        const canCancel = this.isCancellable(order.date) && order.status === 'Processing';
                        
                        let statusBadge = '';
                        if(order.status === 'Processing') statusBadge = '<span class="badge badge-warning">Đang xử lý</span>';
                        if(order.status === 'Cancelled') statusBadge = '<span class="badge badge-danger">Đã hủy</span>';
                        if(order.status === 'Delivered') statusBadge = '<span class="badge badge-success">Đã giao</span>';

                        return `
                        <div class="order-card-modern">
                            <div class="order-header">
                                <div class="order-info-left">
                                    <span class="shop-name-small"><i class="fa-solid fa-store"></i> Food Order App</span>
                                    <span class="order-id">ID: ${order.id}</span>
                                </div>
                                <div class="order-status-right">
                                    ${statusBadge}
                                    ${canCancel ? '<span class="countdown-hint"><i class="fa-regular fa-clock"></i> Có thể hủy trong 1 phút</span>' : ''}
                                </div>
                            </div>

                            <div class="order-items-wrap">
                                ${order.items.map(item => `
                                    <div class="order-item-row">
                                        <div class="item-img-small"><i class="fa-solid fa-utensils"></i></div>
                                        <div class="item-detail">
                                            <div class="item-name">${item.name}</div>
                                            <div class="item-price">x1 &nbsp; $${item.price.toFixed(2)}</div>
                                        </div>
                                        <div class="item-total-price">$${item.price.toFixed(2)}</div>
                                    </div>
                                `).join('')}
                            </div>

                            ${order.cancelReason ? `
                                <div class="cancel-reason-box">
                                    <i class="fa-solid fa-circle-info"></i> Lý do hủy: ${order.cancelReason}
                                </div>
                            ` : ''}

                            <div class="order-footer">
                                <div class="total-money">
                                    Tổng tiền: <span>$${order.total.toFixed(2)}</span>
                                </div>
                                <div class="footer-actions">
                                    <button class="btn btn-secondary">Mua lại</button>
                                    ${canCancel ? `
                                        <button class="btn btn-danger btn-open-cancel" data-id="${order.id}">Hủy đơn</button>
                                    ` : '<button class="btn btn-secondary" disabled>Chi tiết</button>'}
                                </div>
                            </div>
                        </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <div id="cancel-modal" class="modal-overlay" style="display: none;">
                <div class="modal-content modal-sm">
                    <h3 class="modal-title">Hủy đơn hàng?</h3>
                    <p>Đơn hàng sẽ bị hủy và không thể khôi phục.</p>
                    
                    <div class="form-group text-left">
                        <label>Lý do hủy:</label>
                        <select id="cancel-reason" class="form-control">
                            <option value="">-- Chọn lý do --</option>
                            <option value="Thay đổi ý định">Thay đổi ý định</option>
                            <option value="Tìm thấy giá rẻ hơn">Tìm thấy giá rẻ hơn</option>
                            <option value="Thời gian giao quá lâu">Thời gian giao quá lâu</option>
                            <option value="Khác">Khác</option>
                        </select>
                    </div>

                    <div class="modal-actions">
                        <button class="btn btn-secondary" id="btn-close-modal">Không</button>
                        <button class="btn btn-danger" id="btn-confirm-cancel">Đồng ý hủy</button>
                    </div>
                </div>
            </div>
        `;
    }

    afterRender() {
        new Navbar().bindEvents();

        // Nút đặt món khi danh sách trống
        if(document.getElementById('btn-go-shopping')) {
            document.getElementById('btn-go-shopping').onclick = () => Router.navigate(new HomePage());
        }

        // Modal Logic
        const modal = document.getElementById('cancel-modal');
        
        document.querySelectorAll('.btn-open-cancel').forEach(btn => {
            btn.onclick = (e) => {
                this.selectedOrderId = e.currentTarget.dataset.id;
                modal.style.display = 'flex';
            }
        });

        document.getElementById('btn-close-modal').onclick = () => {
            modal.style.display = 'none';
        };

        document.getElementById('btn-confirm-cancel').onclick = () => {
            const reason = document.getElementById('cancel-reason').value;
            if(!reason) return alert("Vui lòng chọn lý do!");

            const order = this.store.getOrders().find(o => o.id === this.selectedOrderId);
            if(order) {
                if(this.isCancellable(order.date)) {
                    order.status = 'Cancelled';
                    order.cancelReason = reason;
                    alert("Đã hủy đơn thành công");
                } else {
                    alert("Đã quá thời gian hủy đơn!");
                }
            }
            modal.style.display = 'none';
            Router.navigate(new HistoryPage());
        };

        // Auto refresh sau 60s để update trạng thái nút hủy
        setTimeout(() => {
             if(modal.style.display === 'none') Router.navigate(new HistoryPage());
        }, 60000);
    }
}