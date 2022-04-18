import mongoose, { Types, Schema } from "mongoose";

export interface ISingleOrderSchema {
    name: string,
    image: string,
    price: number,
    amount: number,
    product: Types.ObjectId
}

interface IOrderSchema {
    tax: number,
    shippingFee: number,
    subtotal: number,
    total: number,
    orderItems: ISingleOrderSchema[],
    status: 'pending' | 'failed' | 'paid' | 'delivered' | 'canceled',
    user: Types.ObjectId,
    clientSecret: string,
    paymentIntentId: string
}

const SingleOrderItemSchema = new mongoose.Schema<ISingleOrderSchema>({
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    amount: { type: Number, required: true },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
});

const OrderSchema = new mongoose.Schema<IOrderSchema>({
    tax: {
        type: Number,
        required: true,
    },
    shippingFee: {
        type: Number,
        required: true,
    },
    subtotal: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    orderItems: [SingleOrderItemSchema],
    status: {
        type: String,
        enum: ['pending', 'failed', 'paid', 'delivered', 'canceled'],
        default: 'pending',
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    clientSecret: {
        type: String,
        required: true,
    },
    paymentIntentId: {
        type: String,
    },
}, { timestamps: true })

export default mongoose.model('Order', OrderSchema)