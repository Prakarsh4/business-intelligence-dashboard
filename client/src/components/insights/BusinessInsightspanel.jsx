import React from 'react';
import { Lightbulb, TrendingUp, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export const BusinessInsightsPanel = ({ insights = [] }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'positive':
        return <CheckCircle2 size={16} className="insight-icon positive" />;
      case 'warning':
        return <AlertTriangle size={16} className="insight-icon warning" />;
      case 'negative':
        return <AlertTriangle size={16} className="insight-icon danger" />;
      default:
        return <Info size={16} className="insight-icon info" />;
    }
  };

  if (!insights || insights.length === 0) return null;

  return (
    <div className="insights-card">
      <div className="insights-header">
        <div className="insights-title-box">
          <Lightbulb size={18} className="bulb-icon" />
          <h3>Deterministic Business Insights</h3>
        </div>
        <span className="insights-badge">Automated Synthesis</span>
      </div>
      <div className="insights-grid">
        {insights.map((item, idx) => (
          <div key={idx} className={`insight-tile ${item.type}`}>
            <div className="insight-tile-header">
              {getIcon(item.type)}
              <span className="insight-tile-title">{item.title}</span>
            </div>
            <p className="insight-tile-text">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};