const { z } = require("zod"); // zod v4
const { CRITERIA, CRITERION_STATUS } = require("../constants");

// ---------- HTTP request schema ----------

const AssessRequestSchema = z.object({
    claimId: z.uuid(),
    market: z.string().trim().length(2),
    evidence: z.object({
        studyTitle: z.string().trim().min(1).max(500),
        studyType: z.string().trim().min(1).max(200),
        content: z.string().trim().min(20).max(30_000),
    }),
});

// ---------- LLM output schema ----------
// The model does NOT return verdict/confidence; we derive those in code.

const LlmOutputSchema = z
    .object({
        reasoning: z.string(),
        modelConfidence: z.number().min(0).max(1),
        criteria: z
            .array(
                z.object({
                    name: z.enum(CRITERIA),
                    status: z.enum(CRITERION_STATUS),
                    explanation: z.string(),
                })
            )
            .length(CRITERIA.length),
        extractedFindings: z.object({
            endpoint: z.string().nullable(),
            measurementMethod: z.string().nullable(),
            sampleSize: z.number().nullable(),
            studyDurationDays: z.number().nullable(),
            timepointDays: z.number().nullable(),
            observedEffectPercent: z.number().nullable(),
            comparator: z.string().nullable(),
            statisticalSignificance: z.string().nullable(),
        }),
        suggestedRewording: z.string().nullable(),
    })
    .refine((o) => new Set(o.criteria.map((c) => c.name)).size === CRITERIA.length, {
        message: "Each criterion must appear exactly once",
        path: ["criteria"],
    });

// JSON Schema passed to Ollama's format option for constrained decoding
const { $schema, ...LlmOutputJsonSchema } = z.toJSONSchema(LlmOutputSchema);

module.exports = {
    AssessRequestSchema,
    LlmOutputSchema,
    LlmOutputJsonSchema,
};