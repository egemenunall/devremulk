'use client';

import { useState, useEffect } from 'react';

interface CurrencyRate {
  code: string;
  name: string;
  buying: number;
  selling: number;
  change: number;
  icon: string;
}

interface ExchangeRateData {
  rates: {
    TRY: number;
    USD: number;
    EUR: number;
    GBP: number;
  };
}

export default function CurrencyTicker() {
  const [rates, setRates] = useState<CurrencyRate[]>([
    { code: 'USD', name: 'Dolar', buying: 34.15, selling: 34.28, change: 0.45, icon: '$' },
    { code: 'EUR', name: 'Euro', buying: 37.42, selling: 37.58, change: -0.12, icon: '€' },
    { code: 'GBP', name: 'Sterlin', buying: 43.21, selling: 43.39, change: 0.28, icon: '£' },
  ]);
  const [loading, setLoading] = useState(true);
  const [prevRates, setPrevRates] = useState<{ [key: string]: number }>({});

  // Gerçek döviz kurlarını çek
  const fetchRates = async () => {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/TRY');
      const data: ExchangeRateData = await response.json();

      // TRY bazlı API, USD/EUR/GBP'nin TRY karşılığını hesapla
      const usdRate = 1 / data.rates.USD;
      const eurRate = 1 / data.rates.EUR;
      const gbpRate = 1 / data.rates.GBP;

      // Değişim oranlarını hesapla
      const calculateChange = (code: string, newRate: number) => {
        if (prevRates[code]) {
          return ((newRate - prevRates[code]) / prevRates[code]) * 100;
        }
        return 0;
      };

      const newRates: CurrencyRate[] = [
        {
          code: 'USD',
          name: 'Dolar',
          buying: usdRate,
          selling: usdRate * 1.005, // %0.5 spread
          change: calculateChange('USD', usdRate),
          icon: '$',
        },
        {
          code: 'EUR',
          name: 'Euro',
          buying: eurRate,
          selling: eurRate * 1.005,
          change: calculateChange('EUR', eurRate),
          icon: '€',
        },
        {
          code: 'GBP',
          name: 'Sterlin',
          buying: gbpRate,
          selling: gbpRate * 1.005,
          change: calculateChange('GBP', gbpRate),
          icon: '£',
        },
      ];

      setPrevRates({
        USD: usdRate,
        EUR: eurRate,
        GBP: gbpRate,
      });

      setRates(newRates);
      setLoading(false);
    } catch (error) {
      console.error('Döviz kurları yüklenemedi:', error);
      setLoading(false);
    }
  };

  // İlk yükleme
  useEffect(() => {
    fetchRates();
  }, []);

  // Her 5 dakikada bir güncelle
  useEffect(() => {
    const interval = setInterval(() => {
      fetchRates();
    }, 5 * 60 * 1000); // 5 dakika

    return () => clearInterval(interval);
  }, [prevRates]);

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4 overflow-x-auto">
          {/* Title */}
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden sm:inline">Döviz Kurları</span>
          </div>

          {/* Currency Rates */}
          <div className="flex items-center gap-6 overflow-x-auto">
            {rates.map((rate) => (
              <div key={rate.code} className="flex items-center gap-3 bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200 min-w-fit">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-700">{rate.icon}</span>
                  <div>
                    <div className="text-xs font-semibold text-gray-600">{rate.code}</div>
                    <div className="text-xs text-gray-500 hidden sm:block">{rate.name}</div>
                  </div>
                </div>
                <div className="border-l border-gray-200 pl-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-bold text-gray-900">
                      ₺{rate.buying.toFixed(2)}
                    </span>
                    <div className={`flex items-center text-xs font-medium ${rate.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {rate.change >= 0 ? (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span>{Math.abs(rate.change).toFixed(2)}%</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 hidden lg:block">
                    Satış: ₺{rate.selling.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Live Indicator */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 flex-shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="hidden md:inline">Canlı</span>
          </div>
        </div>
      </div>
    </div>
  );
}
