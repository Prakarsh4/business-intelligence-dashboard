import * as analyticsService from '../services/analyticsService.js';

export const getSummary = async (req, res, next) => {
  try {
    const summary = await analyticsService.getDashboardSummary();
    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    next(error);
  }
};

export const getRevenueTrend = async (req, res, next) => {
  try {
    const trends = await analyticsService.getRevenueTrend();
    res.status(200).json({
      success: true,
      data: trends
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryPerformance = async (req, res, next) => {
  try {
    const categories = await analyticsService.getCategoryPerformance();
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

export const getRegionPerformance = async (req, res, next) => {
  try {
    const regions = await analyticsService.getRegionalPerformance();
    res.status(200).json({
      success: true,
      data: regions
    });
  } catch (error) {
    next(error);
  }
};

export const getTopProducts = async (req, res, next) => {
  try {
    const limit = req.query.limit || 5;
    const topProducts = await analyticsService.getTopProducts(limit);
    res.status(200).json({
      success: true,
      data: topProducts
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentTransactions = async (req, res, next) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const result = await analyticsService.getRecentTransactions(limit, page);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};