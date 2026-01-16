const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM store', (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  db.query('INSERT INTO store SET ?', req.body, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ id: result.insertId });
  });
});

router.put('/:id', (req, res) => {
  db.query(
    'UPDATE store SET ? WHERE store_id = ?',
    [req.body, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Store updated' });
    }
  );
});

router.delete('/:id', (req, res) => {
  db.query(
    'DELETE FROM store WHERE store_id = ?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Store deleted' });
    }
  );
});

module.exports = router;
