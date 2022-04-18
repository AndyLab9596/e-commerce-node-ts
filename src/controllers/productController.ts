import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import CustomError from '../errors';
import Product from '../models/Product';
import { UploadedFile } from 'express-fileupload';
import path from 'path'

const createProduct = async (req: Request, res: Response) => {
    const { user: { userId } } = req;
    req.body.user = userId;
    const product = await Product.create(req.body);
    res.status(StatusCodes.CREATED).json({ product })
}

const getAllProducts = async (req: Request, res: Response) => {
    const products = await Product.find({});
    res.status(StatusCodes.OK).json({ products, count: products.length })
}

const getSingleProduct = async (req: Request, res: Response) => {
    const { params: { id: productId } } = req;
    const product = await Product.findOne({ _id: productId })
    if (!product) throw new CustomError.NotFoundError(`No product match with id: ${productId}`)
    res.status(StatusCodes.OK).json({ product })
}

const updateProduct = async (req: Request, res: Response) => {
    const { params: { id: productId }, body } = req;
    const product = await Product.findOneAndUpdate({ _id: productId }, body, {
        new: true,
        runValidators: true
    })
    if (!product) throw new CustomError.NotFoundError(`No product match with id: ${productId}`);

    res.status(StatusCodes.OK).json({ product })
}

const deleteProduct = async (req: Request, res: Response) => {
    const { params: { id: productId } } = req;
    const product = await Product.findOne({ _id: productId });
    if (!product) throw new CustomError.NotFoundError(`No product match with id: ${productId}`);

    await product.remove();
    res.status(StatusCodes.OK).json({ msg: 'Success !!! Product removed' })
}

const updateImage = async (req: Request, res: Response) => {
    if (!req.files) throw new CustomError.BadRequestError('No File Uploaded');

    const { mimetype, size, name, mv } = req.files.image as UploadedFile
    if (mimetype.startsWith('image')) throw new CustomError.BadRequestError('Please Upload Image');

    const maxSize = 1024 * 1024;
    if (size > maxSize) throw new CustomError.BadRequestError(
        'Please upload image smaller than 1MB'
    );

    const imagePath = path.join(
        __dirname,
        '../public/uploads/' + `${name}`
    );
    await mv(imagePath);
    res.status(StatusCodes.OK).json({ image: `/uploads/${name}` });
}

export {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    updateImage
}