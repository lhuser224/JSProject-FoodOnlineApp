class AuthPage extends Component {
    constructor() {
        super();
        this.state = 'login'; // login | register | forgot
    }

    render() {
        let contentHTML = '';

        if (this.state === 'login') {
            contentHTML = `
                <h2 class="auth-title">Đăng nhập</h2>
                <p class="auth-subtitle">Chào mừng bạn quay lại!</p>
                
                <div class="input-group">
                    <i class="fa-solid fa-phone"></i>
                    <input type="text" placeholder="Số điện thoại" id="login-phone">
                </div>
                <div class="input-group">
                    <i class="fa-solid fa-lock"></i>
                    <input type="password" placeholder="Mật khẩu" id="login-pass">
                    <i class="fa-solid fa-eye show-pass"></i>
                </div>
                
                <div class="auth-actions">
                    <label><input type="checkbox"> Ghi nhớ tôi</label>
                    <a href="#" id="link-forgot" class="link-highlight">Quên mật khẩu?</a>
                </div>

                <button class="btn btn-primary w-100 btn-auth" id="btn-login">Đăng nhập</button>
                
                <div class="auth-footer">
                    Chưa có tài khoản? <a href="#" id="link-register" class="link-highlight">Đăng ký ngay</a>
                </div>
            `;
        } else if (this.state === 'register') {
            contentHTML = `
                <h2 class="auth-title">Tạo tài khoản</h2>
                <p class="auth-subtitle">Tham gia cộng đồng Food App ngay</p>
                
                <div class="input-group">
                    <i class="fa-solid fa-user"></i>
                    <input type="text" placeholder="Họ và tên">
                </div>
                <div class="input-group">
                    <i class="fa-solid fa-phone"></i>
                    <input type="text" placeholder="Số điện thoại">
                </div>
                <div class="input-group">
                    <i class="fa-solid fa-lock"></i>
                    <input type="password" placeholder="Mật khẩu">
                </div>
                <div class="input-group">
                    <i class="fa-solid fa-lock"></i>
                    <input type="password" placeholder="Nhập lại mật khẩu">
                </div>

                <button class="btn btn-primary w-100 btn-auth" id="btn-register-submit">Đăng ký</button>
                
                <div class="auth-footer">
                    Đã có tài khoản? <a href="#" id="link-login" class="link-highlight">Đăng nhập</a>
                </div>
            `;
        } else if (this.state === 'forgot') {
            contentHTML = `
                <h2 class="auth-title">Quên mật khẩu?</h2>
                <p class="auth-subtitle">Nhập SĐT để nhận mã OTP</p>
                
                <div class="input-group">
                    <i class="fa-solid fa-phone"></i>
                    <input type="text" placeholder="Số điện thoại đã đăng ký">
                </div>

                <button class="btn btn-primary w-100 btn-auth" id="btn-forgot-submit">Gửi mã xác nhận</button>
                
                <div class="auth-footer">
                    <a href="#" id="link-back-login" class="link-highlight"><i class="fa-solid fa-arrow-left"></i> Quay lại đăng nhập</a>
                </div>
            `;
        }

        return `
            <div class="auth-wrapper">
                <div class="auth-bg">
                    <div class="auth-bg-overlay">
                        <h1>Food App</h1>
                        <p>Đặt món thả ga - Freeship tận nhà</p>
                    </div>
                </div>

                <div class="auth-form-container">
                    <div class="auth-box-modern">
                        ${contentHTML}
                        <div class="divider"><span>Hoặc đăng nhập bằng</span></div>
                        <div class="social-login">
                            <button class="btn-social google"><i class="fa-brands fa-google"></i> Google</button>
                            <button class="btn-social facebook"><i class="fa-brands fa-facebook-f"></i> Facebook</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    afterRender() {
        // Helper để chuyển state và render lại
        const switchState = (newState) => {
            this.state = newState;
            Router.navigate(this); // Re-render chính component này
        };

        // Gắn sự kiện chuyển trang
        if(document.getElementById('link-register')) 
            document.getElementById('link-register').onclick = (e) => { e.preventDefault(); switchState('register'); };
        
        if(document.getElementById('link-login')) 
            document.getElementById('link-login').onclick = (e) => { e.preventDefault(); switchState('login'); };
        
        if(document.getElementById('link-forgot')) 
            document.getElementById('link-forgot').onclick = (e) => { e.preventDefault(); switchState('forgot'); };

        if(document.getElementById('link-back-login')) 
            document.getElementById('link-back-login').onclick = (e) => { e.preventDefault(); switchState('login'); };

        // Xử lý nút Login
        const btnLogin = document.getElementById('btn-login');
        if (btnLogin) {
            btnLogin.onclick = () => {
                // Giả lập login thành công
                alert("Đăng nhập thành công!");
                Router.navigate(new HomePage());
            };
        }
        
        // Nút quay lại trang chủ (nếu muốn thoát)
        // Bạn có thể thêm nút "X" ở góc nếu cần
    }
}