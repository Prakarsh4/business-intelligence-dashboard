const VALID_REGIONS = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East'];
const VALID_CATEGORIES = ['Electronics', 'Home & Kitchen', 'Apparel', 'Office Supplies', 'Fitness & Outdoors'];
const VALID_STATUSES = ['Completed', 'Shipped', 'Pending', 'Cancelled', 'Refunded'];
const VALID_PAYMENTS = ['Credit Card', 'Debit Card', 'Bank Transfer', 'UPI / Digital Wallet', 'PayPal'];
const VALID_GRANULARITIES = ['daily', 'weekly', 'monthly'];

/**
 * Validates and sanitizes incoming analytics query parameters.
 */
export const queryValidator = (req, res, next) => {
  const { startDate, endDate, region, category, status, paymentMethod, granularity, page, limit } = req.query;

  // 1. Date Range Validation
  let startParsed = null;
  let endParsed = null;

  if (startDate) {
    startParsed = new Date(startDate);
    if (isNaN(startParsed.getTime())) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid startDate parameter format. Use YYYY-MM-DD.' }
      });
    }
  }

  if (endDate) {
    endParsed = new Date(endDate);
    if (isNaN(endParsed.getTime())) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid endDate parameter format. Use YYYY-MM-DD.' }
      });
    }
  }

  if (startParsed && endParsed && startParsed > endParsed) {
    return res.status(400).json({
      success: false,
      error: { message: 'startDate cannot be after endDate.' }
    });
  }

  // 2. Region Validation
  if (region) {
    const regionList = region.split(',').map((r) => r.trim()).filter(Boolean);
    const invalid = regionList.filter((r) => !VALID_REGIONS.includes(r));
    if (invalid.length > 0) {
      return res.status(400).json({
        success: false,
        error: { message: `Invalid region(s): ${invalid.join(', ')}. Valid options: ${VALID_REGIONS.join(', ')}` }
      });
    }
  }

  // 3. Category Validation
  if (category) {
    const catList = category.split(',').map((c) => c.trim()).filter(Boolean);
    const invalid = catList.filter((c) => !VALID_CATEGORIES.includes(c));
    if (invalid.length > 0) {
      return res.status(400).json({
        success: false,
        error: { message: `Invalid category(s): ${invalid.join(', ')}. Valid options: ${VALID_CATEGORIES.join(', ')}` }
      });
    }
  }

  // 4. Status Validation
  if (status) {
    const statusList = status.split(',').map((s) => s.trim()).filter(Boolean);
    const invalid = statusList.filter((s) => !VALID_STATUSES.includes(s));
    if (invalid.length > 0) {
      return res.status(400).json({
        success: false,
        error: { message: `Invalid status(s): ${invalid.join(', ')}. Valid options: ${VALID_STATUSES.join(', ')}` }
      });
    }
  }

  // 5. Payment Method Validation
  if (paymentMethod) {
    const payList = paymentMethod.split(',').map((p) => p.trim()).filter(Boolean);
    const invalid = payList.filter((p) => !VALID_PAYMENTS.includes(p));
    if (invalid.length > 0) {
      return res.status(400).json({
        success: false,
        error: { message: `Invalid payment method(s): ${invalid.join(', ')}. Valid options: ${VALID_PAYMENTS.join(', ')}` }
      });
    }
  }

  // 6. Granularity Validation
  if (granularity && !VALID_GRANULARITIES.includes(granularity.toLowerCase())) {
    return res.status(400).json({
      success: false,
      error: { message: `Invalid granularity: ${granularity}. Valid options: ${VALID_GRANULARITIES.join(', ')}` }
    });
  }

  // 7. Pagination Validation
  if (page !== undefined && (isNaN(Number(page)) || Number(page) < 1)) {
    return res.status(400).json({
      success: false,
      error: { message: 'page parameter must be a positive integer.' }
    });
  }

  if (limit !== undefined && (isNaN(Number(limit)) || Number(limit) < 1)) {
    return res.status(400).json({
      success: false,
      error: { message: 'limit parameter must be a positive integer.' }
    });
  }

  next();
};
