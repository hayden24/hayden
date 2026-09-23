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

export function ShareIcon({ className }: IconProps) {
  return (
    <svg {...commonProps} className={className}>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4" />
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
