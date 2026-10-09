const express = require("express");
const cors = require("cors");
require("dotenv").config();

const salesRoutes = require("./routes/salesRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Sales API routes
app.use("/api/sales", salesRoutes);

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Business Intelligence Dashboard API is running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});