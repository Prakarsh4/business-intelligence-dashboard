import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

export const TopProductsChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="chart-empty">No product data available.</div>;
  }

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Top 5 Products</h3>
        <span className="chart-subtitle">Highest Revenue Generators</span>
      </div>
      <div className="chart-body">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
            <XAxis
              type="number"
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
            />
            <YAxis
              dataKey="product"
              type="category"
              stroke="#64748b"
              fontSize={11}
              width={140}
              tickLine={false}
            />
            <Tooltip
              formatter={(value) => [formatCurrency(value), 'Revenue']}
              contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', border: 'none' }}
            />
            <Bar dataKey="revenue" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={22} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};