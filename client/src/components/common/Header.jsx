import React from 'react';
import { LayoutDashboard, Calendar, ShieldCheck } from 'lucide-react';

export const Header = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="header-container">
      <div className="header-brand">
        <div className="header-logo-badge">
          <LayoutDashboard size={22} />
        </div>
        <div>
          <h1 className="header-title">Executive BI & Analytics</h1>
          <p className="header-subtitle">Phase 1: Foundation & Core Analytics Engine</p>
        </div>
      </div>
      <div className="header-meta">
        <div className="meta-badge">
          <Calendar size={15} />
          <span>{currentDate}</span>
        </div>
        <div className="meta-badge status-live">
          <ShieldCheck size={15} />
          <span>Live Data Source</span>
        </div>
      </div>
    </header>
  );
};