const express = require('express');
const router = express.Router();
const db = require('../db/db');
 

router.get('/', (req, res) => {
    const sql = "SELECT * FROM seats";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database fetch failed" });
        }
        res.json(result);
    });
});

//  GET: ดึงข้อมูลที่นั่งทั้งหมดของการแข่งขัน
router.get('/match/:match_id', (req, res) => {
    const matchId = req.params.match_id;
    const sql = "SELECT * FROM seats WHERE match_id = ?";

    db.query(sql, [matchId], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database fetch failed" });
        }
        res.json(result);
    });
});

//  GET: ดึงข้อมูลที่นั่งของแมตช์ตาม `seat_id`
router.get('/:id', (req, res) => {
    const seatId = req.params.id;
    const sql = "SELECT * FROM seats WHERE seat_id = ?";

    db.query(sql, [seatId], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database fetch failed" });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "Seat not found" });
        }
        res.json(result[0]);
    });
});

//  POST: เพิ่มที่นั่งใหม่
router.post('/', (req, res) => {
    const { match_id, zone, seat_number, price } = req.body;
    
    // ตรวจสอบว่าได้ส่งข้อมูลมาครบหรือไม่
    if (!match_id || !zone || !seat_number || price === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const sql = "INSERT INTO seats (match_id, zone, seat_number, status, price) VALUES (?, ?, ?, 'available', ?)";
    db.query(sql, [match_id, zone, seat_number, price], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database insert failed" });
        }
        res.status(201).json({ message: "Seat added successfully", seat_id: result.insertId });
    });
});

//  PUT: อัปเดตข้อมูลที่นั่งทั้งหมด (สามารถอัปเดตหลายฟิลด์ได้)
router.put('/:id', (req, res) => {
    const seatId = req.params.id;
    const { zone, seat_number, status, price } = req.body;

    // ตรวจสอบว่ามีการส่งข้อมูลมาหรือไม่
    if (!zone || !seat_number || !status || price === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const sql = `
        UPDATE seats 
        SET zone = ?, seat_number = ?, status = ?, price = ? 
        WHERE seat_id = ?
    `;

    db.query(sql, [zone, seat_number, status, price, seatId], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database update failed" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Seat not found" });
        }

        res.json({ message: "Seat updated successfully" });
    });
});

//  PUT: อัปเดตข้อมูลที่นั่งทั้งหมด (สามารถอัปเดตหลายฟิลด์ได้)
router.put('/match/:match_id', (req, res) => {
    const matchId = req.params.match_id;
    const { zone, seat_number, status, price } = req.body;

    // ตรวจสอบว่ามีการส่งข้อมูลมาหรือไม่
    if (!zone || !seat_number || !status || price === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const sql = `
        UPDATE seats 
        SET zone = ?, seat_number = ?, status = ?, price = ? 
        WHERE match_id = ?
    `;

    db.query(sql, [zone, seat_number, status, price, matchId], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database update failed" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "No seats found for the match" });
        }

        res.json({ message: "Seats updated successfully for the match" });
    });
});


//  DELETE: ลบที่นั่ง
router.delete('/:id', (req, res) => {
    const seatId = req.params.id;
    const sql = "DELETE FROM seats WHERE seat_id = ?";

    db.query(sql, [seatId], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database delete failed" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Seat not found" });
        }
        res.json({ message: "Seat deleted successfully" });
    });
});

module.exports = router;
