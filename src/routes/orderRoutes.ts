import { Router } from "express";
import { createOrder, getAllOrders, getSingleOrder, getCurrentUserOrders, updateOrder } from '../controllers/orderController';
import { authorizePermissions, authenticateUser } from '../middleware/authenticate';


const router = Router();


router
    .route('/')
    .post(authenticateUser, createOrder)
    .get(authenticateUser, authorizePermissions('admin'), getAllOrders);

router.route('/showAllMyOrders').get(authenticateUser, getCurrentUserOrders);

router
    .route('/:id')
    .get(authenticateUser, getSingleOrder)
    .patch(authenticateUser, updateOrder);


export default router;