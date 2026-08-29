import React from 'react';
import { Filter, X, RotateCcw, FileSpreadsheet, FileText } from 'lucide-react';

const REGIONS = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East'];
const CATEGORIES = ['Electronics', 'Home & Kitchen', 'Apparel', 'Office Supplies', 'Fitness & Outdoors'];
const STATUSES = ['Completed', 'Shipped', 'Pending', 'Cancelled', 'Refunded'];

export const GlobalFilterToolbar = ({
  filters,
  onFilterChange,
  onReset,
  onOpenReport,
  onExportCsv,
  exporting
}) => {
  const handleDatePreset = (preset) => {
    const now = new Date();
    let start = null;
    let end = now.toISOString().split('T')[0];

    if (preset === '7d') {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      start = d.toISOString().split('T')[0];
    } else if (preset === '30d') {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      start = d.toISOString().split('T')[0];
    } else if (preset === '90d') {
      const d = new Date();
      d.setDate(d.getDate() - 90);
      start = d.toISOString().split('T')[0];
    } else if (preset === 'ytd') {
      start = `${now.getFullYear()}-01-01`;
    } else if (preset === 'all') {
      start = '';
      end = '';
    }

    onFilterChange({ startDate: start, endDate: end });
  };

  const hasActiveFilters = Object.values(filters).some((v) => Boolean(v));

  return (
    <div className="filter-toolbar">
      <div className="filter-header">
        <div className="filter-title-box">
          <Filter size={16} />
          <span>Global Analysis Controls</span>
        </div>

        <div className="filter-header-actions">
          <button
            type="button"
            className="action-btn btn-export"
            onClick={onExportCsv}
            disabled={exporting}
            title="Export filtered transactions as CSV file"
          >
            <FileSpreadsheet size={14} />
            {exporting ? 'Exporting CSV...' : 'Export CSV'}
          </button>

          <button
            type="button"
            className="action-btn btn-report"
            onClick={onOpenReport}
            title="Generate printable Executive BI Summary Report"
          >
            <FileText size={14} />
            Executive Report
          </button>

          {hasActiveFilters && (
            <button className="filter-reset-btn" onClick={onReset} title="Clear all active filters">
              <RotateCcw size={14} /> Reset
            </button>
          )}
        </div>
      </div>

      <div className="filter-controls-grid">
        {/* Date Preset Selector */}
        <div className="filter-group">
          <label className="filter-label">Date Presets</label>
          <div className="preset-buttons">
            <button type="button" onClick={() => handleDatePreset('30d')} className="preset-btn">30D</button>
            <button type="button" onClick={() => handleDatePreset('90d')} className="preset-btn">90D</button>
            <button type="button" onClick={() => handleDatePreset('ytd')} className="preset-btn">YTD</button>
            <button type="button" onClick={() => handleDatePreset('all')} className="preset-btn">All</button>
          </div>
        </div>

        {/* Custom Start / End Dates */}
        <div className="filter-group">
          <label className="filter-label">From</label>
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => onFilterChange({ startDate: e.target.value })}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">To</label>
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => onFilterChange({ endDate: e.target.value })}
            className="filter-input"
          />
        </div>

        {/* Region */}
        <div className="filter-group">
          <label className="filter-label">Region</label>
          <select
            value={filters.region || ''}
            onChange={(e) => onFilterChange({ region: e.target.value })}
            className="filter-select"
          >
            <option value="">All Regions</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="filter-group">
          <label className="filter-label">Category</label>
          <select
            value={filters.category || ''}
            onChange={(e) => onFilterChange({ category: e.target.value })}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="filter-group">
          <label className="filter-label">Order Status</label>
          <select
            value={filters.status || ''}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="filter-chips-row">
          <span className="chips-label">Active Scope:</span>
          {Object.entries(filters).map(([k, v]) => {
            if (!v) return null;
            return (
              <span key={k} className="filter-chip">
                <strong>{k}:</strong> {v}
                <button
                  type="button"
                  onClick={() => onFilterChange({ [k]: '' })}
                  className="chip-remove"
                  aria-label={`Remove filter ${k}`}
                >
                  <X size={12} />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};