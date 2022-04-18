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
exports.updateUserPassword = exports.updateUser = exports.showCurrentUser = exports.getSingleUser = exports.getAllUsers = void 0;
const index_1 = __importDefault(require("../errors/index"));
const User_1 = __importDefault(require("../models/User"));
const createTokenUser_1 = __importDefault(require("../utils/createTokenUser"));
const jwt_1 = require("../utils/jwt");
const http_status_codes_1 = require("http-status-codes");
const checkPermission_1 = __importDefault(require("../utils/checkPermission"));
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User_1.default.find({ role: 'user' }).select('-password');
    res.status(http_status_codes_1.StatusCodes.OK).json({ users });
});
exports.getAllUsers = getAllUsers;
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { id: userId } } = req;
    const user = yield User_1.default.findOne({ _id: userId }).select("-password");
    if (!user)
        throw new index_1.default.NotFoundError(`No user match with this id: ${userId}`);
    // Check permission
    (0, checkPermission_1.default)(req.user, user._id);
    res.status(http_status_codes_1.StatusCodes.OK).json({ user });
});
exports.getSingleUser = getSingleUser;
const showCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(http_status_codes_1.StatusCodes.OK).json({ user: req.user });
});
exports.showCurrentUser = showCurrentUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body: { email, name }, user: { userId } } = req;
    if (!email || !name)
        throw new index_1.default.BadRequestError('Please provide all values');
    const user = yield User_1.default.findOne({ _id: userId });
    user.email = email;
    user.name = name;
    yield user.save();
    const tokenUser = (0, createTokenUser_1.default)(user);
    (0, jwt_1.attachCookiesToResponse)({ res, user: tokenUser });
    res.status(http_status_codes_1.StatusCodes.OK).json({ user: tokenUser });
});
exports.updateUser = updateUser;
const updateUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body: { oldPassword, newPassword }, user: { userId } } = req;
    if (!oldPassword || !newPassword)
        throw new index_1.default.BadRequestError('Please provide both values');
    const user = yield User_1.default.findOne({ _id: userId });
    const isPasswordCorrect = yield (user === null || user === void 0 ? void 0 : user.comparePassword(oldPassword));
    if (!isPasswordCorrect)
        throw new index_1.default.UnauthenticatedError('Credential invalid');
    user.password = newPassword;
    yield user.save();
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'Success! Password updated' });
});
exports.updateUserPassword = updateUserPassword;
