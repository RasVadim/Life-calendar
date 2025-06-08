import { FC } from 'react';

type PropsType = {
  size?: string;
  color?: string;
  isActive?: boolean;
};

export const ChevronIcon: FC<PropsType> = ({ size = '22', color = '#888', isActive = false }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 6L15 12L9 18"
      stroke={isActive ? '#7C3AED' : color}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
