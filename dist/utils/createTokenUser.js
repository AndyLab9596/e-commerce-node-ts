"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createTokenUser = (user) => {
    return { name: user.name, userId: user._id, role: user.role };
};
exports.default = createTokenUser;
