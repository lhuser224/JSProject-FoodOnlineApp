class Router {
    static navigate(componentInstance) {
        const app = document.getElementById('app');
        // Render HTML mới
        app.innerHTML = componentInstance.render();
        // Gắn sự kiện JS
        componentInstance.afterRender();
        // Cuộn lên đầu trang
        window.scrollTo(0, 0);
    }
}