'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ListingWithImages } from '@/lib/types';

interface AdminListingListProps {
  listings: ListingWithImages[];
  onEdit: (listing: ListingWithImages) => void;
  onDelete: () => void;
}

export default function AdminListingList({
  listings,
  onEdit,
  onDelete,
}: AdminListingListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copyingId, setCopyingId] = useState<string | null>(null);

  const handleDelete = async (listing: ListingWithImages) => {
    if (!confirm(`"${listing.name}" ilanını silmek istediğinizden emin misiniz?`)) {
      return;
    }

    setDeletingId(listing.id);

    try {
      const response = await fetch(`/api/admin/listings/${listing.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'İlan silinemedi');
      }

      onDelete();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'İlan silinirken bir hata oluştu.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopy = async (listing: ListingWithImages) => {
    if (!confirm(`"${listing.name}" ilanının kopyası oluşturulsun mu?`)) {
      return;
    }

    setCopyingId(listing.id);

    try {
      // Yeni ilan oluştur (kopya)
      const newListing = {
        name: `${listing.name} (Kopya)`,
        description: listing.description,
        price: listing.price,
        period: listing.period,
        listing_date: new Date().toISOString().split('T')[0],
      };

      const response = await fetch('/api/admin/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newListing),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'İlan kopyalanamadı');
      }

      const { listing: createdListing } = await response.json();

      // Resimleri kopyala
      for (const image of listing.images) {
        try {
          // Resim URL'sini al ve yeni ilana bağla
          const imageResponse = await fetch('/api/admin/listings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              listingId: createdListing.id,
              imageUrl: image.image_url,
              action: 'copy-image',
            }),
          });

          if (!imageResponse.ok) {
            console.error('Resim kopyalanamadı:', image.image_url);
          }
        } catch (imageError) {
          console.error('Resim kopyalama hatası:', imageError);
        }
      }

      alert('İlan başarıyla kopyalandı!');
      onDelete(); // Liste yenilensin
    } catch (error) {
      alert(error instanceof Error ? error.message : 'İlan kopyalanırken bir hata oluştu.');
    } finally {
      setCopyingId(null);
    }
  };

  if (listings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <p className="text-gray-600">Henüz ilan eklenmemiş.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Görsel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İlan Adı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fiyat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dönem
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İlan Tarihi
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {listings.map((listing) => (
              <tr key={listing.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="relative w-16 h-16 bg-gray-200 rounded">
                    {listing.images[0] ? (
                      <Image
                        src={listing.images[0].image_url}
                        alt={listing.name}
                        fill
                        className="object-cover rounded"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{listing.name}</div>
                  <div className="text-sm text-gray-500 line-clamp-1">
                    {listing.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ₺{listing.price.toLocaleString('tr-TR')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{listing.period}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(listing.listing_date).toLocaleDateString('tr-TR')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button
                    onClick={() => handleCopy(listing)}
                    disabled={copyingId === listing.id}
                    className="text-green-600 hover:text-green-900 disabled:text-gray-400"
                    title="İlanı Kopyala"
                  >
                    {copyingId === listing.id ? (
                      'Kopyalanıyor...'
                    ) : (
                      <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => onEdit(listing)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(listing)}
                    disabled={deletingId === listing.id}
                    className="text-red-600 hover:text-red-900 disabled:text-gray-400"
                  >
                    {deletingId === listing.id ? 'Siliniyor...' : 'Sil'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
