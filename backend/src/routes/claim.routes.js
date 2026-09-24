const express = require("express");

const {
    createClaim,
    listClaims,
} = require("../controllers/claim.controller");

const router = express.Router();

/**
 * @openapi
 * /api/claims/create:
 *   post:
 *     summary: Create a new marketing claim
 *     tags: [Claims]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, productName, text, type, markets, proposedById]
 *             properties:
 *               productId: { type: string }
 *               productName: { type: string }
 *               formulaVersion: { type: string, nullable: true }
 *               text: { type: string }
 *               type: { type: string }
 *               markets: { type: array, items: { type: string } }
 *               metric: { type: string, nullable: true }
 *               targetValue: { type: number, nullable: true }
 *               unit: { type: string, nullable: true }
 *               timeframeDays: { type: number, nullable: true }
 *               timeframeKind: { type: string, nullable: true }
 *               status: { type: string }
 *               proposedById: { type: string }
 *     responses:
 *       201:
 *         description: The created claim
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Claim' }
 */
router.post("/create", createClaim);

/**
 * @openapi
 * /api/claims:
 *   get:
 *     summary: List all claims
 *     tags: [Claims]
 *     responses:
 *       200:
 *         description: All claims, oldest first
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Claim' }
 */
router.get("/", listClaims);

module.exports = router;