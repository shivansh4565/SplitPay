import express from 'express';
import {
  createPaymentSession,
  getPaymentSession,
  updatePaymentStatus,
  deletePaymentSession
} from '../controllers/paymentSessionController.js';

const router = express.Router();

router.post('/', createPaymentSession);
router.get('/:id', getPaymentSession);
router.patch('/:id/payments/:paymentId', updatePaymentStatus);
router.delete('/:id', deletePaymentSession);

export default router;
