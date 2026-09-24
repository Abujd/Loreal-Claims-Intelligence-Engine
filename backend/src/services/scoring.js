const { config } = require("../config");

/** Verdict is derived from criteria so the model cannot contradict itself. */
function deriveVerdict(criteria) {
    const statuses = criteria.map((c) => c.status);
    if (statuses.includes("NOT_MET")) return "NOT_JUSTIFIED";
    if (statuses.includes("UNCLEAR")) return "INSUFFICIENT_EVIDENCE";
    return "JUSTIFIED";
}

/**
 * Heuristic: model self-confidence, scaled by how many criteria were met,
 * minus a penalty per guardrail flag. Tune against human-reviewed data.
 */
function computeConfidence(modelConfidence, criteria, guardrailFlags) {
    const metRatio = criteria.filter((c) => c.status === "MET").length / criteria.length;
    const raw =
        modelConfidence * (0.5 + 0.5 * metRatio) - config.scoring.guardrailPenalty * guardrailFlags.length;
    return Math.round(Math.min(1, Math.max(0, raw)) * 100) / 100;
}

module.exports = { deriveVerdict, computeConfidence };