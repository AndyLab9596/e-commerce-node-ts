import { Router } from "express";
import {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
} from '../controllers/reviewController';
import { authenticateUser } from '../middleware/authenticate';

const router = Router();

router.route('/').get(getAllReviews).post(authenticateUser, createReview);

router.route('/:id').get(getSingleReview).patch(authenticateUser, updateReview).delete(authenticateUser, deleteReview);

export default router
