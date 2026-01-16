const express = require('express');
const router = express.Router();
const db = require('../db');

function buildDynamicTable(data) {
    // 1. Ambil area unik
    const areas = [...new Set(data.map(item => item.area_name))];

    // 2. Ambil brand unik
    const brands = [...new Set(data.map(item => item.brand_name))];

    // 3. Bangun rows
    const rows = brands.map(brand => {
        const row = {
            brand
        };

        areas.forEach(area => {
            const found = data.find(
                item => item.brand_name === brand && item.area_name === area
            );

            row[area] = found ? found.compliance.toString() + "%" : 0;
        });

        return row;
    });

    return {
        columns: ["BRAND", ...areas],
        rows
    };
}

router.post('/brand-area-summary', (req, res) => {
    const {
        store_ids,
        start_date,
        end_date
    } = req.body;

    const startDate = start_date.year.toString() + "-" + start_date.month.toString() + "-" + start_date.day.toString();
    const endDate = end_date.year.toString() + "-" + end_date.month.toString() + "-" + end_date.day.toString();

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

    const sql = `SELECT 
            b.brand_name,
            sa.area_id,
            sa.area_name,
            COALESCE(SUM(rp.compliance), 0) AS compliance,
            COUNT(rp.store_id) AS count,
            COALESCE(
                SUM(rp.compliance) / NULLIF(COUNT(rp.store_id), 0) * 100,
                0
            ) AS calculation
        FROM product_brand b
        CROSS JOIN store_area sa   
        LEFT JOIN product p 
            ON p.brand_id = b.brand_id
        LEFT JOIN report_product rp 
            ON rp.product_id = p.product_id
            AND rp.tanggal BETWEEN ? AND ?
            AND rp.store_id IN (?)
        LEFT JOIN store s 
            ON s.store_id = rp.store_id
            AND s.area_id = sa.area_id
        GROUP BY b.brand_name, sa.area_id, sa.area_name
        ORDER BY b.brand_name, sa.area_id;`;

    db.query(sql, [startDate, endDate, store_ids], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Database error",
                error: err
            })
        }

        const result = buildDynamicTable(rows);
        res.json(result);
    })
})


router.post('/area-summary', (req, res) => {
    const {
        store_ids,
        start_date,
        end_date
    } = req.body;

    const startDate = start_date.year.toString() + "-" + start_date.month.toString() + "-" + start_date.day.toString();
    const endDate = end_date.year.toString() + "-" + end_date.month.toString() + "-" + end_date.day.toString();

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