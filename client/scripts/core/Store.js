class Store {
    constructor() {
        if (Store.instance) return Store.instance;
        Store.instance = this;
        
        this.cart = []; // Giỏ hàng hiện tại
        this.orders = []; // LỊCH SỬ ĐƠN HÀNG (Mới thêm)
        
        // Danh sách sản phẩm giữ nguyên
        this.products = [
            { id: 1, name: "Burger King Special", price: 10.00, address: "123 Street" },
            { id: 2, name: "Pizza Hut Deluxe", price: 15.00, address: "456 Avenue" },
            { id: 3, name: "Fried Chicken Combo", price: 8.50, address: "789 Road" },
            { id: 4, name: "Milk Tea Full Topping", price: 4.00, address: "321 Lane" },
            { id: 5, name: "Beef Noodle", price: 6.00, address: "654 Way" },
            { id: 6, name: "Spaghetti Bolognese", price: 12.00, address: "987 Blvd" }
        ];
    }

    getProducts() { return this.products; }
    
    // --- CART METHODS ---
    getCart() { return this.cart; }
    
    addToCart(product) {
        this.cart.push(product);
    }

    removeFromCart(index) {
        this.cart.splice(index, 1);
    }

    clearCart() { this.cart = []; }
    
    getCartTotal() {
        return this.cart.reduce((total, item) => total + item.price, 0);
    }

    // --- ORDER HISTORY METHODS (MỚI) ---
    getOrders() { return this.orders; }
    
    addOrder(order) {
        // Thêm đơn mới vào đầu danh sách
        this.orders.unshift(order);
    }
}