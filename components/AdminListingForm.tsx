'use client';

import { useState, useEffect } from 'react';
import { ListingWithImages } from '@/lib/types';
import ImageUploader from '@/components/ImageUploader';

interface AdminListingFormProps {
  listing: ListingWithImages | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminListingForm({
  listing,
  onClose,
  onSuccess,
}: AdminListingFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [period, setPeriod] = useState('');
  const [listingDate, setListingDate] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (listing) {
      setName(listing.name);
      setDescription(listing.description);
      setPrice(listing.price.toString());
      setPeriod(listing.period);
      setListingDate(listing.listing_date);
    } else {
      // Yeni ilan için bugünün tarihini varsayılan olarak ayarla
      setListingDate(new Date().toISOString().split('T')[0]);
    }
  }, [listing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const listingData = {
        name,
        description,
        price: parseFloat(price),
        period,
        listing_date: listingDate,
      };

      let listingId: string;

      if (listing) {
        // Güncelleme - API kullan
        const response = await fetch(`/api/admin/listings/${listing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(listingData),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'İlan güncellenemedi');
        }
        listingId = listing.id;
      } else {
        // Yeni ilan - API kullan
        const response = await fetch('/api/admin/listings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(listingData),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'İlan oluşturulamadı');
        }

        const data = await response.json();
        listingId = data.listing.id;

        // Görselleri yükle (sadece yeni ilan için)
        if (images.length > 0) {
          for (let i = 0; i < images.length; i++) {
            const formData = new FormData();
            formData.append('file', images[i]);
            formData.append('listing_id', listingId);
            formData.append('order', i.toString());

            const uploadResponse = await fetch('/api/admin/upload', {
              method: 'POST',
              body: formData,
            });

            if (!uploadResponse.ok) {
              console.error('Görsel yüklenemedi:', await uploadResponse.json());
            }
          }
        }
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {listing ? 'İlanı Düzenle' : 'Yeni İlan Ekle'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
          type="button"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* İlan Adı */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İlan Adı *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Örn: Lüks Villa Devre Mülk"
            />
          </div>

          {/* Fiyat */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fiyat (₺) *
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Örn: 50000"
            />
          </div>

          {/* Dönem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dönem *
            </label>
            <input
              type="text"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Örn: Haftalık, Aylık, Yıllık"
            />
          </div>

          {/* İlan Tarihi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İlan Tarihi *
            </label>
            <input
              type="date"
              value={listingDate}
              onChange={(e) => setListingDate(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Açıklama */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Açıklama *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="İlan hakkında detaylı bilgi girin..."
          />
        </div>

        {/* Görseller (sadece yeni ilan için) */}
        {!listing && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Görseller
            </label>
            <ImageUploader images={images} onChange={setImages} />
          </div>
        )}

        {/* Hata Mesajı */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Butonlar */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Kaydediliyor...' : listing ? 'Güncelle' : 'Kaydet'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  );
}
