import React from 'react';

interface NanoTechLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  variant?: 'emblem' | 'horizontal' | 'vertical' | 'badge' | 'compact';
  showSubtitle?: boolean;
  className?: string;
  glow?: boolean;
  onClick?: () => void;
}

export function NanoTechLogo({
  size = 'md',
  variant = 'horizontal',
  showSubtitle = true,
  className = '',
  glow = true,
  onClick,
}: NanoTechLogoProps) {
  // Compute pixel height for the official store logo banner (311x66 aspect ratio)
  let logoPixelHeight = 42;
  let iconHeight = 44;
  let iconWidth = 52;

  if (typeof size === 'number') {
    logoPixelHeight = size;
    iconHeight = size;
    iconWidth = size * 1.18;
  } else {
    switch (size) {
      case 'xs':
        logoPixelHeight = 24;
        iconHeight = 22;
        iconWidth = 26;
        break;
      case 'sm':
        logoPixelHeight = 32;
        iconHeight = 30;
        iconWidth = 36;
        break;
      case 'md':
        logoPixelHeight = 42;
        iconHeight = 42;
        iconWidth = 50;
        break;
      case 'lg':
        logoPixelHeight = 54;
        iconHeight = 56;
        iconWidth = 66;
        break;
      case 'xl':
        logoPixelHeight = 72;
        iconHeight = 78;
        iconWidth = 92;
        break;
      case '2xl':
        logoPixelHeight = 96;
        iconHeight = 110;
        iconWidth = 130;
        break;
    }
  }

  // Pure Vector SVG Emblem with the 360° Yellow Corner Radiant Glow (for icon-only / badge needs)
  const EmblemOnlySvg = (
    <div className="relative inline-flex items-center justify-center shrink-0">
      {/* 360-degree Yellow Radiant Ambient Corner Back-Glow */}
      {glow && (
        <div
          className="absolute inset-0 rounded-full blur-md opacity-80 pointer-events-none scale-110"
          style={{
            background:
              'radial-gradient(circle, rgba(253, 224, 71, 0.95) 0%, rgba(245, 158, 11, 0.75) 45%, rgba(234, 179, 8, 0.35) 75%, transparent 100%)',
          }}
        />
      )}

      <svg
        width={iconWidth}
        height={iconHeight}
        viewBox="0 0 260 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`relative z-10 shrink-0 select-none ${
          glow
            ? 'filter drop-shadow-[0_0_10px_rgba(250,204,21,0.9)] drop-shadow-[0_0_20px_rgba(245,158,11,0.65)]'
            : ''
        }`}
        referrerPolicy="no-referrer"
      >
        <defs>
          <clipPath id="globeRoundClip">
            <circle cx="130" cy="110" r="75" />
          </clipPath>

          <linearGradient id="wingOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF7A00" />
            <stop offset="100%" stopColor="#FF5500" />
          </linearGradient>

          <linearGradient id="globeGreenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00B04F" />
            <stop offset="100%" stopColor="#009240" />
          </linearGradient>

          <radialGradient id="yellowCornerAuraRing" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#FACC15" stopOpacity="0.75" />
            <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
          </radialGradient>
        </defs>

        {glow && (
          <ellipse cx="130" cy="110" rx="125" ry="105" fill="url(#yellowCornerAuraRing)" opacity="0.8" />
        )}

        {/* LEFT ORANGE WING */}
        <polygon points="12,60 85,60 85,84 20,84" fill="url(#wingOrangeGrad)" />
        <polygon points="28,95 85,95 85,119 36,119" fill="url(#wingOrangeGrad)" />
        <polygon points="44,130 100,130 88,154 52,154" fill="url(#wingOrangeGrad)" />
        <path
          d="M 80 60 L 100 60 C 90 85 86 120 95 154 L 75 154 C 65 120 68 85 80 60 Z"
          fill="url(#wingOrangeGrad)"
        />

        {/* RIGHT ORANGE WING */}
        <polygon points="248,60 175,60 175,84 240,84" fill="url(#wingOrangeGrad)" />
        <polygon points="232,95 175,95 175,119 224,119" fill="url(#wingOrangeGrad)" />
        <polygon points="216,130 160,130 172,154 208,154" fill="url(#wingOrangeGrad)" />
        <path
          d="M 180 60 L 160 60 C 170 85 174 120 165 154 L 185 154 C 195 120 192 85 180 60 Z"
          fill="url(#wingOrangeGrad)"
        />

        {/* CENTRAL EMERALD GREEN GLOBE WITH WHITE GRID MESH */}
        <circle cx="130" cy="110" r="77" fill="#FFFFFF" />
        <circle cx="130" cy="110" r="75" fill="url(#globeGreenGrad)" />

        <g clipPath="url(#globeRoundClip)">
          <line x1="130" y1="25" x2="130" y2="195" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
          <line x1="45" y1="110" x2="215" y2="110" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
          <ellipse cx="130" cy="110" rx="50" ry="75" fill="none" stroke="#FFFFFF" strokeWidth="6" />
          <ellipse cx="130" cy="110" rx="25" ry="75" fill="none" stroke="#FFFFFF" strokeWidth="6" />
          <ellipse cx="130" cy="74" rx="65" ry="20" fill="none" stroke="#FFFFFF" strokeWidth="5.5" />
          <ellipse cx="130" cy="146" rx="65" ry="20" fill="none" stroke="#FFFFFF" strokeWidth="5.5" />
        </g>

        <circle cx="130" cy="110" r="75" fill="none" stroke="#FFFFFF" strokeWidth="6" />
      </svg>
    </div>
  );

  // Return standalone emblem or badge variant
  if (variant === 'emblem' || variant === 'badge') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center ${onClick ? 'cursor-pointer' : ''} ${className}`}
        title="NanoTech - Future of Hardware"
      >
        {EmblemOnlySvg}
      </div>
    );
  }

  // Vertical layout (e.g. for Login pages or splash screens)
  if (variant === 'vertical') {
    return (
      <div
        onClick={onClick}
        className={`flex flex-col items-center text-center ${onClick ? 'cursor-pointer group' : ''} ${className}`}
      >
        <img
          src="/nanotech-logo.png"
          alt="NanoTech - Future of Hardware"
          className={`object-contain transition-transform duration-300 group-hover:scale-105 select-none ${
            glow ? 'drop-shadow-[0_4px_16px_rgba(250,204,21,0.4)]' : ''
          }`}
          style={{
            height: `${logoPixelHeight * 1.25}px`,
            width: 'auto',
            maxWidth: '100%',
          }}
          loading="eager"
        />
        {showSubtitle && (
          <p className="text-[10px] sm:text-xs font-black tracking-[0.22em] text-slate-500 uppercase mt-1">
            ITAHARI • NEPAL
          </p>
        )}
      </div>
    );
  }

  // Compact variant for small navbars / pills
  if (variant === 'compact') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center ${onClick ? 'cursor-pointer group' : ''} ${className}`}
      >
        <img
          src="/nanotech-logo.png"
          alt="NanoTech - Future of Hardware"
          className="object-contain transition-transform duration-200 group-hover:scale-105 select-none"
          style={{
            height: `${Math.max(26, logoPixelHeight * 0.8)}px`,
            width: 'auto',
            maxWidth: '100%',
          }}
          loading="eager"
        />
      </div>
    );
  }

  // Default 'horizontal' layout (Primary Header & Footer branding)
  // Renders the official store logo with yellow radiant halo, Orange "Nano" + Green "Tech" + "FUTURE OF HARDWARE"
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center shrink-0 ${onClick ? 'cursor-pointer group focus:outline-none' : ''} ${className}`}
    >
      <img
        src="/nanotech-logo.png"
        alt="NanoTech - Future of Hardware"
        className={`object-contain transition-transform duration-300 group-hover:scale-[1.03] select-none ${
          glow ? 'drop-shadow-[0_2px_12px_rgba(250,204,21,0.35)]' : ''
        }`}
        style={{
          height: `${logoPixelHeight}px`,
          width: 'auto',
          maxWidth: '100%',
        }}
        loading="eager"
      />
    </div>
  );
}

export default NanoTechLogo;
