import { isAdminEmail } from './crypto';

export type OrderLike = {
  status: string;
  amountUsd: number | string;
};

export function isAuthorizedAdmin(email: string | null | undefined): boolean {
  return isAdminEmail(email);
}

export function summarizeOrders(orders: OrderLike[]) {
  return orders.reduce(
    (acc, order) => {
      acc.totalOrders += 1;
      const amount = Number(order.amountUsd) || 0;
      if (['paid', 'shipped', 'delivered'].includes(order.status)) {
        acc.paidOrders += 1;
        acc.totalRevenueUsd += amount;
      }
      if (order.status === 'pending') acc.pendingOrders += 1;
      if (order.status === 'shipped') acc.shippedOrders += 1;
      if (order.status === 'delivered') acc.deliveredOrders += 1;
      return acc;
    },
    {
      totalOrders: 0,
      paidOrders: 0,
      pendingOrders: 0,
      shippedOrders: 0,
      deliveredOrders: 0,
      totalRevenueUsd: 0,
    }
  );
}

