import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import { MetricCard } from './components/common/MetricCard';
import { GlobalFilterToolbar } from './components/filters/GlobalFilterToolbar';
import { formatCurrency, formatNumber, formatDate } from './utils/formatters';

beforeEach(() => {
  cleanup();
});

describe('Utility Formatters', () => {
  it('should format currency values correctly', () => {
    expect(formatCurrency(12500)).toContain('12,500');
    expect(formatCurrency(0)).toContain('0');
    expect(formatCurrency(null)).toContain('0');
  });

  it('should format number with locale commas', () => {
    expect(formatNumber(1500)).toBe('1,500');
    expect(formatNumber(0)).toBe('0');
  });

  it('should format valid date strings', () => {
    expect(formatDate('2026-03-15')).toContain('Mar');
  });
});

describe('MetricCard Component', () => {
  it('should render title and formatted value', () => {
    render(<MetricCard title="Total Revenue" value="$25,400.00" subtitle="Test period" delta={12.4} />);
    expect(screen.getByText('Total Revenue')).toBeDefined();
    expect(screen.getByText('$25,400.00')).toBeDefined();
    expect(screen.getByText('12.4%')).toBeDefined();
  });
});

describe('GlobalFilterToolbar Component', () => {
  it('should render toolbar header and controls', () => {
    const mockFilters = { startDate: '', endDate: '', region: '', category: '', status: '', paymentMethod: '' };
    render(
      <GlobalFilterToolbar
        filters={mockFilters}
        onFilterChange={() => {}}
        onReset={() => {}}
        onOpenReport={() => {}}
        onExportCsv={() => {}}
        exporting={false}
      />
    );
    expect(screen.getByText('Global Analysis Controls')).toBeDefined();
    expect(screen.getAllByRole('button', { name: /Export CSV/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Executive Report/i }).length).toBeGreaterThan(0);
  });

  it('should trigger onExportCsv when Export CSV button is clicked', () => {
    const onExportCsvMock = vi.fn();
    const mockFilters = { startDate: '', endDate: '', region: '', category: '', status: '', paymentMethod: '' };

    render(
      <GlobalFilterToolbar
        filters={mockFilters}
        onFilterChange={() => {}}
        onReset={() => {}}
        onOpenReport={() => {}}
        onExportCsv={onExportCsvMock}
        exporting={false}
      />
    );

    const exportBtns = screen.getAllByRole('button', { name: /Export CSV/i });
    fireEvent.click(exportBtns[0]);
    expect(onExportCsvMock).toHaveBeenCalledTimes(1);
  });
});
