const swaggerJsdoc = require("swagger-jsdoc");
const { config } = require("../config");
const { CRITERIA, CRITERION_STATUS, VERDICTS, REVIEW_DECISIONS } = require("../constants");

const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: "3.0.3",
        info: {
            title: "L'Oréal Claims Intelligence Engine API",
            version: "1.0.0",
            description:
                "Substantiates marketing claims against study evidence using an LLM, with a human-in-the-loop review step.",
        },
        servers: [{ url: `http://localhost:${config.port}`, description: "Local" }],
        tags: [
            { name: "Claims", description: "Marketing claims" },
            { name: "Assessments", description: "AI-generated evidence assessments" },
            { name: "Reviews", description: "Human accept/override decisions on an assessment" },
        ],
        components: {
            responses: {
                NotFound: {
                    description: "Resource not found",
                    content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
                },
                ValidationError: {
                    description: "Request failed schema validation",
                    content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
                },
            },
            schemas: {
                Error: {
                    type: "object",
                    properties: {
                        message: { type: "string" },
                        code: { type: "string" },
                        details: {},
                    },
                },
                Claim: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        productName: { type: "string" },
                        text: { type: "string" },
                        type: { type: "string" },
                        markets: { type: "array", items: { type: "string" } },
                        status: { type: "string" },
                        assessmentCount: { type: "integer" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                AssessRequest: {
                    type: "object",
                    required: ["claimId", "market", "evidence"],
                    properties: {
                        claimId: { type: "string", format: "uuid" },
                        market: { type: "string", minLength: 2, maxLength: 2, example: "FR" },
                        evidence: {
                            type: "object",
                            required: ["studyTitle", "studyType", "content"],
                            properties: {
                                studyTitle: { type: "string" },
                                studyType: { type: "string" },
                                content: { type: "string", description: "Free-text study summary" },
                            },
                        },
                    },
                },
                Criterion: {
                    type: "object",
                    properties: {
                        name: { type: "string", enum: CRITERIA },
                        status: { type: "string", enum: CRITERION_STATUS },
                        explanation: { type: "string" },
                    },
                },
                Assessment: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        claimId: { type: "string", format: "uuid" },
                        evidenceId: { type: "string", format: "uuid" },
                        market: { type: "string" },
                        verdict: { type: "string", enum: VERDICTS },
                        justified: { type: "boolean" },
                        confidence: { type: "number", minimum: 0, maximum: 1 },
                        modelConfidence: { type: "number", minimum: 0, maximum: 1 },
                        reasoning: { type: "string" },
                        criteria: { type: "array", items: { $ref: "#/components/schemas/Criterion" } },
                        extractedFindings: { type: "object" },
                        guardrailFlags: { type: "array", items: { type: "string" } },
                        suggestedRewording: { type: "string", nullable: true },
                        model: { type: "string" },
                        promptVersion: { type: "string" },
                        latencyMs: { type: "integer" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                ReviewRequest: {
                    type: "object",
                    required: ["decision"],
                    properties: {
                        decision: { type: "string", enum: REVIEW_DECISIONS },
                        humanVerdict: {
                            type: "string",
                            enum: VERDICTS,
                            nullable: true,
                            description: "Required when decision is OVERRIDDEN, omitted when ACCEPTED",
                        },
                        note: {
                            type: "string",
                            nullable: true,
                            description: "Required when decision is OVERRIDDEN",
                        },
                    },
                },
                AssessmentReview: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        assessmentId: { type: "string", format: "uuid" },
                        decision: { type: "string", enum: REVIEW_DECISIONS },
                        humanVerdict: { type: "string", enum: VERDICTS, nullable: true },
                        note: { type: "string", nullable: true },
                        reviewedById: { type: "string" },
                        reviewedAt: { type: "string", format: "date-time" },
                    },
                },
            },
        },
    },
    apis: ["./src/routes/*.js"],
});

module.exports = { swaggerSpec };
