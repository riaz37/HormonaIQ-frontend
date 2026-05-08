interface IconProps {
  className?: string;
}

export function LeafIcon({ className }: IconProps) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M14 24 C14 20 14 14 14 8 C14 8 8 10 7.5 16 C7 22 12 23 14 24Z"
        fill="#C7D9C5"
        stroke="#3F6F5A"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 18 C16 15 20 15 21 10 C18 9 15 13 14 18Z"
        fill="#C7D9C5"
        stroke="#3F6F5A"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="14"
        y1="8"
        x2="14"
        y2="24"
        stroke="#3F6F5A"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="2 2"
      />
    </svg>
  );
}

export function SprigIcon({ className }: IconProps) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M14 23 L14 10"
        stroke="#3F6F5A"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M14 17 C12 14 7 14 7 9 C11 9 14 14 14 17Z"
        fill="#C7D9C5"
        stroke="#3F6F5A"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M14 13 C16 10 21 10 21 5 C17 5 14 10 14 13Z"
        fill="#DCEBDD"
        stroke="#3F6F5A"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BranchIcon({ className }: IconProps) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M8 20 C8 16 10 14 14 14 C18 14 20 16 20 20"
        stroke="#3F6F5A"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M14 14 L14 6"
        stroke="#3F6F5A"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="8" cy="20" r="2" fill="#B97A8A" stroke="#3F6F5A" strokeWidth="1" />
      <circle cx="20" cy="20" r="2" fill="#E89F86" stroke="#3F6F5A" strokeWidth="1" />
      <circle cx="14" cy="6" r="2" fill="#C7D9C5" stroke="#3F6F5A" strokeWidth="1" />
      <circle cx="14" cy="14" r="1.5" fill="#F5E4B8" stroke="#3F6F5A" strokeWidth="1" />
    </svg>
  );
}
