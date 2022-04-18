"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const authenticate_1 = require("../middleware/authenticate");
const reviewController_1 = require("../controllers/reviewController");
const router = (0, express_1.Router)();
router.route('/').post([authenticate_1.authenticateUser, (0, authenticate_1.authorizePermissions)('admin')], productController_1.createProduct).get(productController_1.getAllProducts);
router.route('/uploadImage').post([authenticate_1.authenticateUser, (0, authenticate_1.authorizePermissions)('admin')], productController_1.updateImage);
router
    .route('/:id')
    .get(productController_1.getSingleProduct)
    .patch([authenticate_1.authenticateUser, (0, authenticate_1.authorizePermissions)('admin')], productController_1.updateProduct)
    .delete([authenticate_1.authenticateUser, (0, authenticate_1.authorizePermissions)('admin')], productController_1.deleteProduct);
router.route('/:id/reviews').get(reviewController_1.getSingleProductReviews);
exports.default = router;
