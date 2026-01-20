'use client';

import { useState, useEffect } from 'react';
import { ListingWithImages } from '@/lib/types';
import ImageUploader from '@/components/ImageUploader';
import MediaLibraryModal from '@/components/MediaLibraryModal';

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
  const [isFeatured, setIsFeatured] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [selectedMediaUrls, setSelectedMediaUrls] = useState<string[]>([]);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (listing) {
      setName(listing.name);
      setDescription(listing.description);
      setPrice(listing.price.toString());
      setPeriod(listing.period);
      setListingDate(listing.listing_date);
      setIsFeatured(listing.is_featured || false);
      setExistingImages(listing.images || []);
      setDeletedImageIds([]);
    } else {
      // Yeni ilan için bugünün tarihini varsayılan olarak ayarla
      setListingDate(new Date().toISOString().split('T')[0]);
      setIsFeatured(false);
      setExistingImages([]);
      setDeletedImageIds([]);
    }
  }, [listing]);

  const handleDeleteExistingImage = async (imageId: string) => {
    if (!confirm('Bu görseli silmek istediğinizden emin misiniz?')) return;
    
    try {
      const response = await fetch(`/api/admin/listings/images/${imageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Görsel silinemedi');
      }

      setExistingImages(prev => prev.filter(img => img.id !== imageId));
      setDeletedImageIds(prev => [...prev, imageId]);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Görsel silinirken hata oluştu');
    }
  };

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
        is_featured: isFeatured,
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

        // Yeni görselleri yükle (güncelleme için)
        if (images.length > 0) {
          const currentMaxOrder = existingImages.length > 0 
            ? Math.max(...existingImages.map(img => img.order || 0))
            : -1;

          for (let i = 0; i < images.length; i++) {
            const formData = new FormData();
            formData.append('file', images[i]);
            formData.append('listing_id', listingId);
            formData.append('order', (currentMaxOrder + i + 1).toString());

            const uploadResponse = await fetch('/api/admin/upload', {
              method: 'POST',
              body: formData,
            });

            if (!uploadResponse.ok) {
              console.error('Görsel yüklenemedi:', await uploadResponse.json());
            }
          }
        }
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

        // Medya kütüphanesinden seçilen görselleri ekle
        if (selectedMediaUrls.length > 0) {
          for (let i = 0; i < selectedMediaUrls.length; i++) {
            const response = await fetch('/api/admin/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                listing_id: listingId,
                image_url: selectedMediaUrls[i],
                order: i,
                from_library: true,
              }),
            });

            if (!response.ok) {
              console.error('Medya kütüphanesinden görsel eklenemedi');
            }
          }
        }

        // Yeni yüklenen görselleri ekle (sadece yeni ilan için)
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

        {/* Öne Çıkan İlan */}
        <div className="mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_featured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="is_featured" className="ml-3 flex items-center cursor-pointer">
              <span className="text-sm font-medium text-gray-700">Öne Çıkan İlan</span>
              <svg className="w-5 h-5 ml-1.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </label>
          </div>
          <p className="mt-1 text-sm text-gray-500 ml-8">
            Öne çıkan ilanlar ana sayfada özel olarak gösterilir
          </p>
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

        {/* Mevcut Görseller (düzenleme modunda) */}
        {listing && existingImages.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mevcut Görseller
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {existingImages.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.image_url}
                    alt="İlan görseli"
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteExistingImage(image.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    title="Görseli sil"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    #{image.order + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Görseller */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {listing ? 'Yeni Görseller Ekle' : 'Görseller'}
          </label>
          
          {/* Medya Kütüphanesinden Seçilen Görseller */}
          {selectedMediaUrls.length > 0 && (
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Medya kütüphanesinden {selectedMediaUrls.length} görsel seçildi
              </div>
              <div className="grid grid-cols-4 gap-2">
                {selectedMediaUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img src={url} alt="" className="w-full h-20 object-cover rounded border" />
                    <button
                      type="button"
                      onClick={() => setSelectedMediaUrls(prev => prev.filter((_, i) => i !== index))}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Butonlar */}
          <div className="flex gap-3 mb-4">
            <button
              type="button"
              onClick={() => setShowMediaLibrary(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Medya Kütüphanesinden Seç
            </button>
            <div className="flex-1">
              <ImageUploader images={images} onChange={setImages} />
            </div>
          </div>
          
          {listing && (
            <p className="text-sm text-gray-500">
              Yeni görseller mevcut görsellerin sonuna eklenecektir.
            </p>
          )}
        </div>

        {/* Media Library Modal */}
        <MediaLibraryModal
          isOpen={showMediaLibrary}
          onClose={() => setShowMediaLibrary(false)}
          onSelect={(urls) => setSelectedMediaUrls(prev => [...prev, ...urls])}
          multiple={true}
        />

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
