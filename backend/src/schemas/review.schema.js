const { z } = require("zod");
const { REVIEW_DECISIONS, VERDICTS } = require("../constants");

// ACCEPTED carries no human verdict; OVERRIDDEN must state the corrected verdict + why.
const ReviewRequestSchema = z
    .object({
        decision: z.enum(REVIEW_DECISIONS),
        humanVerdict: z.enum(VERDICTS).nullable().optional(),
        note: z.string().trim().min(1).max(2000).nullable().optional(),
    })
    .refine(
        (o) => o.decision !== "OVERRIDDEN" || (o.humanVerdict != null && o.note != null),
        { message: "humanVerdict and note are required when overriding an assessment", path: ["humanVerdict"] }
    )
    .refine(
        (o) => o.decision !== "ACCEPTED" || o.humanVerdict == null,
        { message: "humanVerdict must be omitted when accepting an assessment", path: ["humanVerdict"] }
    );

const AssessmentIdParamsSchema = z.object({
    assessmentId: z.uuid(),
});

module.exports = { ReviewRequestSchema, AssessmentIdParamsSchema };
