import Link from 'next/link';
import Image from 'next/image';
import { ListingWithImages } from '@/lib/types';

interface ListingCardProps {
  listing: ListingWithImages;
}

export function ListingCard({ listing }: ListingCardProps) {
  const mainImage = listing.images[0]?.image_url || '/placeholder.jpg';
  const formattedDate = new Date(listing.listing_date).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/listings/${listing.id}`} className="block">
      <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300">
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          <Image
            src={mainImage}
            alt={listing.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Period Badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white shadow-sm">
              {listing.period}
            </span>
          </div>

          {/* Image Count */}
          {listing.images.length > 1 && (
            <div className="absolute bottom-3 right-3">
              <div className="flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md shadow-sm">
                <svg className="w-3.5 h-3.5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs font-medium text-gray-700">{listing.images.length}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {listing.name}
          </h3>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {listing.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                ₺{listing.price.toLocaleString('tr-TR')}
              </span>
            </div>
            
            <div className="text-xs text-gray-500">
              {formattedDate}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
