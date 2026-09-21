import Image from "next/image";

interface LogoProps {
  variant?: "full" | "mono";
  className?: string;
}

const BRAND_LOGO_SRC = "/logo.png?v=amber-20260921-1";

export function Logo({ variant = "full", className = "" }: LogoProps) {
  const textColor = variant === "full" ? "#FFFFFF" : "white";
  const accent = variant === "full" ? "#F59E0B" : "rgba(255,255,255,0.75)";

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="logo-neon-ring relative inline-flex items-center justify-center h-14 w-14 shrink-0">
        <span aria-hidden="true" className="logo-neon-ring__arc" />
        <Image
          src={BRAND_LOGO_SRC}
          alt="SpeedyVan logo"
          width={56}
          height={56}
          priority
          unoptimized
          className="relative z-10 h-[52px] w-[52px] rounded-full object-cover"
        />
      </span>
      <span
        style={{ color: textColor }}
        className="font-bold text-xl leading-none tracking-tight"
      >
        Speedy<span style={{ color: accent }}>Van</span>
      </span>
    </span>
  );
}
