'use client';

import { useState } from 'react';
import { Loader2, CheckCircle } from 'lucide-react';

interface ShippingFormProps {
  orderId: string;
  onSuccess: () => void;
  onClose: () => void;
}

interface ShippingData {
  fullName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export default function ShippingForm({ orderId, onSuccess, onClose }: ShippingFormProps) {
  const [formData, setFormData] = useState<ShippingData>({
    fullName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          ...formData,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save shipping address');
      }

      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save address');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-8 max-w-md w-full mx-4 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-cinzel text-[#e5e5e5] mb-2">
            Address Saved!
          </h3>
          <p className="text-sm text-[#606060]">
            Martina will contact you soon with shipping details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 overflow-y-auto">
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 max-w-lg w-full my-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-cinzel text-[#e5e5e5]">
              Shipping Address
            </h3>
            <p className="text-sm text-[#606060] mt-1">
              Where should we send your artwork?
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#606060] hover:text-[#e5e5e5] transition-colors"
          >
            &times;
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 border border-red-900/50 bg-red-900/10 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[#606060] uppercase tracking-wider mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="w-full bg-transparent border border-[#1a1a1a] px-4 py-3 text-[#e5e5e5] focus:border-[#8a1c1c] focus:outline-none transition-colors"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-xs text-[#606060] uppercase tracking-wider mb-2">
              Address *
            </label>
            <textarea
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              rows={2}
              className="w-full bg-transparent border border-[#1a1a1a] px-4 py-3 text-[#e5e5e5] focus:border-[#8a1c1c] focus:outline-none transition-colors resize-none"
              placeholder="Street address, apartment, suite, etc."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#606060] uppercase tracking-wider mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full bg-transparent border border-[#1a1a1a] px-4 py-3 text-[#e5e5e5] focus:border-[#8a1c1c] focus:outline-none transition-colors"
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-xs text-[#606060] uppercase tracking-wider mb-2">
                State / Province
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full bg-transparent border border-[#1a1a1a] px-4 py-3 text-[#e5e5e5] focus:border-[#8a1c1c] focus:outline-none transition-colors"
                placeholder="State"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#606060] uppercase tracking-wider mb-2">
                Postal Code *
              </label>
              <input
                type="text"
                name="postalCode"
                required
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full bg-transparent border border-[#1a1a1a] px-4 py-3 text-[#e5e5e5] focus:border-[#8a1c1c] focus:outline-none transition-colors"
                placeholder="12345"
              />
            </div>
            <div>
              <label className="block text-xs text-[#606060] uppercase tracking-wider mb-2">
                Country *
              </label>
              <input
                type="text"
                name="country"
                required
                value={formData.country}
                onChange={handleChange}
                className="w-full bg-transparent border border-[#1a1a1a] px-4 py-3 text-[#e5e5e5] focus:border-[#8a1c1c] focus:outline-none transition-colors"
                placeholder="Country"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#606060] uppercase tracking-wider mb-2">
              Phone (for delivery)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-transparent border border-[#1a1a1a] px-4 py-3 text-[#e5e5e5] focus:border-[#8a1c1c] focus:outline-none transition-colors"
              placeholder="+1 234 567 8900"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-[#1a1a1a] text-[#606060] hover:border-[#303030] hover:text-[#e5e5e5] transition-colors"
            >
              Later
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 flex items-center justify-center gap-2 border border-[#8a1c1c] bg-[#8a1c1c]/10 text-[#e5e5e5] hover:bg-[#8a1c1c]/20 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Address'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
