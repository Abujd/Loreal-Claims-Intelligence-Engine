const express = require("express");
const { AssessRequestSchema } = require("../llm/assess.schema");
const assessService = require("../services/assess.service");
const { validate } = require("../middleware/validate");

// If an async handler fails, pass the error to the error handler
const h = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const router = express.Router();

router.post(
    "/",
    validate("body", AssessRequestSchema), // station 1: check the shape
    h(async (req, res) => {                // station 2: run the service
        res.json(await assessService.assess(req.valid.body));
    })
);

module.exports = router;