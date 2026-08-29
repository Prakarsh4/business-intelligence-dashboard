import express from 'express';
import {
  getSummary,
  getRevenueTrend,
  getCategoryPerformance,
  getRegionPerformance,
  getTopProducts,
  getRecentTransactions
} from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/summary', getSummary);
router.get('/revenue-trend', getRevenueTrend);
router.get('/category-performance', getCategoryPerformance);
router.get('/region-performance', getRegionPerformance);
router.get('/top-products', getTopProducts);
router.get('/recent-transactions', getRecentTransactions);

export default router;