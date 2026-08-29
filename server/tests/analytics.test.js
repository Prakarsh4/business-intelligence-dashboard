import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';

describe('Analytics API Integration & Validation Tests', () => {
  before(async () => {
    // Connect to test MongoDB instance or mock if needed
    const mongoUri = process.env.MONGODB_URI_TEST || process.env.MONGODB_URI || 'mongodb://localhost:27017/bi_dashboard_test';
    try {
      await mongoose.connect(mongoUri);
    } catch (err) {
      console.warn('MongoDB connection failed during test setup, skipping DB-dependent tests:', err.message);
    }
  });

  after(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  describe('GET /health', () => {
    it('should return 200 OK and UP status', async () => {
      const res = await request(app).get('/health');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.status, 'UP');
      assert.ok(res.body.timestamp);
    });
  });

  describe('Query Parameter Validation', () => {
    it('should return 400 Bad Request when startDate > endDate', async () => {
      const res = await request(app)
        .get('/api/analytics/summary')
        .query({ startDate: '2026-12-31', endDate: '2026-01-01' });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.success, false);
      assert.strictEqual(res.body.error.message, 'startDate cannot be after endDate.');
    });

    it('should return 400 Bad Request for invalid date string', async () => {
      const res = await request(app)
        .get('/api/analytics/summary')
        .query({ startDate: 'not-a-valid-date' });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.error.message.includes('Invalid startDate'));
    });

    it('should return 400 Bad Request for invalid region enum', async () => {
      const res = await request(app)
        .get('/api/analytics/summary')
        .query({ region: 'InvalidRegionName' });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.error.message.includes('Invalid region'));
    });

    it('should return 400 Bad Request for invalid granularity', async () => {
      const res = await request(app)
        .get('/api/analytics/revenue-trend')
        .query({ granularity: 'yearly' });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.error.message.includes('Invalid granularity'));
    });

    it('should return 400 Bad Request for non-integer page', async () => {
      const res = await request(app)
        .get('/api/analytics/recent-transactions')
        .query({ page: -5 });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.success, false);
    });
  });

  describe('Security Headers (Helmet)', () => {
    it('should include security headers in API responses', async () => {
      const res = await request(app).get('/health');
      assert.strictEqual(res.headers['x-content-type-options'], 'nosniff');
      assert.strictEqual(res.headers['x-frame-options'], 'SAMEORIGIN');
    });
  });
});
