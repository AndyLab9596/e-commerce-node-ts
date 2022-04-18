"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../errors/index"));
const checkPermission = (requestUser, resourceUserId) => {
    if (requestUser.role === 'admin')
        return;
    if (resourceUserId.equals(requestUser.userId))
        return; // return boolean
    throw new index_1.default.UnauthorizedError('Not authorized to access this route');
};
exports.default = checkPermission;
