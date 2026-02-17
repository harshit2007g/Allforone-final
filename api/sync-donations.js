const syncDonations = require("../syncdonation");

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // Admin secret check
    if (req.headers["x-admin-key"] !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ error: "Forbidden" });
    }

    try {
        console.log("server route hit!");
        await syncDonations();
        return res.json({ success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false });
    }
};
