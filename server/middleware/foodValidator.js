const db = require('../config/db');

const validateFood = async (req, res, next) => {
    const { name, price } = req.body;
    const { shopId } = req.params;

    // 1. Kiểm tra trống (TC 01)
    if (!name || name.trim() === "" || !price) {
        return res.status(400).json({ message: "Tên và giá không được để trống!" });
    }

    // 2. Kiểm tra định dạng số (TC 02)
    if (!price || isNaN(price)) {
        return res.status(400).json({ message: "Giá phải là một con số!" });
    }

    // 3. Kiểm tra giá trị dương (TC 03)
    if (Number(price) <= 0) {
        return res.status(400).json({ message: "Giá phải lớn hơn 0!" });
    }

    // 4. Kiểm tra ký tự đặc biệt (TC 04)
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (specialCharRegex.test(name)) {
        return res.status(400).json({ message: "Tên món không được chứa ký tự đặc biệt!" });
    }

    // 5. Kiểm tra trùng lặp (TC 05) - Không dùng ALTER TABLE
    try {
        const [rows] = await db.query(
            "SELECT id FROM foods WHERE shop_id = ? AND name = ?", 
            [shopId, name]
        );
        if (rows.length > 0) {
            return res.status(409).json({ message: "Món này đã tồn tại trong thực đơn!" });
        }
        
        // Nếu qua hết các cửa ải, cho phép đi tiếp vào Controller
        next();
    } catch (err) {
        res.status(500).json({ message: "Lỗi kiểm tra dữ liệu!" });
    }
};

module.exports = { validateFood };