import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export const MetricCard = ({ title, value, subtitle, icon: Icon, delta, variant = 'default' }) => {
  const renderDelta = () => {
    if (delta === undefined || delta === null) return null;

    const isPositive = delta > 0;
    const isNeutral = delta === 0;

    return (
      <div className={`metric-delta ${isPositive ? 'positive' : isNeutral ? 'neutral' : 'negative'}`}>
        {isPositive && <ArrowUpRight size={14} />}
        {!isPositive && !isNeutral && <ArrowDownRight size={14} />}
        {isNeutral && <Minus size={14} />}
        <span>{Math.abs(delta)}%</span>
        <span className="delta-label">vs prior period</span>
      </div>
    );
  };

  return (
    <div className={`metric-card ${variant}`}>
      <div className="metric-header">
        <span className="metric-title">{title}</span>
        {Icon && (
          <div className="metric-icon-box">
            <Icon size={18} />
          </div>
        )}
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-footer">
        {renderDelta()}
        {subtitle && <span className="metric-subtext">{subtitle}</span>}
      </div>
    </div>
  );
};