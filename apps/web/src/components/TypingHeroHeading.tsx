interface TypingHeroHeadingProps {
  prefix: string;
  highlight: string;
  /** Milliseconds per character */
  speed?: number;
  /** Delay before typing starts (ms) */
  startDelay?: number;
  /** Optional className for the wrapping <h1> */
  className?: string;
  id?: string;
}

export default function TypingHeroHeading({
  prefix,
  highlight,
  className = "",
  id,
}: TypingHeroHeadingProps) {
  const fullText = `${prefix}${highlight}`;

  return (
    <h1 id={id} className={className} aria-label={fullText}>
      <span>{prefix}</span>
      <span
        className="hero-gradient-text hero-gradient-text--shimmer"
      >
        {highlight}
      </span>
    </h1>
  );
}
