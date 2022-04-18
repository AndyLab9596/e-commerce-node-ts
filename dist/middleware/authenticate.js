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
exports.authorizePermissions = exports.authenticateUser = void 0;
const index_1 = __importDefault(require("../errors/index"));
const jwt_1 = require("../utils/jwt");
const authenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.signedCookies.token;
    if (!token)
        throw new index_1.default.UnauthenticatedError('Authentication invalid');
    try {
        const { name, userId, role } = (0, jwt_1.isTokenValid)({ token });
        req.user = { name, userId, role };
        next();
    }
    catch (error) {
        throw new index_1.default.UnauthenticatedError('Authentication invalid');
    }
});
exports.authenticateUser = authenticateUser;
const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new index_1.default.UnauthorizedError('Unauthorized to access this route');
        }
        next();
    };
};
exports.authorizePermissions = authorizePermissions;
