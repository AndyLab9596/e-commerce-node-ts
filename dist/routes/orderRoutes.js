"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
router
    .route('/')
    .post(authenticate_1.authenticateUser, orderController_1.createOrder)
    .get(authenticate_1.authenticateUser, (0, authenticate_1.authorizePermissions)('admin'), orderController_1.getAllOrders);
router.route('/showAllMyOrders').get(authenticate_1.authenticateUser, orderController_1.getCurrentUserOrders);
router
    .route('/:id')
    .get(authenticate_1.authenticateUser, orderController_1.getSingleOrder)
    .patch(authenticate_1.authenticateUser, orderController_1.updateOrder);
exports.default = router;
