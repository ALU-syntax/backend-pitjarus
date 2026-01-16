const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM product_brand', (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  db.query('INSERT INTO product_brand SET ?', req.body, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ id: result.insertId });
  });
});

router.put('/:id', (req, res) => {
  db.query(
    'UPDATE product_brand SET ? WHERE brand_id = ?',
    [req.body, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Brand updated' });
    }
  );
});

router.delete('/:id', (req, res) => {
  db.query(
    'DELETE FROM product_brand WHERE brand_id = ?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Brand deleted' });
    }
  );
});

module.exports = router;
