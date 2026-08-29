import React, { useState, useEffect, useCallback } from 'react';
import { DollarSign, TrendingUp, ShoppingBag, Percent, Layers, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Header } from '../components/common/Header';
import { MetricCard } from '../components/common/MetricCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { GlobalFilterToolbar } from '../components/filters/GlobalFilterToolbar';
import { BusinessInsightsPanel } from '../components/insights/BusinessInsightspanel';
import { RevenueTrendChart } from '../components/charts/RevenueTrendChart';
import { CategoryPerformanceChart } from '../components/charts/CategoryPerformanceChart';
import { RegionalPerformanceChart } from '../components/charts/RegionalPerformanceChart';
import { TopProductsChart } from '../components/charts/TopProductsChart';
import { TransactionsTable } from '../components/tables/TransactionsTable';
import { ReportModal } from '../components/common/ReportModal';
import { formatCurrency, formatNumber } from '../utils/formatters';
import {
  fetchSummary,
  fetchRevenueTrend,
  fetchCategoryPerformance,
  fetchRegionalPerformance,
  fetchTopProducts,
  fetchBusinessInsights,
  fetchRecentTransactions,
  exportTransactionsCsv
} from '../api/analyticsApi';

export const Dashboard = () => {
  // Filters synced to URL
  const [filters, setFilters] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      startDate: params.get('startDate') || '',
      endDate: params.get('endDate') || '',
      region: params.get('region') || '',
      category: params.get('category') || '',
      status: params.get('status') || '',
      paymentMethod: params.get('paymentMethod') || ''
    };
  });

  const [granularity, setGranularity] = useState('monthly');
  const [productSortBy, setProductSortBy] = useState('revenue');
  const [tableSearch, setTableSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ sortBy: 'date', sortOrder: 'desc' });
  const [page, setPage] = useState(1);

  // Analytics Data
  const [summaryData, setSummaryData] = useState({ current: null, comparison: null });
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [categoryPerf, setCategoryPerf] = useState([]);
  const [regionalPerf, setRegionalPerf] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [insights, setInsights] = useState([]);
  const [transactionsData, setTransactionsData] = useState({ transactions: [], pagination: {} });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Phase 3 States: Report Modal & Export Feedback
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportNotification, setExportNotification] = useState(null);

  // Synchronize URL with active filters
  const updateUrlParams = useCallback((newFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    const qs = params.toString();
    const newRelativePathQuery = window.location.pathname + (qs ? `?${qs}` : '');
    window.history.replaceState(null, '', newRelativePathQuery);
  }, []);

  const handleFilterChange = (updated) => {
    setFilters((prev) => {
      const next = { ...prev, ...updated };
      updateUrlParams(next);
      return next;
    });
    setPage(1);
  };

  const handleResetFilters = () => {
    const empty = { startDate: '', endDate: '', region: '', category: '', status: '', paymentMethod: '' };
    setFilters(empty);
    updateUrlParams(empty);
    setPage(1);
  };

  const handleSortChange = (field) => {
    setSortConfig((prev) => ({
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'desc' ? 'asc' : 'desc'
    }));
  };

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const activeParams = { ...filters };

      const [sumRes, trendRes, catRes, regRes, topRes, insRes, txnRes] = await Promise.all([
        fetchSummary(activeParams),
        fetchRevenueTrend({ ...activeParams, granularity }),
        fetchCategoryPerformance(activeParams),
        fetchRegionalPerformance(activeParams),
        fetchTopProducts({ ...activeParams, sortBy: productSortBy, limit: 5 }),
        fetchBusinessInsights(activeParams),
        fetchRecentTransactions({
          ...activeParams,
          page,
          limit: 8,
          search: tableSearch,
          sortBy: sortConfig.sortBy,
          sortOrder: sortConfig.sortOrder
        })
      ]);

      setSummaryData(sumRes);
      setRevenueTrend(trendRes);
      setCategoryPerf(catRes);
      setRegionalPerf(regRes);
      setTopProducts(topRes);
      setInsights(insRes);
      setTransactionsData(txnRes);
    } catch (err) {
      setError(err.message || 'Failed to fetch analytics from backend.');
    } finally {
      setLoading(false);
    }
  }, [filters, granularity, productSortBy, page, tableSearch, sortConfig]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleExportCsv = async () => {
    try {
      setExporting(true);
      setExportNotification({ type: 'info', message: 'Generating filtered CSV export...' });
      const filename = await exportTransactionsCsv({ ...filters, search: tableSearch });
      setExportNotification({ type: 'success', message: `Downloaded: ${filename}` });
      setTimeout(() => setExportNotification(null), 4000);
    } catch (err) {
      setExportNotification({ type: 'error', message: err.message || 'Export failed. Please try again.' });
      setTimeout(() => setExportNotification(null), 5000);
    } finally {
      setExporting(false);
    }
  };

  const currentSummary = summaryData.current;
  const comparison = summaryData.comparison;

  return (
    <div className="dashboard-layout">
      <Header />

      <main className="dashboard-content">
        {/* Global Filter Toolbar */}
        <GlobalFilterToolbar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          onOpenReport={() => setIsReportOpen(true)}
          onExportCsv={handleExportCsv}
          exporting={exporting}
        />

        {/* Export Status Banner */}
        {exportNotification && (
          <div className={`notification-banner ${exportNotification.type}`}>
            {exportNotification.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{exportNotification.message}</span>
          </div>
        )}

        {error && (
          <div className="error-banner">
            <div className="error-message">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
            <button className="retry-btn" onClick={loadDashboardData}>
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        {loading && !currentSummary ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* KPI Metric Cards with Period Comparison */}
            <section className="kpi-grid">
              <MetricCard
                title="Total Revenue"
                value={formatCurrency(currentSummary?.totalRevenue)}
                subtitle="Realized sales in period"
                icon={DollarSign}
                delta={comparison?.revenueDelta}
              />
              <MetricCard
                title="Total Profit"
                value={formatCurrency(currentSummary?.totalProfit)}
                subtitle="Net operating return"
                icon={TrendingUp}
                delta={comparison?.profitDelta}
              />
              <MetricCard
                title="Total Orders"
                value={formatNumber(currentSummary?.totalOrders)}
                subtitle="Volume processed"
                icon={ShoppingBag}
                delta={comparison?.ordersDelta}
              />
              <MetricCard
                title="Avg. Order Value"
                value={formatCurrency(currentSummary?.averageOrderValue)}
                subtitle="Mean basket size"
                icon={Percent}
                delta={comparison?.aovDelta}
              />
              <MetricCard
                title="Profit Margin"
                value={`${currentSummary?.profitMargin || 0}%`}
                subtitle="Net conversion rate"
                icon={Layers}
              />
            </section>

            {/* Business Insights Panel */}
            <BusinessInsightsPanel insights={insights} />

            {/* Visualizations Grid */}
            <section className="charts-grid-primary">
              <RevenueTrendChart
                data={revenueTrend}
                granularity={granularity}
                onGranularityChange={setGranularity}
              />
              <CategoryPerformanceChart
                data={categoryPerf}
                onCategorySelect={(cat) => handleFilterChange({ category: cat })}
              />
            </section>

            <section className="charts-grid-secondary">
              <RegionalPerformanceChart
                data={regionalPerf}
                onRegionSelect={(reg) => handleFilterChange({ region: reg })}
              />
              <TopProductsChart
                data={topProducts}
                sortBy={productSortBy}
                onSortByChange={setProductSortBy}
              />
            </section>

            {/* Enhanced Transactions Table */}
            <section className="table-section">
              <TransactionsTable
                transactions={transactionsData.transactions}
                pagination={transactionsData.pagination}
                onPageChange={setPage}
                searchTerm={tableSearch}
                onSearchChange={(val) => {
                  setTableSearch(val);
                  setPage(1);
                }}
                sortConfig={sortConfig}
                onSortChange={handleSortChange}
              />
            </section>
          </>
        )}
      </main>

      {/* Printable Executive Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        filters={filters}
        summaryData={summaryData}
        categoryPerf={categoryPerf}
        regionalPerf={regionalPerf}
        topProducts={topProducts}
        insights={insights}
        onExportCsv={handleExportCsv}
      />
    </div>
  );
};