import Transaction from '../models/Transaction.js';

export const getDashboardSummary = async () => {
  const summary = await Transaction.aggregate([
    {
      $facet: {
        allOrders: [
          {
            $group: {
              _id: null,
              totalOrders: { $sum: 1 },
              totalRevenue: { $sum: '$salesAmount' },
              totalProfit: { $sum: '$profit' },
              totalQuantity: { $sum: '$quantity' }
            }
          }
        ],
        completedOrders: [
          {
            $match: {
              orderStatus: { $nin: ['Cancelled', 'Refunded'] }
            }
          },
          {
            $group: {
              _id: null,
              realizedRevenue: { $sum: '$salesAmount' },
              realizedProfit: { $sum: '$profit' },
              realizedOrders: { $sum: 1 }
            }
          }
        ]
      }
    }
  ]);

  const raw = summary[0]?.allOrders[0] || { totalOrders: 0, totalRevenue: 0, totalProfit: 0, totalQuantity: 0 };
  const realized = summary[0]?.completedOrders[0] || { realizedRevenue: 0, realizedProfit: 0, realizedOrders: 0 };

  const totalRevenue = Number(raw.totalRevenue.toFixed(2));
  const totalProfit = Number(raw.totalProfit.toFixed(2));
  const totalOrders = raw.totalOrders;
  const totalQuantity = raw.totalQuantity;

  const averageOrderValue = totalOrders > 0 ? Number((totalRevenue / totalOrders).toFixed(2)) : 0;
  const profitMargin = totalRevenue > 0 ? Number(((totalProfit / totalRevenue) * 100).toFixed(2)) : 0;

  return {
    totalRevenue,
    totalProfit,
    totalOrders,
    totalQuantity,
    averageOrderValue,
    profitMargin,
    completedRevenue: Number(realized.realizedRevenue.toFixed(2)),
    completedOrdersCount: realized.realizedOrders
  };
};

export const getRevenueTrend = async () => {
  return await Transaction.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' }
        },
        revenue: { $sum: '$salesAmount' },
        profit: { $sum: '$profit' },
        orders: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }     },     {$project: {
        _id: 0,
        period: {
          $concat: [
            { $toString: '$_id.year' },
            '-',
            {
              $cond: [
                { $lt: ['$_id.month', 10] },                 {$concat: ['0', { $toString: '$_id.month' }] },
                { $toString: '$_id.month' }
              ]
            }
          ]
        },
        revenue: { $round: ['$revenue', 2] },
        profit: { $round: ['$profit', 2] },
        orders: 1
      }
    }
  ]);
};

export const getCategoryPerformance = async () => {
  return await Transaction.aggregate([
    {
      $group: {
        _id: '$category',
        revenue: { $sum: '$salesAmount' },
        profit: { $sum: '$profit' },
        orders: { $sum: 1 },
        unitsSold: { $sum: '$quantity' }
      }
    },
    {
      $sort: { revenue: -1 }     },     {$project: {
        _id: 0,
        category: '$_id',
        revenue: { $round: ['$revenue', 2] },
        profit: { $round: ['$profit', 2] },
        orders: 1,
        unitsSold: 1
      }
    }
  ]);
};

export const getRegionalPerformance = async () => {
  return await Transaction.aggregate([
    {
      $group: {
        _id: '$region',
        revenue: { $sum: '$salesAmount' },
        profit: { $sum: '$profit' },
        orders: { $sum: 1 }
      }
    },
    {
      $sort: { revenue: -1 }     },     {$project: {
        _id: 0,
        region: '$_id',
        revenue: { $round: ['$revenue', 2] },
        profit: { $round: ['$profit', 2] },
        orders: 1
      }
    }
  ]);
};

export const getTopProducts = async (limit = 5) => {
  return await Transaction.aggregate([
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
    {
      $sort: { revenue: -1 }     },     {$limit: Number(limit)
    },
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

export const getRecentTransactions = async (limit = 10, page = 1) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Transaction.find()
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-__v -createdAt -updatedAt')
      .lean(),
    Transaction.countDocuments()
  ]);

  return {
    transactions: data,
    pagination: {
      totalRecords: total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    }
  };
};