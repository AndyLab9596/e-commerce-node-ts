"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateImage = exports.deleteProduct = exports.updateProduct = exports.getSingleProduct = exports.getAllProducts = exports.createProduct = void 0;
const http_status_codes_1 = require("http-status-codes");
const errors_1 = __importDefault(require("../errors"));
const Product_1 = __importDefault(require("../models/Product"));
const path_1 = __importDefault(require("path"));
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user: { userId } } = req;
    req.body.user = userId;
    const product = yield Product_1.default.create(req.body);
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ product });
});
exports.createProduct = createProduct;
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield Product_1.default.find({});
    res.status(http_status_codes_1.StatusCodes.OK).json({ products, count: products.length });
});
exports.getAllProducts = getAllProducts;
const getSingleProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { id: productId } } = req;
    const product = yield Product_1.default.findOne({ _id: productId }).populate('reviews');
    if (!product)
        throw new errors_1.default.NotFoundError(`No product match with id: ${productId}`);
    res.status(http_status_codes_1.StatusCodes.OK).json({ product });
});
exports.getSingleProduct = getSingleProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { id: productId }, body } = req;
    const product = yield Product_1.default.findOneAndUpdate({ _id: productId }, body, {
        new: true,
        runValidators: true
    });
    if (!product)
        throw new errors_1.default.NotFoundError(`No product match with id: ${productId}`);
    res.status(http_status_codes_1.StatusCodes.OK).json({ product });
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { id: productId } } = req;
    const product = yield Product_1.default.findOne({ _id: productId });
    if (!product)
        throw new errors_1.default.NotFoundError(`No product match with id: ${productId}`);
    yield product.remove();
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'Success !!! Product removed' });
});
exports.deleteProduct = deleteProduct;
const updateImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files)
        throw new errors_1.default.BadRequestError('No File Uploaded');
    const { mimetype, size, name, mv } = req.files.image;
    if (mimetype.startsWith('image'))
        throw new errors_1.default.BadRequestError('Please Upload Image');
    const maxSize = 1024 * 1024;
    if (size > maxSize)
        throw new errors_1.default.BadRequestError('Please upload image smaller than 1MB');
    const imagePath = path_1.default.join(__dirname, '../public/uploads/' + `${name}`);
    yield mv(imagePath);
    res.status(http_status_codes_1.StatusCodes.OK).json({ image: `/uploads/${name}` });
});
exports.updateImage = updateImage;
