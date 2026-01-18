type LogoProps = {
  size?: number;
  className?: string;
};

export function Logo({ size = 32, className = "" }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
    >
      <rect x="2" y="2" width="13" height="13" rx="3" fill="#facc15" />
      <rect x="17" y="2" width="13" height="13" rx="3" fill="#22c55e" />
      <rect x="2" y="17" width="13" height="13" rx="3" fill="#3b82f6" />
      <rect x="17" y="17" width="13" height="13" rx="3" fill="#9333ea" />
    </svg>
  );
}
