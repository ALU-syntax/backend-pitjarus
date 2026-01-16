const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM store_account', (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  db.query('INSERT INTO store_account SET ?', req.body, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ id: result.insertId });
  });
});

router.put('/:id', (req, res) => {
  db.query(
    'UPDATE store_account SET ? WHERE account_id = ?',
    [req.body, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Account updated' });
    }
  );
});

router.delete('/:id', (req, res) => {
  db.query(
    'DELETE FROM store_account WHERE account_id = ?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Account deleted' });
    }
  );
});

module.exports = router;
