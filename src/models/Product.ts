import mongoose, { Schema, Types } from "mongoose";

export interface IProduct {
    name: string,
    price: number,
    description: string,
    image: string,
    category: 'office' | 'kitchen' | 'bedroom',
    company: 'ikea' | 'liddy' | 'marcos',
    colors: string[],
    featured: boolean,
    freeShipping: boolean,
    inventory: number,
    averageRating: number,
    numOfReviews: number,
    user: Types.ObjectId
}

const ProductSchema = new mongoose.Schema<IProduct>({
    name: {
        type: String,
        trim: true,
        required: [true, 'Please provide product name'],
        maxlength: [100, 'Name can not be more than 100 characters'],
    },
    price: {
        type: Number,
        required: [true, 'Please provide product price'],
        default: 0,
    },
    description: {
        type: String,
        required: [true, 'Please provide product description'],
        maxlength: [1000, 'Description can not be more than 1000 characters'],
    },
    image: {
        type: String,
        default: '/uploads/example.jpeg',
    },
    category: {
        type: String,
        required: [true, 'Please provide product category'],
        enum: ['office', 'kitchen', 'bedroom'],
    },
    company: {
        type: String,
        required: [true, 'Please provide company'],
        enum: {
            values: ['ikea', 'liddy', 'marcos'],
            message: '{VALUE} is not supported',
        },
    },
    colors: {
        type: [String],
        default: ['#222'],
        required: true,
    },
    featured: {
        type: Boolean,
        default: false,
    },
    freeShipping: {
        type: Boolean,
        default: false,
    },
    inventory: {
        type: Number,
        required: true,
        default: 15,
    },
    averageRating: {
        type: Number,
        default: 0,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true })

export default mongoose.model('Product', ProductSchema)