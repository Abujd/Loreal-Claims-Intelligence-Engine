const express = require("express");

const {
    createClaim,
    listClaims,
} = require("../controllers/claim.controller");

const router = express.Router();

router.post("/create", createClaim);
router.get("/", listClaims);

module.exports = router;