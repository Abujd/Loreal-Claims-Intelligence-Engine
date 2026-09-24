const express = require("express");
const { validate } = require("../middleware/validate");
const { ReviewRequestSchema, AssessmentIdParamsSchema } = require("../schemas/review.schema");
const { listReviews, submitReview } = require("../controllers/review.controller");

const router = express.Router({ mergeParams: true });

/**
 * @openapi
 * /api/assessments/{assessmentId}/reviews:
 *   get:
 *     summary: List the review history for an assessment
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: assessmentId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Reviews for this assessment, most recent first
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/AssessmentReview' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   post:
 *     summary: Record a human decision on an assessment (accept or override)
 *     description: >
 *       Append-only: every call adds a new review row. The most recent row by
 *       reviewedAt is the assessment's current human decision.
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: assessmentId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ReviewRequest' }
 *     responses:
 *       201:
 *         description: The created review
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AssessmentReview' }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router
    .route("/")
    .get(validate("params", AssessmentIdParamsSchema), listReviews)
    .post(
        validate("params", AssessmentIdParamsSchema),
        validate("body", ReviewRequestSchema),
        submitReview
    );

module.exports = router;
