import { Router } from "express";
import { createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct, updateImage } from '../controllers/productController';
import { authorizePermissions, authenticateUser } from '../middleware/authenticate';

const router = Router();

router.route('/').post([authenticateUser, authorizePermissions('admin')], createProduct).get(getAllProducts);

router.route('/uploadImage').post([authenticateUser, authorizePermissions('admin')], updateImage);

router
    .route('/:id')
    .get(getSingleProduct)
    .patch([authenticateUser, authorizePermissions('admin')], updateProduct)
    .delete([authenticateUser, authorizePermissions('admin')], deleteProduct);


export default router;