import mongoose, { Types, Schema, Model, Document } from "mongoose";
import { NextFunction } from 'express'
export interface IReview extends Document {
    rating: number,
    title: string,
    comment: string,
    user: Types.ObjectId,
    product: Types.ObjectId,
    _id: Types.ObjectId,
    // calculateAverageRating: (productId: Types.ObjectId) => Promise<number>
}

interface ReviewModel extends Model<IReview> {
    calculateAverageRating(productId: Types.ObjectId): Promise<number>
}

const ReviewSchema = new mongoose.Schema<IReview, ReviewModel>({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Please provide rating'],
    },
    title: {
        type: String,
        trim: true,
        required: [true, 'Please provide review title'],
        maxlength: 100,
    },
    comment: {
        type: String,
        required: [true, 'Please provide review text'],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
}, { timestamps: true })

ReviewSchema.index({ product: 1, user: 1 }, { unique: true })

ReviewSchema.statics.calculateAverageRating = async function (productId) {
    const result = await this.aggregate([
        { $match: { product: productId } },
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                numOfReviews: { $sum: 1 },
            },
        },
    ]);

    try {
        await (this as any).model('Product').findOneAndUpdate(
            { _id: productId },
            {
                averageRating: Math.ceil(result[0]?.averageRating || 0),
                numOfReviews: result[0]?.numOfReviews || 0,
            }
        );
    } catch (error) {
        console.log(error);
    }
};

ReviewSchema.post('save', async function () {
    await (this as any).constructor.calculateAverageRating(this.product);
});

ReviewSchema.post('remove', async function () {
    await (this as any).constructor.calculateAverageRating(this.product);
});

export default mongoose.model('Review', ReviewSchema)