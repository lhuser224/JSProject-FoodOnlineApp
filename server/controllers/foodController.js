const db = require('../config/db');

exports.getShopFoods = async (req, res) => {
    const { shopId } = req.params;
    try {
        // Sử dụng await vì đã có .promise() trong file config
        const [rows] = await db.query("SELECT * FROM foods WHERE shop_id = ?", [shopId]);
        res.json(rows);
    } catch (err) {
        console.error("Lỗi Database:", err);
        res.status(500).json({ message: "Không thể lấy dữ liệu từ MySQL" });
    }
};

exports.addFood = async (req, res) => {
    const { shopId } = req.params;
    const { name, price, image_url, category_id } = req.body;

    try {
        const sql = "INSERT INTO foods (name, price, image_url, shop_id, category_id) VALUES (?, ?, ?, ?, ?)";
        await db.query(sql, [name, price, image_url, shopId, category_id || 1]);
        
        res.status(200).json({ message: "Thêm món thành công!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi khi lưu vào Database!" });
    }
};