import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import CustomError from '../errors';
import Product from '../models/Product';
import Review from '../models/Review';
import checkPermission from '../utils/checkPermission';

const createReview = async (req: Request, res: Response) => {
    const { user: { userId }, body: { product: productId } } = req;

    const product = await Product.findOne({ _id: productId });
    if (!product) throw new CustomError.NotFoundError(`No product match with id: ${productId}`)

    const isReviewAlreadySubmitted = await Review.findOne({ product: productId, user: userId });
    if (isReviewAlreadySubmitted) throw new CustomError.BadRequestError(`Already submitted review for ${product.name}`)

    req.body.user = userId;
    const review = await Review.create(req.body);

    res.status(StatusCodes.CREATED).json({ review })
}

const getAllReviews = async (req: Request, res: Response) => {
    const reviews = await Review.find({})
        .populate({
            path: 'product',
            select: 'name company price'
        })

    res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}

const getSingleReview = async (req: Request, res: Response) => {
    const { id: reviewId } = req.params;

    const review = await Review.findOne({ _id: reviewId });

    if (!review) {
        throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
    }

    res.status(StatusCodes.OK).json({ review });
}

const updateReview = async (req: Request, res: Response) => {
    const { id: reviewId } = req.params;
    const { rating, title, comment } = req.body;

    const review = await Review.findOne({ _id: reviewId });

    if (!review) {
        throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
    }

    checkPermission(req.user, review.user);

    review.rating = rating;
    review.title = title;
    review.comment = comment;

    await review.save();
    res.status(StatusCodes.OK).json({ review });
};
const deleteReview = async (req: Request, res: Response) => {
    const { id: reviewId } = req.params;

    const review = await Review.findOne({ _id: reviewId });

    if (!review) {
        throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
    }

    checkPermission(req.user, review.user);
    await review.remove();
    res.status(StatusCodes.OK).json({ msg: 'Success! Review removed' });
};
const getSingleProductReviews = async (req: Request, res: Response) => {
    const { id: productId } = req.params;
    const reviews = await Review.find({ product: productId });
    res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};
export {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
    getSingleProductReviews
}