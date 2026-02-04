import { isAuthorizedAdmin, summarizeOrders } from '../../lib/admin';

describe('admin utils', () => {
  it('authorizes only the whitelisted email', () => {
    expect(isAuthorizedAdmin('martinagorozo1@proton.me')).toBe(true);
    expect(isAuthorizedAdmin('other@example.com')).toBe(false);
    expect(isAuthorizedAdmin(null)).toBe(false);
  });

  it('summarizes orders correctly', () => {
    const summary = summarizeOrders([
      { status: 'pending', amountUsd: 50 },
      { status: 'paid', amountUsd: 100 },
      { status: 'shipped', amountUsd: 75 },
      { status: 'delivered', amountUsd: 25 },
    ]);

    expect(summary.totalOrders).toBe(4);
    expect(summary.pendingOrders).toBe(1);
    expect(summary.paidOrders).toBe(3);
    expect(summary.shippedOrders).toBe(1);
    expect(summary.deliveredOrders).toBe(1);
    expect(summary.totalRevenueUsd).toBe(200);
  });
});
