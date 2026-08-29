/**
 * Safely parses and builds MongoDB match conditions from incoming query parameters.
 */
export const buildFilterQuery = (queryParams = {}) => {
  const { startDate, endDate, region, category, status, paymentMethod } = queryParams;
  const match = {};

  // Date Range Filtering
  if (startDate || endDate) {
    match.date = {};
    if (startDate) {
      const start = new Date(startDate);
      if (!isNaN(start.getTime())) {
        start.setHours(0, 0, 0, 0);
        match.date.$gte = start;
      }
    }
    if (endDate) {
      const end = new Date(endDate);
      if (!isNaN(end.getTime())) {
        end.setHours(23, 59, 59, 999);
        match.date.$lte = end;
      }
    }
  }

  // Multi-value helper
  const parseMultiParam = (val) => {
    if (!val) return null;
    const items = val.split(',').map((s) => s.trim()).filter(Boolean);
    return items.length > 0 ? items : null;
  };

  const regions = parseMultiParam(region);
  if (regions) {
    match.region = { $in: regions };
  }

  const categories = parseMultiParam(category);
  if (categories) {
    match.category = { $in: categories };
  }

  const statuses = parseMultiParam(status);
  if (statuses) {
    match.orderStatus = { $in: statuses };
  }

  const payments = parseMultiParam(paymentMethod);
  if (payments) {
    match.paymentMethod = { $in: payments };
  }

  return match;
};

/**
 * Calculates prior comparison date boundary for period-over-period comparisons.
 */
export const getPreviousPeriodDates = (startDate, endDate) => {
  if (!startDate || !endDate) return null;

  const currentStart = new Date(startDate);
  const currentEnd = new Date(endDate);

  if (isNaN(currentStart.getTime()) || isNaN(currentEnd.getTime())) return null;

  const diffTime = currentEnd.getTime() - currentStart.getTime();
  if (diffTime <= 0) return null;

  const previousEnd = new Date(currentStart.getTime() - 1);
  const previousStart = new Date(previousEnd.getTime() - diffTime);

  return {
    previousStart: previousStart.toISOString(),
    previousEnd: previousEnd.toISOString()
  };
};