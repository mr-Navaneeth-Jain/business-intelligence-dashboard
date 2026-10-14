const express = require("express");
const pool = require("../config/db");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM sales ORDER BY order_date DESC"
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch sales data"
        });
    }
});

router.get("/summary", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                SUM(quantity * price) AS total_revenue,
                SUM(quantity) AS total_units,
                COUNT(*) AS total_orders,
                COUNT(DISTINCT customer) AS total_customers
            FROM sales
        `);

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch dashboard summary"
        });
    }
});

router.get("/monthly", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                TO_CHAR(order_date, 'YYYY-MM') AS month,
                SUM(quantity * price) AS revenue
            FROM sales
            GROUP BY month
            ORDER BY month
        `);

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch monthly revenue"
        });
    }
});

router.get("/categories", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                category,
                SUM(quantity * price) AS revenue
            FROM sales
            GROUP BY category
            ORDER BY revenue DESC
        `);

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch category data"
        });
    }
});

module.exports = router;
