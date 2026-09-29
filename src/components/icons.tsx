type IconProps = { className?: string };

const commonProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ClockIcon({ className }: IconProps) {
  return (
    <svg {...commonProps} className={className}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </svg>
  );
}

export function ReceiptIcon({ className }: IconProps) {
  return (
    <svg {...commonProps} className={className}>
      <path d="M6 3h12v17l-2-1.2-2 1.2-2-1.2-2 1.2-2-1.2-2 1.2V3z" />
      <path d="M9 8h6M9 12h6" />
    </svg>
  );
}

export function BoxIcon({ className }: IconProps) {
  return (
    <svg {...commonProps} className={className}>
      <path d="M3 7l9-4 9 4-9 4-9-4z" />
      <path d="M3 7v10l9 4 9-4V7" />
      <path d="M12 11v10" />
    </svg>
  );
}

export function NotesIcon({ className }: IconProps) {
  return (
    <svg {...commonProps} className={className}>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4" />
      <path d="M9 12h6M9 16h6" />
    </svg>
  );
}

export function BoltIcon({ className }: IconProps) {
  return (
    <svg {...commonProps} className={className}>
      <path d="M13 3L5 13h6l-1 8 8-10h-6l1-8z" />
    </svg>
  );
}

export function BulbIcon({ className }: IconProps) {
  return (
    <svg {...commonProps} className={className}>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z" />
    </svg>
  );
}

export function BreakerIcon({ className }: IconProps) {
  return (
    <svg {...commonProps} className={className}>
      <rect x="5" y="3" width="14" height="18" rx="1.5" />
      <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" />
    </svg>
  );
}

export function InfoIcon({ className }: IconProps) {
  return (
    <svg {...commonProps} className={className}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

export function BriefcaseIcon({ className }: IconProps) {
  return (
    <svg {...commonProps} className={className}>
      <rect x="3" y="7" width="18" height="13" rx="1.5" />
      <path d="M9 7V5h6v2M3 13h18" />
    </svg>
  );
}
