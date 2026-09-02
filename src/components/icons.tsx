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
