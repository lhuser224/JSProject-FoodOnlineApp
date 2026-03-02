// scripts/main.js
const initApp = () => {
    const path = window.location.pathname;
    const container = document.getElementById('app');

    // 1. Kiểm tra trang Seller trước
    const sellerMatch = path.match(/\/FoodO\/seller\/(\d+)/);
    
    if (sellerMatch) {
        const shopId = sellerMatch[1];
        const page = new SellerDashboard(shopId);
        container.innerHTML = page.render();
        page.afterRender();
    } 
    // 2. Nếu không phải seller thì mới về HomePage
    else {
        const page = new HomePage();
        container.innerHTML = page.render();
        if (page.afterRender) page.afterRender();
    }
};

window.onpopstate = initApp;
initApp();