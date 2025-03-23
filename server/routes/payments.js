const express = require('express');
const router = express.Router();
const db = require('../db/db');

// GET: ดึงข้อมูลการชำระเงินทั้งหมด
router.get('/', (req, res) => {
    const sql = "SELECT * FROM payments";

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database fetch failed" });
        }
        res.json(result);
    });
});

// GET: ดึงข้อมูลการชำระเงินตาม `payment_id`
router.get('/:id', (req, res) => {
    const paymentId = req.params.id;
    const sql = "SELECT * FROM payments WHERE payment_id = ?";

    db.query(sql, [paymentId], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database fetch failed" });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "Payment not found" });
        }
        res.json(result[0]);
    });
});

// POST: เพิ่มข้อมูลการชำระเงินใหม่
router.post('/', (req, res) => {
    const { booking_id, payment_method, amount, payment_status } = req.body;

    // ตรวจสอบว่ามีการส่งข้อมูลมาหรือไม่
    if (!booking_id || !payment_method || !amount || !payment_status) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const sql = "INSERT INTO payments (booking_id, payment_method, amount, payment_status) VALUES (?, ?, ?, ?)";
    db.query(sql, [booking_id, payment_method, amount, payment_status], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database insert failed" });
        }
        res.status(201).json({ message: "Payment added successfully", payment_id: result.insertId });
    });
});

// PUT: อัปเดตข้อมูลการชำระเงิน
router.put('/:id', (req, res) => {
    const paymentId = req.params.id;
    const { booking_id, payment_method, amount, payment_status } = req.body;

    // ตรวจสอบว่ามีการส่งข้อมูลมาหรือไม่
    if (!booking_id || !payment_method || !amount || !payment_status) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const sql = `
        UPDATE payments 
        SET booking_id = ?, payment_method = ?, amount = ?, payment_status = ? 
        WHERE payment_id = ?
    `;

    db.query(sql, [booking_id, payment_method, amount, payment_status, paymentId], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database update failed" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Payment not found" });
        }

        res.json({ message: "Payment updated successfully" });
    });
});

// DELETE: ลบข้อมูลการชำระเงิน
router.delete('/:id', (req, res) => {
    const paymentId = req.params.id;
    const sql = "DELETE FROM payments WHERE payment_id = ?";

    db.query(sql, [paymentId], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database delete failed" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Payment not found" });
        }
        res.json({ message: "Payment deleted successfully" });
    });
});

module.exports = router;
