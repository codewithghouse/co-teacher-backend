const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
    res.json({ message: "Backend Express + Firebase Connected ✅" });
});

module.exports = router;
