const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all
router.get('/', (req, res) => {
  db.query('SELECT * FROM product', (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// INSERT
router.post('/', (req, res) => {
  db.query('INSERT INTO product SET ?', req.body, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Product created', id: result.insertId });
  });
});

// UPDATE
router.put('/:id', (req, res) => {
  db.query(
    'UPDATE product SET ? WHERE product_id = ?',
    [req.body, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Product updated' });
    }
  );
});

// DELETE
router.delete('/:id', (req, res) => {
  db.query(
    'DELETE FROM product WHERE product_id = ?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Product deleted' });
    }
  );
});

module.exports = router;
