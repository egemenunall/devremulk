import { notFound } from 'next/navigation';
import { getListingById } from '@/lib/api';
import ImageGallery from '@/components/ImageGallery';
import Link from 'next/link';

interface ListingPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    notFound();
  }

  const formattedDate = new Date(listing.listing_date).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Geri Dön
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Image Gallery */}
          <ImageGallery images={listing.images} altText={listing.name} />

          {/* Listing Details */}
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {listing.name}
                </h1>
                <p className="text-sm text-gray-500">İlan Tarihi: {formattedDate}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-600">
                  ₺{listing.price.toLocaleString('tr-TR')}
                </p>
                <p className="text-lg text-gray-600">{listing.period}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Açıklama</h2>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {listing.description}
              </p>
            </div>

            {/* İletişim Butonu (İsteğe bağlı) */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                İletişime Geç
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
