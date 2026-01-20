import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
          borderRadius: '8px',
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stylized "L" */}
          <path
            d="M25 15 L25 75 L70 75 L70 65 L35 65 L35 15 Z"
            fill="white"
          />
          
          {/* Decorative element - roof/wave */}
          <path
            d="M35 15 C45 10, 55 10, 65 15 L65 25 C55 20, 45 20, 35 25 Z"
            fill="white"
            opacity="0.8"
          />
          
          {/* Small accent circle */}
          <circle cx="72" cy="20" r="6" fill="white" />
          
          {/* Underline accent */}
          <rect x="25" y="78" width="45" height="3" rx="1.5" fill="white" opacity="0.6" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
