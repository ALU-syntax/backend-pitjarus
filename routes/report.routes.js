const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM report_product', (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

router.post('/', (req, res) => {
    db.query('INSERT INTO report_product SET ?', req.body, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({
            id: result.insertId
        });
    });
});

router.put('/:id', (req, res) => {
    db.query(
        'UPDATE report_product SET ? WHERE report_id = ?',
        [req.body, req.params.id],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({
                message: 'Report updated'
            });
        }
    );
});

router.delete('/:id', (req, res) => {
    db.query(
        'DELETE FROM report_product WHERE report_id = ?',
        [req.params.id],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({
                message: 'Report deleted'
            });
        }
    );
});

router.post('/area-summary', (req, res) => {
    const {
        store_ids,
        start_date,
        end_date
    } = req.body;

    const startDate = start_date.year.toString() + "-" + start_date.month.toString() + "-" + start_date.day.toString();
    const endDate = end_date.year.toString() + "-" + end_date.month.toString() + "-" + end_date.day.toString(); 
    
    // console.log("masok")
    console.log(req.body)
    // ==========================
    // VALIDASI INPUT
    // ==========================
    if (!Array.isArray(store_ids) || store_ids.length === 0) {
        return res.status(400).json({
            message: 'store_ids harus berupa array dan tidak boleh kosong'
        });
    }

    if (!start_date || !end_date) {
        return res.status(400).json({
            message: 'start_date dan end_date wajib diisi'
        });
    }

    // pastikan semua store_id adalah number
    const validStoreIds = store_ids.every(id => Number.isInteger(id));
    if (!validStoreIds) {
        return res.status(400).json({
            message: 'store_ids harus berupa array number'
        });
    }

    // ==========================
    // QUERY SQL
    // ==========================
    const sql = `
    SELECT 
      sa.area_id,
      sa.area_name,
      COALESCE(SUM(rp.compliance), 0) AS compliance,
      COALESCE(
        SUM(rp.compliance) / NULLIF(COUNT(rp.store_id), 0) * 100,
        0
      ) AS calculation
    FROM store_area sa
    LEFT JOIN store s 
      ON s.area_id = sa.area_id
    LEFT JOIN report_product rp 
      ON rp.store_id = s.store_id
      AND rp.tanggal BETWEEN ? AND ?
      AND rp.store_id IN (?)
    GROUP BY sa.area_id, sa.area_name
    ORDER BY sa.area_id ASC
  `;

    db.query(sql, [startDate, endDate, store_ids], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: 'Database error',
                error: err
            });
        }

        res.json(rows);
    });
});

module.exports = router;