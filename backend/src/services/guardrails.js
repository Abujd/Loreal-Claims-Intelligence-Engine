const { GUARDRAIL_FLAGS: F } = require("../constants");
const { config } = require("../config");

/**
 * Rule-based sanity checks on what the LLM extracted.
 * These catch inconsistencies a small model may not flag itself.
 */
function computeGuardrails(f) {
    const flags = [];

    if (f.timepointDays != null && f.studyDurationDays != null && f.timepointDays > f.studyDurationDays) {
        flags.push(F.TIMEPOINT_EXCEEDS_STUDY_DURATION);
    }
    if (f.sampleSize != null && f.sampleSize < config.scoring.minSampleSize) {
        flags.push(F.SMALL_SAMPLE);
    }
    // Only flag when baseline is the ONLY comparator (not vehicle / placebo / control)
    if (f.comparator && /baseline/i.test(f.comparator) && !/vehicle|placebo|control/i.test(f.comparator)) {
        flags.push(F.BASELINE_ONLY_COMPARATOR);
    }
    if (f.statisticalSignificance == null) {
        flags.push(F.NO_STATISTICS_REPORTED);
    }
    if (f.observedEffectPercent != null && (f.observedEffectPercent < 0 || f.observedEffectPercent > 100)) {
        flags.push(F.EFFECT_OUT_OF_RANGE);
    }

    return flags;
}

module.exports = { computeGuardrails };