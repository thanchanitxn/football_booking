const express = require('express');
const router = express.Router();
const db = require('../db/db');
const bcrypt = require('bcryptjs');

//  GET: ดึงข้อมูลผู้ใช้ทั้งหมด (ไม่คืนค่ารหัสผ่านเพื่อความปลอดภัย)
router.get('/', (req, res) => {
    const sql = "SELECT id, name, email, created_at FROM registers";
    
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database fetch failed" });
        }
        res.json(result);
    });
});

//  GET: ดึงข้อมูลผู้ใช้โดย id (ไม่ส่งคืนรหัสผ่าน)
router.get('/:id', (req, res) => {
    const userId = req.params.id;
    const sql = "SELECT id, name, email, created_at FROM registers WHERE id = ?";
    
    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database fetch failed" });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(result[0]);
    });
});

//  POST: ลงทะเบียนผู้ใช้ใหม่ Hash รหัสผ่านก่อนบันทึก
router.post('/', async (req, res) => {
    const { name, email, password } = req.body;
    
    // ตรวจสอบว่ามีข้อมูลครบหรือไม่
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // **Hash รหัสผ่าน**
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO registers (name, email, password) VALUES (?, ?, ?)";
        db.query(sql, [name, email, hashedPassword], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ error: "Database insert failed" });
            }
            res.status(201).json({ message: "User registered successfully", id: result.insertId });
        });

    } catch (error) {
        console.error("Hashing Error:", error);
        return res.status(500).json({ error: "Error hashing password" });
    }
});

//  PUT: อัปเดตข้อมูลผู้ใช้ อัปเดตรหัสผ่านต้อง Hash ใหม่
router.put('/:id', async (req, res) => {
    const userId = req.params.id;
    const { name, email, password } = req.body;

    // ตรวจสอบว่ามีการส่งข้อมูลมาหรือไม่
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // **Hash รหัสผ่านใหม่**
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "UPDATE registers SET name = ?, email = ?, password = ? WHERE id = ?";
        db.query(sql, [name, email, hashedPassword, userId], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ error: "Database update failed" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            res.json({ message: "User updated successfully" });
        });

    } catch (error) {
        console.error("Hashing Error:", error);
        return res.status(500).json({ error: "Error hashing password" });
    }
});

//  DELETE: ลบผู้ใช้
router.delete('/:id', (req, res) => {
    const userId = req.params.id;
    const sql = "DELETE FROM registers WHERE id = ?";

    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database delete failed" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    });
});

module.exports = router;
