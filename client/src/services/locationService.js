const locationService = {
  // Kiểm tra xem Shop và User có cùng Tỉnh/Thành không
  isDeliverable: (shop, userAddr) => {
    if (!shop || !userAddr) return { ok: false, msg: "Thiếu thông tin địa chỉ" };
    
    // Chuẩn hóa chuỗi (xóa khoảng trắng, viết thường) để so sánh chính xác hơn
    const sProv = shop.province?.trim().toLowerCase();
    const uProv = userAddr.province?.trim().toLowerCase();

    if (sProv !== uProv) {
      return { 
        ok: false, 
        msg: `Cửa hàng ở ${shop.province}, không hỗ trợ giao đến ${userAddr.province}` 
      };
    }
    return { ok: true, msg: "" };
  }
};

export default locationService;