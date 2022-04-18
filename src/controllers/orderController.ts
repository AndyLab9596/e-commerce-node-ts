import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import CustomError from '../errors';
import Order from '../models/Order';
import Product from '../models/Product';
import { ISingleOrderSchema } from '../models/Order';
import checkPermission from '../utils/checkPermission';

interface FakeStripProps {
    amount: number,
    currency: string,
}

const fakeStripeApi = async ({ amount, currency }: FakeStripProps) => {
    const client_secret = 'someRandomValue';
    return { client_secret, amount };
};

const createOrder = async (req: Request, res: Response) => {
    const { items: cartItems, tax, shippingFee } = req.body;

    if (!cartItems || cartItems.length < 1) {
        throw new CustomError.BadRequestError('No cart items provided')
    }

    if (!tax || !shippingFee) {
        throw new CustomError.BadRequestError('Please provide tax and shipping fee')
    }

    let orderItems: ISingleOrderSchema[] = [];
    let subtotal = 0;

    for (const item of cartItems) {
        const dbProduct = await Product.findOne({ _id: item.product });

        if (!dbProduct) throw new CustomError.NotFoundError(`No product with id: ${item.product}`);

        const { name, price, image, _id } = dbProduct;
        const singleOrderItem = {
            amount: item.amount,
            name,
            price,
            image,
            product: _id
        }
        // add item to order
        orderItems = [...orderItems, singleOrderItem]
        subtotal += item.amount * price
    }
    const total = tax + shippingFee + subtotal;
    // get client secret
    const paymentIntent = await fakeStripeApi({
        amount: total,
        currency: 'usd',
    })

    const order = await Order.create({
        orderItems,
        total,
        subtotal,
        tax,
        shippingFee,
        clientSecret: paymentIntent.client_secret,
        user: req.user.userId
    })


    res.status(StatusCodes.CREATED).json({ order, clientSecret: order.clientSecret })
}

const getAllOrders = async (req: Request, res: Response) => {
    const orders = await Order.find({});
    res.status(StatusCodes.OK).json({ orders, count: orders.length });
};
const getSingleOrder = async (req: Request, res: Response) => {
    const { id: orderId } = req.params;
    const order = await Order.findOne({ _id: orderId });
    if (!order) {
        throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
    }
    checkPermission(req.user, order.user);
    res.status(StatusCodes.OK).json({ order });
};
const getCurrentUserOrders = async (req: Request, res: Response) => {
    const orders = await Order.find({ user: req.user.userId });
    res.status(StatusCodes.OK).json({ orders, count: orders.length });
};
const updateOrder = async (req: Request, res: Response) => {
    const { id: orderId } = req.params;
    const { paymentIntentId } = req.body;

    const order = await Order.findOne({ _id: orderId });
    if (!order) {
        throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
    }
    checkPermission(req.user, order.user);

    order.paymentIntentId = paymentIntentId;
    order.status = 'paid';
    await order.save();

    res.status(StatusCodes.OK).json({ order });
};


export { createOrder, getAllOrders, getSingleOrder, getCurrentUserOrders, updateOrder }