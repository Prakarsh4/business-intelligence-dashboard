import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

export const CategoryPerformanceChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="chart-empty">No category data available.</div>;
  }

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Category Breakdown</h3>
        <span className="chart-subtitle">Revenue vs. Realized Margin</span>
      </div>
      <div className="chart-body">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="category"
              stroke="#64748b"
              fontSize={11}
              interval={0}
              tickLine={false}
              angle={-15}
              textAnchor="end"
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
            />
            <Tooltip
              formatter={(value, name) => [formatCurrency(value), name === 'revenue' ? 'Revenue' : 'Profit']}
              contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', border: 'none' }}
            />
            <Legend verticalAlign="top" height={36} iconType="rect" />
            <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Revenue" />
            <Bar dataKey="profit" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Profit" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};