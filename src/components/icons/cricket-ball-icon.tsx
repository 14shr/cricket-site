import type { SVGProps } from "react";

export const CricketBallIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a10 10 0 0 0-2.34 19.78" />
    <path d="M22 12a10 10 0 0 0-19.78-2.34" />
  </svg>
);
