import React, { useState } from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ChevronLeft, ChevronRight, Search, ArrowUpDown } from 'lucide-react';

export const TransactionsTable = ({
  transactions = [],
  pagination = {},
  onPageChange,
  searchTerm,
  onSearchChange,
  sortConfig,
  onSortChange
}) => {
  const [localSearch, setLocalSearch] = useState(searchTerm || '');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearchChange(localSearch);
  };

  const getStatusBadge = (status) => {
    const map = {
      Completed: 'badge-success',
      Shipped: 'badge-info',
      Pending: 'badge-warning',
      Cancelled: 'badge-danger',
      Refunded: 'badge-muted'
    };
    return <span className={`status-badge ${map[status] || 'badge-muted'}`}>{status}</span>;
  };

  return (
    <div className="table-card">
      <div className="table-header-box">
        <div>
          <h3 className="table-title">Transactions Audit Stream</h3>
          <p className="table-subtitle">Server-side filtered & paginated record inspection</p>
        </div>
        <form onSubmit={handleSearchSubmit} className="table-search-form">
          <div className="search-input-wrapper">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Search customer, SKU, ID..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="table-search-input"
            />
          </div>
          <button type="submit" className="table-search-btn">Search</button>
        </form>
      </div>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th onClick={() => onSortChange('transactionId')} className="cursor-pointer">
                ID <ArrowUpDown size={12} />
              </th>
              <th onClick={() => onSortChange('date')} className="cursor-pointer">
                Date <ArrowUpDown size={12} />
              </th>
              <th>Customer</th>
              <th>Product</th>
              <th>Category</th>
              <th>Region</th>
              <th onClick={() => onSortChange('salesAmount')} className="text-right cursor-pointer">
                Revenue <ArrowUpDown size={12} />
              </th>
              <th onClick={() => onSortChange('profit')} className="text-right cursor-pointer">
                Profit <ArrowUpDown size={12} />
              </th>
              <th className="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-6 text-muted">
                  No matching transaction records found.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.transactionId || tx._id}>
                  <td className="font-mono text-muted">{tx.transactionId}</td>
                  <td>{formatDate(tx.date)}</td>
                  <td className="font-medium">{tx.customer}</td>
                  <td className="text-truncate" style={{ maxWidth: '180px' }}>{tx.product}</td>
                  <td><span className="category-pill">{tx.category}</span></td>
                  <td>{tx.region}</td>
                  <td className="text-right font-medium">{formatCurrency(tx.salesAmount)}</td>
                  <td className={`text-right ${tx.profit >= 0 ? 'text-profit' : 'text-loss'}`}>
                    {formatCurrency(tx.profit)}
                  </td>
                  <td className="text-center">{getStatusBadge(tx.orderStatus)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="pagination-bar">
          <span className="pagination-info">
            Showing Page {pagination.page} of {pagination.totalPages} ({pagination.totalRecords} total entries)
          </span>
          <div className="pagination-actions">
            <button
              disabled={pagination.page <= 1}
              onClick={() => onPageChange(pagination.page - 1)}
              className="pagination-btn"
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange(pagination.page + 1)}
              className="pagination-btn"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};