export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gradient Definitions */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>

      {/* Stylized "L" with luxury feel */}
      <path
        d="M25 15 L25 75 L70 75 L70 65 L35 65 L35 15 Z"
        fill="url(#logoGradient)"
        className="transition-all duration-300"
      />
      
      {/* Decorative element - roof/wave */}
      <path
        d="M35 15 C45 10, 55 10, 65 15 L65 25 C55 20, 45 20, 35 25 Z"
        fill="url(#accentGradient)"
        opacity="0.8"
      />
      
      {/* Small accent circle */}
      <circle cx="72" cy="20" r="6" fill="url(#accentGradient)" />
      
      {/* Underline accent */}
      <rect x="25" y="78" width="45" height="3" rx="1.5" fill="url(#accentGradient)" opacity="0.6" />
    </svg>
  );
}
