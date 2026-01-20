'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Banner {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
}

const banners: Banner[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1800&q=80',
    title: 'Yaz Sezonuna Özel Fırsatlar',
    subtitle: 'Denize sıfır lüks villalarda %30\'a varan indirimler',
    cta: 'Fırsatları Keşfet',
    link: '/ilanlar',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800&q=80',
    title: 'Muhteşem Deniz Manzaralı Villalar',
    subtitle: 'Hayalinizdeki tatil evi sadece bir tık uzağınızda',
    cta: 'Hemen İncele',
    link: '/ilanlar',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1800&q=80',
    title: 'Kış Turuna Hazır Olun',
    subtitle: 'Kayak merkezlerine yakın özel fırsatlar',
    cta: 'Detaylı Bilgi',
    link: '/ilanlar',
  },
];

export default function BannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden group">
      {/* Slides */}
      <div className="relative w-full h-full">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl">
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fadeIn">
                    {banner.title}
                  </h2>
                  <p className="text-lg md:text-xl text-gray-200 mb-8 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                    {banner.subtitle}
                  </p>
                  <Link
                    href={banner.link}
                    className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg animate-fadeIn"
                    style={{ animationDelay: '0.4s' }}
                  >
                    {banner.cta}
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-sm text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/30"
        aria-label="Previous"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-sm text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/30"
        aria-label="Next"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
