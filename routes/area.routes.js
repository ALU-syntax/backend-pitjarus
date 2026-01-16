const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM store_area', (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  db.query('INSERT INTO store_area SET ?', req.body, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ id: result.insertId });
  });
});

router.put('/:id', (req, res) => {
  db.query(
    'UPDATE store_area SET ? WHERE area_id = ?',
    [req.body, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Area updated' });
    }
  );
});

router.delete('/:id', (req, res) => {
  db.query(
    'DELETE FROM store_area WHERE area_id = ?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Area deleted' });
    }
  );
});

module.exports = router;
