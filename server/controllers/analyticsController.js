import * as analyticsService from '../services/analyticsService.js';

export const getSummary = async (req, res, next) => {
  try {
    const summary = await analyticsService.getDashboardSummary(req.query);
    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
};

export const getRevenueTrend = async (req, res, next) => {
  try {
    const trends = await analyticsService.getRevenueTrend(req.query);
    res.status(200).json({ success: true, data: trends });
  } catch (error) {
    next(error);
  }
};

export const getCategoryPerformance = async (req, res, next) => {
  try {
    const categories = await analyticsService.getCategoryPerformance(req.query);
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

export const getRegionPerformance = async (req, res, next) => {
  try {
    const regions = await analyticsService.getRegionalPerformance(req.query);
    res.status(200).json({ success: true, data: regions });
  } catch (error) {
    next(error);
  }
};

export const getTopProducts = async (req, res, next) => {
  try {
    const topProducts = await analyticsService.getTopProducts(req.query);
    res.status(200).json({ success: true, data: topProducts });
  } catch (error) {
    next(error);
  }
};

export const getBusinessInsights = async (req, res, next) => {
  try {
    const insights = await analyticsService.getBusinessInsights(req.query);
    res.status(200).json({ success: true, data: insights });
  } catch (error) {
    next(error);
  }
};

export const getRecentTransactions = async (req, res, next) => {
  try {
    const result = await analyticsService.getRecentTransactions(req.query);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const exportTransactionsCsv = async (req, res, next) => {
  try {
    const csvContent = await analyticsService.exportTransactionsCsv(req.query);
    const { startDate, endDate } = req.query;
    let filename = 'business-analytics';
    if (startDate && endDate) {
      filename += `-${startDate}-to-${endDate}`;
    } else {
      filename += '-filtered';
    }
    filename += '.csv';

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};