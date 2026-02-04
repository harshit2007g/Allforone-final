require("dotenv").config();
const express = require("express");
const cors = require("cors");
const syncDonations = require("./syncdonation");
const port = 5000;
const app = express();
app.use(cors());
app.use(express.json());

app.post("/sync-donations", async (req, res) => {
    try {
        await syncDonations();
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

app.listen(port, () => {
    console.log("Server running on port ",port);
});

app.post("/sync-donations", async (req, res) => {
    if (req.headers["x-admin-key"] !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ error: "Forbidden" });
    }
    console.log("server route hit!");
    await syncDonations();
    res.json({ success: true });
});
