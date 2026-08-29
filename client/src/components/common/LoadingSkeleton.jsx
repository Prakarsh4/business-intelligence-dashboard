import React from 'react';

export const LoadingSkeleton = () => {
  return (
    <div className="skeleton-container">
      <div className="skeleton-grid-kpi">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton-card skeleton-pulse" />
        ))}
      </div>
      <div className="skeleton-grid-charts">
        <div className="skeleton-chart skeleton-pulse" />
        <div className="skeleton-chart skeleton-pulse" />
      </div>
    </div>
  );
};