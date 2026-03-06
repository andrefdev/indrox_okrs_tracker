interface IndroxLogoProps {
  className?: string;
}

export function IndroxLogo({ className }: IndroxLogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 300deg progress arc with gap at top */}
      <path
        d="M22.5 4.75A13 13 0 1 1 9.5 4.75"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Upward arrow */}
      <path
        d="M16 22V11M11 15.5 16 11l5 4.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
