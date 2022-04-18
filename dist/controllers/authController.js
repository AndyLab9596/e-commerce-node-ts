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
exports.logout = exports.login = exports.register = void 0;
const index_1 = __importDefault(require("../errors/index"));
const User_1 = __importDefault(require("../models/User"));
const createTokenUser_1 = __importDefault(require("../utils/createTokenUser"));
const jwt_1 = require("../utils/jwt");
const http_status_codes_1 = require("http-status-codes");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const isEmailExist = yield User_1.default.findOne({ email });
    if (isEmailExist)
        throw new index_1.default.BadRequestError('Email already exist');
    // Define role if user is the first user
    const isFirstAccount = (yield User_1.default.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';
    const user = yield User_1.default.create({ name, email, password, role });
    const tokenUser = (0, createTokenUser_1.default)(user);
    (0, jwt_1.attachCookiesToResponse)({ res, user: tokenUser });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ user: tokenUser });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password)
        throw new index_1.default.BadRequestError('Please provide email and password !');
    const user = yield User_1.default.findOne({ email });
    if (!user)
        throw new index_1.default.UnauthenticatedError('Invalid credential');
    const isPasswordCorrect = yield user.comparePassword(password);
    if (!isPasswordCorrect)
        throw new index_1.default.UnauthenticatedError('Invalid credential');
    const tokenUser = (0, createTokenUser_1.default)(user);
    (0, jwt_1.attachCookiesToResponse)({ res, user: tokenUser });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ user: tokenUser });
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now())
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "logged out" });
});
exports.logout = logout;
