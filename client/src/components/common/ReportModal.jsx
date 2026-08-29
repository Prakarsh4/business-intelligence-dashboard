import React from 'react';
import { X, Printer, FileSpreadsheet, Calendar, Filter, Award, TrendingUp, Layers } from 'lucide-react';
import { formatCurrency, formatNumber } from '../../utils/formatters';

export const ReportModal = ({
  isOpen,
  onClose,
  filters,
  summaryData,
  categoryPerf,
  regionalPerf,
  topProducts,
  insights,
  onExportCsv
}) => {
  if (!isOpen) return null;

  const currentSummary = summaryData?.current || {};
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  const activeFilterEntries = Object.entries(filters).filter(([_, val]) => Boolean(val));

  return (
    <div className="report-modal-overlay" onClick={onClose}>
      <div className="report-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Action Header (Hidden during print) */}
        <div className="report-modal-header no-print">
          <div className="report-header-title">
            <Award size={20} className="text-primary" />
            <h2>Executive BI Business Report</h2>
          </div>
          <div className="report-header-actions">
            <button type="button" onClick={onExportCsv} className="btn-secondary">
              <FileSpreadsheet size={15} /> Export CSV
            </button>
            <button type="button" onClick={handlePrint} className="btn-primary">
              <Printer size={15} /> Print / Save PDF
            </button>
            <button type="button" onClick={onClose} className="btn-close" aria-label="Close Report">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div className="report-printable-area">
          {/* Printable Header */}
          <div className="report-doc-header">
            <div>
              <h1 className="doc-title">Executive Business Intelligence Summary Report</h1>
              <p className="doc-subtitle">Confidential Performance Audit & Analytics Review</p>
            </div>
            <div className="doc-meta">
              <div className="doc-meta-item">
                <Calendar size={14} />
                <span><strong>Report Generated:</strong> {currentDate}</span>
              </div>
            </div>
          </div>

          {/* Active Filter Scope Banner */}
          <div className="report-filter-scope">
            <div className="scope-title">
              <Filter size={14} />
              <span>Applied Analysis Scope</span>
            </div>
            <div className="scope-tags">
              {activeFilterEntries.length === 0 ? (
                <span className="scope-tag">All Available Historical Data (No Filters Applied)</span>
              ) : (
                activeFilterEntries.map(([key, val]) => (
                  <span key={key} className="scope-tag">
                    <strong>{key}:</strong> {val}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Key Executive Metrics Grid */}
          <div className="report-section">
            <h3 className="section-heading">1. Key Financial Performance Indicators</h3>
            <div className="report-kpi-grid">
              <div className="report-kpi-box">
                <span className="kpi-label">Total Revenue</span>
                <span className="kpi-val">{formatCurrency(currentSummary.totalRevenue)}</span>
              </div>
              <div className="report-kpi-box">
                <span className="kpi-label">Total Profit</span>
                <span className="kpi-val">{formatCurrency(currentSummary.totalProfit)}</span>
              </div>
              <div className="report-kpi-box">
                <span className="kpi-label">Volume Processed</span>
                <span className="kpi-val">{formatNumber(currentSummary.totalOrders)} Orders</span>
              </div>
              <div className="report-kpi-box">
                <span className="kpi-label">Avg Order Value</span>
                <span className="kpi-val">{formatCurrency(currentSummary.averageOrderValue)}</span>
              </div>
              <div className="report-kpi-box">
                <span className="kpi-label">Net Profit Margin</span>
                <span className="kpi-val">{currentSummary.profitMargin || 0}%</span>
              </div>
            </div>
          </div>

          {/* Business Insights Synthesis */}
          {insights && insights.length > 0 && (
            <div className="report-section">
              <h3 className="section-heading">2. Automated Executive Insights</h3>
              <ul className="report-insights-list">
                {insights.map((item, idx) => (
                  <li key={idx} className={`report-insight-item ${item.type}`}>
                    <strong>{item.title}:</strong> {item.text}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Category & Regional Distribution Tables */}
          <div className="report-grid-two-col">
            <div className="report-section">
              <h3 className="section-heading">3. Category Breakdown</h3>
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th className="text-right">Revenue</th>
                    <th className="text-right">Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryPerf.slice(0, 5).map((cat) => (
                    <tr key={cat.category}>
                      <td>{cat.category}</td>
                      <td className="text-right font-medium">{formatCurrency(cat.revenue)}</td>
                      <td className="text-right">{cat.margin}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="report-section">
              <h3 className="section-heading">4. Regional Contribution</h3>
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Region</th>
                    <th className="text-right">Revenue</th>
                    <th className="text-right">AOV</th>
                  </tr>
                </thead>
                <tbody>
                  {regionalPerf.slice(0, 5).map((reg) => (
                    <tr key={reg.region}>
                      <td>{reg.region}</td>
                      <td className="text-right font-medium">{formatCurrency(reg.revenue)}</td>
                      <td className="text-right">{formatCurrency(reg.avgOrderValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top 5 Products Table */}
          <div className="report-section">
            <h3 className="section-heading">5. Top 5 Performing SKUs</h3>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th className="text-right">Units Sold</th>
                  <th className="text-right">Revenue</th>
                  <th className="text-right">Profit</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.slice(0, 5).map((prod) => (
                  <tr key={prod.product}>
                    <td className="font-medium">{prod.product}</td>
                    <td>{prod.category}</td>
                    <td className="text-right">{formatNumber(prod.unitsSold)}</td>
                    <td className="text-right font-medium">{formatCurrency(prod.revenue)}</td>
                    <td className="text-right text-profit">{formatCurrency(prod.profit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Report Footer */}
          <div className="report-doc-footer">
            <p>End of Executive Business Intelligence Summary Report • Generated automatically by BI Analytics Engine</p>
          </div>
        </div>
      </div>
    </div>
  );
};
