"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviewController_1 = require("../controllers/reviewController");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
router.route('/').get(reviewController_1.getAllReviews).post(authenticate_1.authenticateUser, reviewController_1.createReview);
router.route('/:id').get(reviewController_1.getSingleReview).patch(authenticate_1.authenticateUser, reviewController_1.updateReview).delete(authenticate_1.authenticateUser, reviewController_1.deleteReview);
exports.default = router;
