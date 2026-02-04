'use client';

import { useEffect, useMemo, useState } from 'react';

type SalesOrder = {
  id: string;
  status: string;
  amountUsd: number;
  tokenAddress: string;
  chainId: number;
  txHash: string | null;
  createdAt: string;
  artworkTitle: string | null;
  buyerEmail: string | null;
  walletAddress: string | null;
  shippingCity: string | null;
  shippingCountry: string | null;
};

type SalesSummary = {
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  totalRevenueUsd: number;
};

type ApiResponse = {
  summary: SalesSummary;
  orders: SalesOrder[];
};

interface Props {
  adminEmail: string;
}

const STATUS_COLOR: Record<string, string> = {
  paid: 'text-green-500',
  pending: 'text-amber-400',
  shipped: 'text-sky-400',
  delivered: 'text-emerald-400',
};

export default function SalesDashboard({ adminEmail }: Props) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/admin/sales', {
          headers: {
            'x-admin-email': adminEmail,
          },
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || 'Failed to load sales');
        }
        const json = (await res.json()) as ApiResponse;
        setData(json);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [adminEmail]);

  const recentOrders = useMemo(() => data?.orders.slice(0, 10) || [], [data]);

  if (loading) {
    return (
      <div className="glass-minimal p-6 rounded-lg">
        <p className="text-sm text-[#8b7d7b]">Loading sales...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-minimal p-6 rounded-lg">
        <p className="text-sm text-[#8b7d7b]">Error: {error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Orders" value={data.summary.totalOrders} />
        <StatCard label="Paid" value={data.summary.paidOrders} accent />
        <StatCard label="Pending" value={data.summary.pendingOrders} />
        <StatCard
          label="Revenue (USD)"
          value={`$${data.summary.totalRevenueUsd.toFixed(2)}`}
          accent
        />
      </div>

      <div className="glass-minimal p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="elegant-text text-sm">Recent sales</h3>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8b7d7b]">
            Last 10 orders
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-[#8b7d7b]">
                <th className="py-2 pr-4">Artwork</th>
                <th className="py-2 pr-4">Buyer</th>
                <th className="py-2 pr-4">Amount</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Ship to</th>
                <th className="py-2 pr-4">Placed</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-t border-[#1a1a1a]">
                  <td className="py-3 pr-4 text-[#e5e5e5]">
                    {order.artworkTitle || '—'}
                    <div className="text-[11px] text-[#8b7d7b]">
                      {order.tokenAddress.slice(0, 6)}... on chain {order.chainId}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="text-[#e5e5e5]">{order.buyerEmail || 'Wallet'}</div>
                    <div className="text-[11px] text-[#8b7d7b]">
                      {order.walletAddress
                        ? `${order.walletAddress.slice(0, 6)}...${order.walletAddress.slice(-4)}`
                        : '—'}
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-[#e5e5e5]">
                    ${order.amountUsd.toFixed(2)}
                  </td>
                  <td className={`py-3 pr-4 ${STATUS_COLOR[order.status] || 'text-[#e5e5e5]'}`}>
                    {order.status}
                  </td>
                  <td className="py-3 pr-4 text-[#e5e5e5]">
                    {order.shippingCity ? `${order.shippingCity}, ${order.shippingCountry}` : '—'}
                  </td>
                  <td className="py-3 pr-4 text-[#8b7d7b]">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent = false }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={`glass-minimal p-4 rounded-lg ${accent ? 'border border-[#8a1c1c]/30' : ''}`}>
      <p className="text-xs text-[#8b7d7b] uppercase tracking-[0.2em] mb-2">{label}</p>
      <p className="text-2xl text-[#e5e5e5] font-light">{value}</p>
    </div>
  );
}
