const express = require('express');
const router = express.Router();
const db = require('../db/db');

//  GET: ดึงข้อมูลการจองทั้งหมด
router.get('/', (req, res) => {
    const sql = "SELECT * FROM bookings";

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database fetch failed" });
        }
        res.json(result);
    });
});

//  GET: ดึงข้อมูลการจองตาม booking_id
router.get('/:id', (req, res) => {
    const bookingId = req.params.id;
    const sql = "SELECT * FROM bookings WHERE booking_id = ?";

    db.query(sql, [bookingId], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database fetch failed" });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "Booking not found" });
        }
        res.json(result[0]);
    });
});

//  POST: สร้างการจองใหม่
router.post('/', (req, res) => {
    const { user_id, match_id, seat_ids, total_amount } = req.body;

    // ตรวจสอบว่าได้ส่งข้อมูลมาครบหรือไม่
    if (!user_id || !match_id || !seat_ids || !total_amount) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const sql = "INSERT INTO bookings (user_id, match_id, seat_ids, total_amount, payment_status) VALUES (?, ?, ?, ?, 'pending')";
    db.query(sql, [user_id, match_id, seat_ids, total_amount], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database insert failed" });
        }
        res.status(201).json({ message: "Booking created successfully", booking_id: result.insertId });
    });
});

//  PUT: อัปเดตการจอง 
router.put('/:id', (req, res) => {
    const bookingId = req.params.id;
    const { seat_ids, total_amount, payment_status } = req.body;

    // ตรวจสอบว่ามีการส่งข้อมูลมาหรือไม่
    if (!seat_ids || !total_amount || !payment_status) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const sql = `
        UPDATE bookings 
        SET seat_ids = ?, total_amount = ?, payment_status = ? 
        WHERE booking_id = ?
    `;

    db.query(sql, [seat_ids, total_amount, payment_status, bookingId], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database update failed" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Booking not found" });
        }

        res.json({ message: "Booking updated successfully" });
    });
});

//  DELETE: ลบการจอง
router.delete('/:id', (req, res) => {
    const bookingId = req.params.id;
    const sql = "DELETE FROM bookings WHERE booking_id = ?";

    db.query(sql, [bookingId], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database delete failed" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Booking not found" });
        }
        res.json({ message: "Booking deleted successfully" });
    });
});

module.exports = router;
