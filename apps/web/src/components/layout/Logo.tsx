interface LogoProps {
  variant?: "full" | "mono";
  className?: string;
}

export function Logo({ variant = "full", className = "" }: LogoProps) {
  const vanBody = variant === "full" ? "#FACC15" : "white";
  const vanDark = variant === "full" ? "#1E293B" : "rgba(255,255,255,0.9)";
  const wheelRim = variant === "full" ? "#94A3B8" : "rgba(255,255,255,0.6)";
  const textColor = variant === "full" ? "#0F172A" : "white";
  const windowFill = variant === "full" ? "white" : "rgba(255,255,255,0.85)";

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width="40"
        height="28"
        viewBox="0 0 40 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Van body */}
        <rect x="0" y="6" width="32" height="16" rx="2" fill={vanBody} />
        {/* Cab */}
        <rect x="26" y="6" width="14" height="12" rx="2" fill={vanBody} />
        {/* Cab roof slope */}
        <path d="M26 6 L34 2 L40 6" fill={vanBody} />
        {/* Window */}
        <rect x="28" y="7" width="10" height="9" rx="1.5" fill={windowFill} />
        {/* Headlight */}
        <rect x="38" y="10" width="2" height="3" rx="0.5" fill={windowFill} />
        {/* Cargo door line */}
        <line x1="20" y1="6" x2="20" y2="22" stroke={vanDark} strokeWidth="1" opacity="0.3" />
        {/* Wheels */}
        <circle cx="9" cy="24" r="4" fill={vanDark} />
        <circle cx="9" cy="24" r="2" fill={wheelRim} />
        <circle cx="32" cy="24" r="4" fill={vanDark} />
        <circle cx="32" cy="24" r="2" fill={wheelRim} />
        {/* Ground shadow strip */}
        <rect x="2" y="21" width="37" height="2" rx="1" fill={vanDark} opacity="0.1" />
      </svg>
      <span
        style={{ color: textColor }}
        className="font-bold text-xl leading-none tracking-tight"
      >
        Speedy<span style={{ color: variant === "full" ? "#CA8A04" : "rgba(255,255,255,0.75)" }}>Van</span>
      </span>
    </span>
  );
}
