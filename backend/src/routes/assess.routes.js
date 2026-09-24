const express = require("express");
const { AssessRequestSchema } = require("../llm/assess.schema");
const assessService = require("../services/assess.service");
const { validate } = require("../middleware/validate");

// If an async handler fails, pass the error to the error handler
const h = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const router = express.Router();

/**
 * @openapi
 * /api/assess:
 *   post:
 *     summary: Assess a piece of study evidence against a claim
 *     description: >
 *       Runs the LLM substantiation pipeline and stores the resulting assessment.
 *       Can take upwards of a minute depending on the model and hardware.
 *     tags: [Assessments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AssessRequest' }
 *     responses:
 *       200:
 *         description: The assessment result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Assessment' }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       502:
 *         description: The LLM returned output that failed schema validation
 *       503:
 *         description: The LLM backend is unreachable or timed out
 */
router.post(
    "/",
    validate("body", AssessRequestSchema), // station 1: check the shape
    h(async (req, res) => {                // station 2: run the service
        res.json(await assessService.assess(req.valid.body));
    })
);

module.exports = router;