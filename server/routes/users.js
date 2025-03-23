const express = require('express');
const router = express.Router();
const db = require('../db/db');

//  GET: ดึงข้อมูลผู้ใช้ทั้งหมด
router.get('/', (req, res) => {
    const sql = "SELECT * FROM users";
    
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database fetch failed" });
        }
        res.json(result);
    });
});

//  GET: ดึงข้อมูลผู้ใช้โดย user_id
router.get('/:id', (req, res) => {
    const userId = req.params.id;
    const sql = "SELECT * FROM users WHERE user_id = ?";
    
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

//  POST: เพิ่มผู้ใช้ใหม่
router.post('/', (req, res) => {
    const { first_name, last_name, email, phone } = req.body;
    
    // ตรวจสอบว่ามีข้อมูลครบหรือไม่
    if (!first_name || !last_name || !email || !phone) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const sql = "INSERT INTO users (first_name, last_name, email, phone) VALUES (?, ?, ?, ?)";
    db.query(sql, [first_name, last_name, email, phone], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database insert failed" });
        }
        res.status(201).json({ message: "User added successfully", user_id: result.insertId });
    });
});

// PUT: อัปเดตข้อมูลผู้ใช้
router.put('/:id', (req, res) => {
    const userId = req.params.id;
    const { first_name, last_name, email, phone } = req.body;

    // ตรวจสอบว่ามีการส่งข้อมูลมาหรือไม่
    if (!first_name || !last_name || !email || !phone) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const sql = "UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE user_id = ?";
    
    db.query(sql, [first_name, last_name, email, phone, userId], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database update failed" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User updated successfully" });
    });
});

//  DELETE: ลบผู้ใช้
router.delete('/:id', (req, res) => {
    const userId = req.params.id;
    const sql = "DELETE FROM users WHERE user_id = ?";

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