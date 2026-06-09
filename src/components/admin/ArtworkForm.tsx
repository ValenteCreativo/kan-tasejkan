'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Check } from 'lucide-react';
import type { ArtworkFormData } from '../../types';

// ── Suggested values for quick selection ──
const CATEGORY_SUGGESTIONS = ['digital', 'illustration', 'painting', 'mixed-media', 'photography', 'print'];
const MEDIUM_SUGGESTIONS = ['Digital', 'Acrylic on Canvas', 'Ink on Paper', 'Mixed Media', 'Watercolor', 'Oil', 'Charcoal', 'Collage'];
const TECHNIQUE_SUGGESTIONS = ['Handpoke', 'Machine', 'Blackwork', 'Dotwork', 'Geometric', 'Fineline', 'Ornamental', 'Watercolor'];
const DIMENSION_PRESETS = ['A5 (5.8 × 8.3 in)', 'A4 (8.3 × 11.7 in)', 'A3 (11.7 × 16.5 in)', '30 × 30 cm', '50 × 70 cm', 'Custom'];

interface ArtworkFormProps {
  onSubmit: (data: ArtworkFormData, file: File | null) => Promise<void>;
  initialData?: ArtworkFormData;
  isEdit?: boolean;
  defaultCategory?: string;
}

export default function ArtworkForm({ onSubmit, initialData, isEdit = false, defaultCategory }: ArtworkFormProps) {
  const [formData, setFormData] = useState<ArtworkFormData>(initialData || {
    title: '',
    description: '',
    category: defaultCategory || '',
    year: new Date().getFullYear(),
    medium: '',
    technique: '',
    dimensions: '',
    price: undefined,
    available: true,
    featured: false,
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const isTattoo = defaultCategory === 'tattoo';

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !isEdit) return;

    setLoading(true);
    setSuccess(false);
    try {
      await onSubmit(formData, file);
      // Reset form on success
      setFormData({
        title: '',
        description: '',
        category: defaultCategory || '',
        year: new Date().getFullYear(),
        medium: '',
        technique: '',
        dimensions: '',
        price: undefined,
        available: true,
        featured: false,
      });
      setFile(null);
      setPreview(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const set = (field: keyof ArtworkFormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* ── Image upload ── */}
      <div
        {...getRootProps()}
        className={`border border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300
          ${isDragActive ? 'border-[#8a1c1c] bg-[#8a1c1c]/5' : 'border-[#2a2a2a] hover:border-[#8a1c1c]/60'}
          ${preview ? 'border-solid border-[#2a2a2a]' : ''}`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}
              className="absolute top-1 right-1 p-1.5 bg-black/60 rounded-full hover:bg-black/80 transition-colors"
            >
              <X size={14} className="text-white" />
            </button>
          </div>
        ) : (
          <div className="py-4">
            <Upload className="mx-auto mb-3 text-[#8a1c1c] opacity-60" size={32} />
            <p className="text-xs text-[#8b7d7b]">
              {isDragActive ? 'Drop here' : 'Drag image or click to select'}
            </p>
            <p className="text-[10px] text-[#555] mt-1">PNG, JPG, WEBP</p>
          </div>
        )}
      </div>

      {/* ── Title ── */}
      <FormField label="Title" required>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder={isTattoo ? 'e.g. Sacred Serpent' : 'e.g. Void Geometry #3'}
          className="admin-input"
        />
      </FormField>

      {/* ── Category (with suggestions) ── */}
      {!defaultCategory && (
        <FormField label="Category" required>
          <input
            type="text"
            required
            value={formData.category}
            onChange={(e) => set('category', e.target.value)}
            placeholder="Type or select below"
            className="admin-input"
          />
          <TagSuggestions
            options={CATEGORY_SUGGESTIONS}
            current={formData.category}
            onSelect={(v) => set('category', v)}
          />
        </FormField>
      )}

      {/* ── Price + Year row ── */}
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Price (USD)">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555] text-sm">$</span>
            <input
              type="number"
              min={0}
              step={0.01}
              value={formData.price || ''}
              onChange={(e) => set('price', parseFloat(e.target.value) || undefined)}
              placeholder="0.00"
              className="admin-input pl-7"
            />
          </div>
        </FormField>
        <FormField label="Year">
          <input
            type="number"
            value={formData.year || ''}
            onChange={(e) => set('year', parseInt(e.target.value) || undefined)}
            className="admin-input"
          />
        </FormField>
      </div>

      {/* ── Medium (with suggestions) ── */}
      <FormField label="Medium / Style">
        <input
          type="text"
          value={formData.medium || ''}
          onChange={(e) => set('medium', e.target.value)}
          placeholder={isTattoo ? 'e.g. Blackwork, Dotwork' : 'e.g. Digital, Acrylic'}
          className="admin-input"
        />
        <TagSuggestions
          options={isTattoo ? TECHNIQUE_SUGGESTIONS : MEDIUM_SUGGESTIONS}
          current={formData.medium || ''}
          onSelect={(v) => set('medium', v)}
        />
      </FormField>

      {/* ── Technique (tattoos) ── */}
      {isTattoo && (
        <FormField label="Technique">
          <input
            type="text"
            value={formData.technique || ''}
            onChange={(e) => set('technique', e.target.value)}
            placeholder="e.g. Handpoke + Machine"
            className="admin-input"
          />
          <TagSuggestions
            options={TECHNIQUE_SUGGESTIONS}
            current={formData.technique || ''}
            onSelect={(v) => set('technique', v)}
          />
        </FormField>
      )}

      {/* ── Dimensions ── */}
      <FormField label="Dimensions">
        <input
          type="text"
          value={formData.dimensions || ''}
          onChange={(e) => set('dimensions', e.target.value)}
          placeholder="e.g. 30 × 40 cm"
          className="admin-input"
        />
        {!isTattoo && (
          <TagSuggestions
            options={DIMENSION_PRESETS}
            current={formData.dimensions || ''}
            onSelect={(v) => set('dimensions', v === 'Custom' ? '' : v)}
          />
        )}
      </FormField>

      {/* ── Description ── */}
      <FormField label="Description" hint="Optional — shown on the detail page">
        <textarea
          rows={3}
          value={formData.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder={isTattoo
            ? 'Story behind the piece, placement notes...'
            : 'Concept, inspiration, technique notes...'}
          className="admin-input resize-none"
        />
      </FormField>

      {/* ── Toggles ── */}
      <div className="flex gap-6 pt-1">
        <Toggle
          checked={formData.available}
          onChange={(v) => set('available', v)}
          label="For Sale"
        />
        <Toggle
          checked={formData.featured}
          onChange={(v) => set('featured', v)}
          label="Featured"
        />
      </div>

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={loading || (!file && !isEdit)}
        className={`w-full py-3 rounded text-sm uppercase tracking-widest transition-all duration-300
          ${success
            ? 'bg-green-900/30 border border-green-700/50 text-green-300'
            : 'bg-[#8a1c1c]/20 border border-[#8a1c1c]/50 text-white hover:bg-[#8a1c1c]/40'}
          disabled:opacity-40 disabled:cursor-not-allowed`}
        style={{ fontFamily: 'var(--font-heading), serif' }}
      >
        {success ? (
          <span className="flex items-center justify-center gap-2">
            <Check size={16} /> Added!
          </span>
        ) : loading ? 'Uploading...' : isEdit ? 'Update' : (
          file ? 'Publish Artwork' : 'Select an image first'
        )}
      </button>
    </form>
  );
}

/* ─── Sub-components ─── */

function FormField({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-widest text-[#8b7d7b] mb-1.5">
        {label}{required && <span className="text-[#8a1c1c] ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-[10px] text-[#555] mt-1">{hint}</p>}
    </div>
  );
}

function TagSuggestions({ options, current, onSelect }: {
  options: string[]; current: string; onSelect: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onSelect(opt)}
          className={`px-2 py-0.5 text-[10px] rounded border transition-all duration-200
            ${current.toLowerCase() === opt.toLowerCase()
              ? 'border-[#8a1c1c] bg-[#8a1c1c]/15 text-white'
              : 'border-[#1a1a1a] text-[#8b7d7b] hover:border-[#8a1c1c]/40 hover:text-white'}`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function Toggle({ checked, onChange, label }: {
  checked: boolean; onChange: (v: boolean) => void; label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2 group"
    >
      <div className={`w-8 h-4 rounded-full transition-colors duration-200 relative
        ${checked ? 'bg-[#8a1c1c]' : 'bg-[#1a1a1a]'}`}>
        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform duration-200
          ${checked ? 'translate-x-4.5 left-0.5' : 'translate-x-0.5'}`} />
      </div>
      <span className="text-xs text-[#8b7d7b] group-hover:text-white transition-colors">{label}</span>
    </button>
  );
}
