import { FC, useState } from 'react';

type PropsType = {
  size?: string;
  color1?: string;
  color2?: string;
  isActive?: boolean;
};

export const CheckIcon: FC<PropsType> = ({
  size = '22',
  color1 = '#2AF598',
  color2 = '#009EFD',
  isActive = false,
}) => {
  const [gradientId] = useState(
    () => `check-gradient-${Math.random().toString(36).substring(2, 9)}`,
  );

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
          <stop stopColor={color1} />
          <stop offset="1" stopColor={color2} />
        </linearGradient>
      </defs>
      <path
        d="M5 13L10 18L19 7"
        stroke={isActive ? color1 : `url(#${gradientId})`}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
