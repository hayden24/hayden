type IconProps = { className?: string };

const commonProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function HomeIcon({ className }: IconProps) {
  return (
    <svg {...commonProps} className={className}>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v10h5v-6h4v6h5V10" />
    </svg>
  );
}

export function HammerIcon({ className }: IconProps) {
  return (
    <svg {...commonProps} className={className}>
      <path d="M14 6l4 4" />
      <path d="M11 3l3 3-2 2-3-3z" />
      <path d="M14 6l4-1 2 2-1 4-4-1" />
      <path d="M12 8l-8 8a1.5 1.5 0 002 2l8-8" />
    </svg>
  );
}

export function LightbulbIcon({ className }: IconProps) {
  return (
    <svg {...commonProps} className={className}>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z" />
    </svg>
  );
}

export function HelpIcon({ className }: IconProps) {
  return (
    <svg {...commonProps} className={className}>
      <path d="M4 5h16v11H9l-5 4z" />
      <path d="M10 9a2 2 0 113 1.7c-.6.4-1 .8-1 1.3" />
      <path d="M12 14.5h.01" />
    </svg>
  );
}
