const express = require('express');
const router = express.Router();
const db = require('../db');

// contoh ambil semua data dari tabel
router.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

module.exports = router;
