class Navbar extends Component {
    render() {
        const count = this.store.getCart().length;
        return `
            <nav class="navbar">
                <div class="nav-logo" id="nav-home">Food App</div>
                <div class="nav-links">
                    <i class="fa-solid fa-user" id="nav-auth"></i>
                    <i class="fa-solid fa-clock-rotate-left" id="nav-history"></i>
                    <i class="fa-solid fa-cart-shopping" id="nav-checkout">
                        <span id="cart-badge">${count}</span>
                    </i>
                </div>
            </nav>
        `;
    }

    bindEvents() {
        document.getElementById('nav-home').onclick = () => Router.navigate(new HomePage());
        document.getElementById('nav-checkout').onclick = () => Router.navigate(new CheckoutPage());
        document.getElementById('nav-history').onclick = () => Router.navigate(new SellerDashboard());
        document.getElementById('nav-auth').onclick = () => Router.navigate(new AuthPage());
    }
}