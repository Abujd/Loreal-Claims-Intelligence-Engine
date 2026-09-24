const claimService = require("../services/claim.service");

const createClaim = async (req, res, next) => {
    try {
        const claim = await claimService.createClaim(req.body);
        res.status(201).json(claim);
    } catch (error) {
        next(error);
    }
};

const listClaims = async (req, res, next) => {
    try {
        const claims = await claimService.listClaims();
        res.status(200).json(claims);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createClaim,
    listClaims,
};