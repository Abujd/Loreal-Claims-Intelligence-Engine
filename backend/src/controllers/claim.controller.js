const claimService = require("../services/claim.service");

const createClaim = async (req, res) => {
    try {
        const claim = await claimService.createClaim(req.body);

        res.status(201).json(claim);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create claim",
        });
    }
};

const listClaims = async (req, res) => {
    try {
        const claim = await claimService.listClaims(req.body);

        res.status(201).json(claim);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to list claim",
        });
    }
};

module.exports = {
    createClaim,
    listClaims
};