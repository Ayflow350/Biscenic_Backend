import express from 'express';
import { initiatePayment, verifyPayment } from '../controllers/payment.controller';

const router = express.Router();

router.post('/initialize', initiatePayment);
router.get('/verify', verifyPayment);

export default router;
