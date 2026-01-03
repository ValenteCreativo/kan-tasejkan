'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import type { ArtworkFormData } from '../../types';

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
    if (!file && !isEdit) {
      alert('Please select an image');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData, file);
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
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
          ${isDragActive ? 'border-[#DC143C] bg-[#DC143C]/10' : 'border-[#8B0000] hover:border-[#DC143C]'}
          ${preview ? 'border-solid' : ''}`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                setPreview(null);
              }}
              className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <div>
            <Upload className="mx-auto mb-4 text-[#DC143C]" size={48} />
            <p className="text-gray-300">
              {isDragActive ? 'Drop the image here' : 'Drag & drop an image, or click to select'}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 bg-black/50 border border-[#8B0000] rounded-lg text-white
                     focus:outline-none focus:border-[#DC143C] transition-colors"
          />
        </div>

        {defaultCategory ? (
          <input type="hidden" value={defaultCategory} />
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 bg-black/50 border border-[#8B0000] rounded-lg text-white
                       focus:outline-none focus:border-[#DC143C] transition-colors"
            />
          </div>
        )}

        {defaultCategory === 'tattoo' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Technique</label>
            <input
              type="text"
              value={formData.technique || ''}
              onChange={(e) => setFormData({ ...formData, technique: e.target.value })}
              className="w-full px-4 py-2 bg-black/50 border border-[#8B0000] rounded-lg text-white
                       focus:outline-none focus:border-[#DC143C] transition-colors"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
          <input
            type="number"
            value={formData.year || ''}
            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || undefined })}
            className="w-full px-4 py-2 bg-black/50 border border-[#8B0000] rounded-lg text-white
                     focus:outline-none focus:border-[#DC143C] transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Medium</label>
          <input
            type="text"
            value={formData.medium || ''}
            onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
            className="w-full px-4 py-2 bg-black/50 border border-[#8B0000] rounded-lg text-white
                     focus:outline-none focus:border-[#DC143C] transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Dimensions</label>
          <input
            type="text"
            value={formData.dimensions || ''}
            onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
            placeholder="e.g., 24 x 36 inches"
            className="w-full px-4 py-2 bg-black/50 border border-[#8B0000] rounded-lg text-white
                     focus:outline-none focus:border-[#DC143C] transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Price (USD)</label>
          <input
            type="number"
            value={formData.price || ''}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || undefined })}
            className="w-full px-4 py-2 bg-black/50 border border-[#8B0000] rounded-lg text-white
                     focus:outline-none focus:border-[#DC143C] transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
        <textarea
          required
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 bg-black/50 border border-[#8B0000] rounded-lg text-white
                   focus:outline-none focus:border-[#DC143C] transition-colors"
        />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.available}
            onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
            className="w-5 h-5 rounded border-[#8B0000] bg-black/50 text-[#DC143C]
                     focus:ring-[#DC143C] focus:ring-offset-black"
          />
          <span className="text-gray-300">Available for Sale</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-5 h-5 rounded border-[#8B0000] bg-black/50 text-[#DC143C]
                     focus:ring-[#DC143C] focus:ring-offset-black"
          />
          <span className="text-gray-300">Featured Artwork</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-[#8B0000] hover:bg-[#DC143C] text-white rounded-lg
                 transition-all duration-300 sacred-border hover-glow disabled:opacity-50
                 disabled:cursor-not-allowed font-medium"
      >
        {loading ? 'Uploading...' : isEdit ? 'Update Artwork' : 'Add Artwork'}
      </button>
    </form>
  );
}
