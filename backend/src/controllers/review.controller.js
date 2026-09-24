const reviewService = require("../services/review.service");

const listReviews = async (req, res, next) => {
    try {
        const reviews = await reviewService.listReviews(req.valid.params.assessmentId);
        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
};

const submitReview = async (req, res, next) => {
    try {
        const review = await reviewService.submitReview({
            assessmentId: req.valid.params.assessmentId,
            ...req.valid.body,
            reviewedById: "demo-evaluator",
        });
        res.status(201).json(review);
    } catch (error) {
        next(error);
    }
};

module.exports = { listReviews, submitReview };
