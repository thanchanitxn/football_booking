const express = require('express');
const router = express.Router();
const db = require('../db/db');

//  GET: ดึงข้อมูลการแข่งขันทั้งหมด
router.get('/', (req, res) => {
    const sql = "SELECT * FROM matches";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database fetch failed" });
        }
        res.json(result);
    });
});

//  GET: ดึงข้อมูลการแข่งขันเดี่ยว
router.get('/:id', (req, res) => {
    const matchId = req.params.id;
    console.log("Fetching Match ID:", matchId);  

    const sql = "SELECT * FROM matches WHERE match_id = ?";
    db.query(sql, [matchId], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database fetch failed" });
        }
        if (result.length === 0) {
            console.warn("Match not found:", matchId);  
            return res.status(404).json({ error: "Match not found" });
        }
        res.json(result[0]); 
    });
});

//  POST: เพิ่มข้อมูลการแข่งขัน
router.post('/', (req, res) => {
    const { home_team, away_team, match_date, match_time, stadium } = req.body;

    console.log("Received Data:", req.body);  

    // ตรวจสอบว่าค่าทั้งหมดถูกส่งมาครบ
    if (!home_team || !away_team || !match_date || !match_time || !stadium) {
        console.warn("Missing required fields:", req.body);  
        return res.status(400).json({ error: "Missing required fields" });
    }

    const sql = "INSERT INTO matches (match_date, match_time, home_team, away_team, stadium) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [match_date, match_time, home_team, away_team, stadium], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database insert failed" });
        }
        console.log("Match added successfully:", result.insertId);  
        res.status(201).json({ message: "Match added successfully!" });
    });
});

//  PUT: แก้ไขข้อมูลการแข่งขัน
router.put('/:id', (req, res) => {
    const matchId = req.params.id;
    const { home_team, away_team, match_date, match_time, stadium } = req.body;

    console.log("Updating Match ID:", matchId);  
    console.log("Updated Data:", req.body);  

    // เช็คว่าข้อมูลครบหรือไม่
    if (!home_team || !away_team || !match_date || !match_time || !stadium) {
        console.warn("Missing required fields:", req.body); 
        return res.status(400).json({ error: "Missing required fields" });
    }

    const sql = "UPDATE matches SET home_team = ?, away_team = ?, match_date = ?, match_time = ?, stadium = ? WHERE match_id = ?";
    db.query(sql, [home_team, away_team, match_date, match_time, stadium, matchId], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database update failed" });
        }
        console.log("Match updated successfully:", matchId);  
        res.json({ message: "Match updated successfully!" });
    });
});

//  DELETE: ลบข้อมูลการแข่งขัน
router.delete('/:id', (req, res) => {
    const matchId = req.params.id;
    console.log("Deleting Match ID:", matchId);  

    const sql = "DELETE FROM matches WHERE match_id = ?";
    db.query(sql, [matchId], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database delete failed" });
        }
        console.log("Match deleted successfully:", matchId);  
        res.json({ message: "Match deleted successfully!" });
    });
});

module.exports = router;
