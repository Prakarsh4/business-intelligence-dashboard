import express from 'express';
import {
  getSummary,
  getRevenueTrend,
  getCategoryPerformance,
  getRegionPerformance,
  getTopProducts,
  getBusinessInsights,
  getRecentTransactions,
  exportTransactionsCsv
} from '../controllers/analyticsController.js';
import { queryValidator } from '../middleware/queryValidator.js';

const router = express.Router();

// Apply query validation to all analytics endpoints
router.use(queryValidator);

router.get('/summary', getSummary);
router.get('/revenue-trend', getRevenueTrend);
router.get('/category-performance', getCategoryPerformance);
router.get('/region-performance', getRegionPerformance);
router.get('/top-products', getTopProducts);
router.get('/insights', getBusinessInsights);
router.get('/recent-transactions', getRecentTransactions);
router.get('/export/csv', exportTransactionsCsv);

export default router;