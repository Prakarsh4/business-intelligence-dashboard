import Transaction from '../models/Transaction.js';
import { buildFilterQuery, getPreviousPeriodDates } from '../utils/filterBuilder.js';

export const getDashboardSummary = async (queryParams = {}) => {
  const matchFilter = buildFilterQuery(queryParams);

  const calculateMetrics = async (matchStage) => {
    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$salesAmount' },
          totalProfit: { $sum: '$profit' },
          totalOrders: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' }
        }
      }
    ];
    const res = await Transaction.aggregate(pipeline);
    const data = res[0] || { totalRevenue: 0, totalProfit: 0, totalOrders: 0, totalQuantity: 0 };
    const totalRevenue = Number(data.totalRevenue.toFixed(2));
    const totalProfit = Number(data.profit ? data.profit.toFixed(2) : data.totalProfit.toFixed(2));
    const averageOrderValue = data.totalOrders > 0 ? Number((totalRevenue / data.totalOrders).toFixed(2)) : 0;
    const profitMargin = totalRevenue > 0 ? Number(((totalProfit / totalRevenue) * 100).toFixed(2)) : 0;

    return {
      totalRevenue,
      totalProfit,
      totalOrders: data.totalOrders,
      totalQuantity: data.totalQuantity,
      averageOrderValue,
      profitMargin
    };
  };

  // 1. Current Period
  const current = await calculateMetrics(matchFilter);

  // 2. Dynamic Period Comparison Calculation
  let comparison = null;
  const { startDate, endDate } = queryParams;
  const previousDates = getPreviousPeriodDates(startDate, endDate);

  if (previousDates) {
    const previousFilter = buildFilterQuery({
      ...queryParams,
      startDate: previousDates.previousStart,
      endDate: previousDates.previousEnd
    });

    const previous = await calculateMetrics(previousFilter);

    const calcPercentDelta = (curr, prev) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return Number((((curr - prev) / prev) * 100).toFixed(2));
    };

    comparison = {
      revenueDelta: calcPercentDelta(current.totalRevenue, previous.totalRevenue),
      profitDelta: calcPercentDelta(current.totalProfit, previous.totalProfit),
      ordersDelta: calcPercentDelta(current.totalOrders, previous.totalOrders),
      aovDelta: calcPercentDelta(current.averageOrderValue, previous.averageOrderValue),
      previousValues: previous
    };
  }

  return {
    current,
    comparison
  };
};

export const getRevenueTrend = async (queryParams = {}) => {
  const matchFilter = buildFilterQuery(queryParams);
  const { granularity = 'monthly' } = queryParams;

  let dateGrouping;
  let periodFormat;

  if (granularity === 'daily') {
    dateGrouping = {
      year: { $year: '$date' },
      month: { $month: '$date' },
      day: { $dayOfMonth: '$date' }
    };
    periodFormat = {
      $concat: [
        { $toString: '$_id.year' },
        '-',
        { $cond: [{ $lt: ['$_id.month', 10] }, { $concat: ['0', { $toString: '$_id.month' }] }, { $toString: '$_id.month' }] },
        '-',
        { $cond: [{ $lt: ['$_id.day', 10] }, { $concat: ['0', { $toString: '$_id.day' }] }, { $toString: '$_id.day' }] }
      ]
    };
  } else if (granularity === 'weekly') {
    dateGrouping = {
      year: { $year: '$date' },
      week: { $isoWeek: '$date' }
    };
    periodFormat = {
      $concat: [{ $toString: '$_id.year' }, '-W', { $toString: '$_id.week' }]
    };
  } else {
    // Default: Monthly
    dateGrouping = {
      year: { $year: '$date' },
      month: { $month: '$date' }
    };
    periodFormat = {
      $concat: [
        { $toString: '$_id.year' },
        '-',
        { $cond: [{ $lt: ['$_id.month', 10] }, { $concat: ['0', { $toString: '$_id.month' }] }, { $toString: '$_id.month' }] }
      ]
    };
  }

  return await Transaction.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: dateGrouping,
        revenue: { $sum: '$salesAmount' },
        profit: { $sum: '$profit' },
        orders: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.week': 1 } },
    {
      $project: {
        _id: 0,
        period: periodFormat,
        revenue: { $round: ['$revenue', 2] },
        profit: { $round: ['$profit', 2] },
        orders: 1
      }
    }
  ]);
};

export const getCategoryPerformance = async (queryParams = {}) => {
  const matchFilter = buildFilterQuery(queryParams);

  return await Transaction.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: '$category',
        revenue: { $sum: '$salesAmount' },
        profit: { $sum: '$profit' },
        orders: { $sum: 1 },
        unitsSold: { $sum: '$quantity' }
      }
    },
    { $sort: { revenue: -1 } },
    {
      $project: {
        _id: 0,
        category: '$_id',
        revenue: { $round: ['$revenue', 2] },
        profit: { $round: ['$profit', 2] },
        orders: 1,
        unitsSold: 1,
        margin: {
          $cond: [
            { $gt: ['$revenue', 0] },
            { $round: [{ $multiply: [{ $divide: ['$profit', '$revenue'] }, 100] }, 2] },
            0
          ]
        }
      }
    }
  ]);
};

export const getRegionalPerformance = async (queryParams = {}) => {
  const matchFilter = buildFilterQuery(queryParams);

  return await Transaction.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: '$region',
        revenue: { $sum: '$salesAmount' },
        profit: { $sum: '$profit' },
        orders: { $sum: 1 },
        unitsSold: { $sum: '$quantity' }
      }
    },
    { $sort: { revenue: -1 } },
    {
      $project: {
        _id: 0,
        region: '$_id',
        revenue: { $round: ['$revenue', 2] },
        profit: { $round: ['$profit', 2] },
        orders: 1,
        avgOrderValue: {
          $cond: [{ $gt: ['$orders', 0] }, { $round: [{ $divide: ['$revenue', '$orders'] }, 2] }, 0]
        }
      }
    }
  ]);
};

export const getTopProducts = async (queryParams = {}) => {
  const matchFilter = buildFilterQuery(queryParams);
  const { limit = 5, sortBy = 'revenue' } = queryParams;
  const sortStage = sortBy === 'profit' ? { profit: -1 } : { revenue: -1 };

  return await Transaction.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: '$product',
        category: { $first: '$category' },
        revenue: { $sum: '$salesAmount' },
        profit: { $sum: '$profit' },
        unitsSold: { $sum: '$quantity' },
        orders: { $sum: 1 }
      }
    },
    { $sort: sortStage },
    { $limit: Number(limit) },
    {
      $project: {
        _id: 0,
        product: '$_id',
        category: 1,
        revenue: { $round: ['$revenue', 2] },
        profit: { $round: ['$profit', 2] },
        unitsSold: 1,
        orders: 1
      }
    }
  ]);
};

export const getBusinessInsights = async (queryParams = {}) => {
  const matchFilter = buildFilterQuery(queryParams);

  const [categories, regions, products, summaryRes] = await Promise.all([
    getCategoryPerformance(queryParams),
    getRegionalPerformance(queryParams),
    getTopProducts({ ...queryParams, limit: 1 }),
    getDashboardSummary(queryParams)
  ]);

  const insights = [];

  if (categories.length > 0) {
    const topCat = categories[0];
    const lowestCat = categories[categories.length - 1];
    insights.push({
      type: 'positive',
      title: 'Top Category Driver',
      text: `${topCat.category} leads sales, generating $${topCat.revenue.toLocaleString()} (${topCat.margin}% margin).`
    });

    if (categories.length > 1) {
      insights.push({
        type: 'warning',
        title: 'Lowest Category Contribution',
        text: `${lowestCat.category} accounted for only $${lowestCat.revenue.toLocaleString()} across ${lowestCat.orders} orders.`
      });
    }
  }

  if (regions.length > 0) {
    const topRegion = regions[0];
    insights.push({
      type: 'info',
      title: 'Dominant Territory',
      text: `${topRegion.region} generated the highest revenue with an average order value of $${topRegion.avgOrderValue}.`
    });
  }

  if (products.length > 0) {
    const topProd = products[0];
    insights.push({
      type: 'positive',
      title: 'Best Selling SKU',
      text: `"${topProd.product}" is currently the #1 product generating $${topProd.revenue.toLocaleString()}.`
    });
  }

  if (summaryRes.comparison) {
    const revDelta = summaryRes.comparison.revenueDelta;
    const isUp = revDelta >= 0;
    insights.push({
      type: isUp ? 'positive' : 'negative',
      title: 'Period-over-Period Trajectory',
      text: `Revenue is ${isUp ? 'up' : 'down'} by ${Math.abs(revDelta)}% compared to the immediately preceding time window.`
    });
  }

  return insights;
};

export const getRecentTransactions = async (queryParams = {}) => {
  const { limit = 10, page = 1, search, sortBy = 'date', sortOrder = 'desc' } = queryParams;
  const matchFilter = buildFilterQuery(queryParams);

  // Search filter across customer, product, and transactionId
  if (search && search.trim()) {
    const regex = new RegExp(search.trim(), 'i');
    matchFilter.$or = [{ customer: regex }, { product: regex }, { transactionId: regex }];
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const skip = (Number(page) - 1) * Number(limit);

  const [data, total] = await Promise.all([
    Transaction.find(matchFilter)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit))
      .select('-__v -createdAt -updatedAt')
      .lean(),
    Transaction.countDocuments(matchFilter)
  ]);

  return {
    transactions: data,
    pagination: {
      totalRecords: total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    }
  };
};

export const exportTransactionsCsv = async (queryParams = {}) => {
  const matchFilter = buildFilterQuery(queryParams);

  const { search } = queryParams;
  if (search && search.trim()) {
    const regex = new RegExp(search.trim(), 'i');
    matchFilter.$or = [{ customer: regex }, { product: regex }, { transactionId: regex }];
  }

  // Fetch filtered transactions (capped at 5000 for safety)
  const transactions = await Transaction.find(matchFilter)
    .sort({ date: -1 })
    .limit(5000)
    .select('-__v -createdAt -updatedAt')
    .lean();

  const headers = [
    'Transaction ID',
    'Date',
    'Customer',
    'Product',
    'Category',
    'Region',
    'Sales Amount ($)',
    'Quantity',
    'Profit ($)',
    'Payment Method',
    'Order Status'
  ];

  const escapeCsv = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = transactions.map((t) => [
    escapeCsv(t.transactionId),
    escapeCsv(t.date ? new Date(t.date).toISOString().split('T')[0] : ''),
    escapeCsv(t.customer),
    escapeCsv(t.product),
    escapeCsv(t.category),
    escapeCsv(t.region),
    escapeCsv(t.salesAmount),
    escapeCsv(t.quantity),
    escapeCsv(t.profit),
    escapeCsv(t.paymentMethod),
    escapeCsv(t.orderStatus)
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
};