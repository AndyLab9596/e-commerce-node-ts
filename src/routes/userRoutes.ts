import { Router } from "express";
import { getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword } from '../controllers/userController';
import { authenticateUser, authorizePermissions } from '../middleware/authenticate';

const router = Router();

router.route('/').get(authorizePermissions('admin') as any, getAllUsers)

router.route('/showMe').get(showCurrentUser)

router.route('/updateUser').patch(updateUser)

router.route('/updateUserPassword').patch(updateUserPassword)

router.route('/:id').get(getSingleUser)

export default router
