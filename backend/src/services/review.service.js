const { NotFoundError } = require("../errors");
const reviewRepo = require("../repositories/assessmentReview.repository");

async function listReviews(assessmentId) {
    const assessment = await reviewRepo.findAssessmentById(assessmentId);
    if (!assessment) throw new NotFoundError(`Assessment ${assessmentId} not found`);
    return reviewRepo.findByAssessmentId(assessmentId);
}

async function submitReview({ assessmentId, decision, humanVerdict, note, reviewedById }) {
    const assessment = await reviewRepo.findAssessmentById(assessmentId);
    if (!assessment) throw new NotFoundError(`Assessment ${assessmentId} not found`);

    return reviewRepo.insert({
        assessmentId,
        decision,
        humanVerdict: decision === "OVERRIDDEN" ? humanVerdict : null,
        note: decision === "OVERRIDDEN" ? note : null,
        reviewedById,
    });
}

module.exports = { listReviews, submitReview };
