import express from 'express';
import { getSummary } from '../controllers/adminController.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { isAuth } from '../middlewares/isAuth.js';

const adminRouter = express.Router();

adminRouter.use(isAuth, isAdmin);

adminRouter.route('/get-summary').get(getSummary);



export default adminRouter;
