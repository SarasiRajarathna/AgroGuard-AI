/** Consistent 24×24 stroke SVGs for auth screens. Color via `currentColor`. */
function I({ size = 16, className = '', children }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export function LeafIcon(p) {
  return (
    <I {...p}>
      <path d="M5 19c4-9 8-13 14-16-2 7-6 12-14 16Z" />
      <path d="M5 19c3-3 8-7 14-9" />
    </I>
  );
}

export function SproutIcon(p) {
  return (
    <I {...p}>
      <path d="M12 22V10" />
      <path d="M12 14c-4-1-7-4-8-8 5 0 8 3 8 8Z" />
      <path d="M12 12c4-1 7-4 8-8-5 0-8 3-8 8Z" />
    </I>
  );
}

export function MailIcon(p) {
  return (
    <I {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </I>
  );
}

export function LockIcon(p) {
  return (
    <I {...p}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </I>
  );
}

export function CheckCircleIcon(p) {
  return (
    <I {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </I>
  );
}

export function ScanIcon(p) {
  return (
    <I {...p}>
      <path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8" />
      <path d="M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8" />
      <path d="M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16" />
      <path d="M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16" />
      <circle cx="12" cy="12" r="3.25" />
    </I>
  );
}

export function ShieldCheckIcon(p) {
  return (
    <I {...p}>
      <path d="M12 3 5 6v6c0 4.2 2.7 7.2 7 8.5 4.3-1.3 7-4.3 7-8.5V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </I>
  );
}

export function StarIcon(p) {
  return (
    <I {...p}>
      <path d="M12 3.5 14.4 9l5.9.6-4.4 3.8 1.3 5.8L12 16.6 6.8 19.2l1.3-5.8L3.7 9.6 9.6 9 12 3.5Z" />
    </I>
  );
}

export function ArrowRightIcon(p) {
  return (
    <I {...p}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </I>
  );
}

export function UserIcon(p) {
  return (
    <I {...p}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19.5c1.2-3.2 3.7-5 7-5s5.8 1.8 7 5" />
    </I>
  );
}

export function PhoneIcon(p) {
  return (
    <I {...p}>
      <path d="M7 3.5h4.5A1.5 1.5 0 0 1 13 5v14a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z" />
      <path d="M9.25 18h.5" />
    </I>
  );
}

export function GlobeIcon(p) {
  return (
    <I {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.6 2.4 4 5.5 4 9s-1.4 6.6-4 9c-2.6-2.4-4-5.5-4-9s1.4-6.6 4-9Z" />
    </I>
  );
}

export function MapPinIcon(p) {
  return (
    <I {...p}>
      <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.25" />
    </I>
  );
}

export function EyeIcon(p) {
  return (
    <I {...p}>
      <path d="M2.5 12S6.2 5.5 12 5.5 21.5 12 21.5 12 17.8 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.75" />
    </I>
  );
}

export function EyeOffIcon(p) {
  return (
    <I {...p}>
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6A2.75 2.75 0 0 0 12 14.8a2.75 2.75 0 0 0 2.4-1.4" />
      <path d="M7 7.4C4.6 9 3 12 3 12s3.7 6.5 9.5 6.5c1.6 0 3-.3 4.3-.8" />
      <path d="M14.1 6.1A10 10 0 0 1 12 5.5C6.2 5.5 2.5 12 2.5 12" />
    </I>
  );
}

export function WheatIcon(p) {
  return (
    <I {...p}>
      <path d="M12 22V8" />
      <path d="M12 18c-2.2-.8-4-2.6-4.5-5 .8.2 1.7.2 2.5 0" />
      <path d="M12 14c-2.2-.8-4-2.6-4.5-5 .8.2 1.7.2 2.5 0" />
      <path d="M12 10c-2-.7-3.4-2.2-3.8-4.2.8.2 1.6.2 2.3 0" />
      <path d="M12 18c2.2-.8 4-2.6 4.5-5-.8.2-1.7.2-2.5 0" />
      <path d="M12 14c2.2-.8 4-2.6 4.5-5-.8.2-1.7.2-2.5 0" />
      <path d="M12 10c2-.7 3.4-2.2 3.8-4.2-.8.2-1.6.2-2.3 0" />
    </I>
  );
}

export function ClipboardIcon(p) {
  return (
    <I {...p}>
      <rect x="6" y="5" width="12" height="16" rx="2" />
      <path d="M9 5V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" />
      <path d="M9 11h6" />
      <path d="M9 15h4" />
    </I>
  );
}

export function FlaskIcon(p) {
  return (
    <I {...p}>
      <path d="M9 3h6" />
      <path d="M10 3v6L5.2 18.2A2.4 2.4 0 0 0 7.3 21.5h9.4a2.4 2.4 0 0 0 2.1-3.3L14 9V3" />
      <path d="M8.2 15h7.6" />
    </I>
  );
}

export function SettingsIcon(p) {
  return (
    <I {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.2M12 18.3v2.2M4.9 6.5l1.6 1.6M17.5 16l1.6 1.6M3.5 12h2.2M18.3 12h2.2M4.9 17.5l1.6-1.6M17.5 8.1l1.6-1.6" />
    </I>
  );
}

export function DropletIcon(p) {
  return (
    <I {...p}>
      <path d="M12 3.5S6.5 10 6.5 14.2a5.5 5.5 0 0 0 11 0C17.5 10 12 3.5 12 3.5Z" />
    </I>
  );
}

export function ActivityIcon(p) {
  return (
    <I {...p}>
      <path d="M3 12h4l2.5-6 5 12 2.5-6H21" />
    </I>
  );
}

export function TractorIcon(p) {
  return (
    <I {...p}>
      <circle cx="7" cy="17" r="3" />
      <circle cx="18" cy="17" r="2.25" />
      <path d="M3 17h1M10 17h6" />
      <path d="M5 12h6l2-5h4l2 5" />
      <path d="M11 12V8h5" />
    </I>
  );
}

export function AlertIcon(p) {
  return (
    <I {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5" />
      <path d="M12 16.2h.01" />
    </I>
  );
}

export function LoaderIcon({ size = 16, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" opacity="0.25" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ChevronDownIcon(p) {
  return (
    <I {...p}>
      <path d="m6 9 6 6 6-6" />
    </I>
  );
}

export function BuildingIcon(p) {
  return (
    <I {...p}>
      <rect x="4" y="4" width="16" height="16" rx="1.5" />
      <path d="M9 20v-6h6v6" />
      <path d="M8 8h.01M12 8h.01M16 8h.01M8 12h.01M12 12h.01M16 12h.01" />
    </I>
  );
}

export function GoogleMark({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#059669"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#047857"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
      />
      <path
        fill="#10b981"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#34d399"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

