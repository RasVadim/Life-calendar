import { FC } from 'react';

type PropsType = {
  size?: string;
  color?: string;
  isActive?: boolean;
};

export const CheckIcon: FC<PropsType> = ({ size = '22', color = '#7C3AED', isActive = false }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 13L10 18L19 7"
      stroke={isActive ? '#613EEA' : color}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
