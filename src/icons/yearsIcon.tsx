import { FC } from 'react';

type PropsType = {
  size?: string;
  color?: string;
  secondaryColor?: string;
  isActive?: boolean;
};

export const YearsIcon: FC<PropsType> = ({
  size = '24',
  color = '#9DB2CE',
  secondaryColor = '#FFFFFF',
  isActive = false,
}) => {
  return isActive ? (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.24999 21.64C6.24999 20.84 4.49999 19.39 3.33999 17.38C2.19999 15.41 1.81999 13.22 2.08999 11.13"
        stroke={secondaryColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.84998 4.47998C7.54998 3.14998 9.67997 2.35999 12 2.35999C14.27 2.35999 16.36 3.12997 18.04 4.40997"
        stroke={secondaryColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.75 21.64C17.75 20.84 19.5 19.39 20.66 17.38C21.8 15.41 22.18 13.22 21.91 11.13"
        stroke={secondaryColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="5" fill={secondaryColor} />
    </svg>
  ) : (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.42 7.95C18.86 10.39 18.86 14.35 16.42 16.79C13.98 19.23 10.02 19.23 7.58 16.79C5.14 14.35 5.14 10.39 7.58 7.95C10.02 5.51 13.98 5.51 16.42 7.95Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.24999 21.64C6.24999 20.84 4.49999 19.39 3.33999 17.38C2.19999 15.41 1.81999 13.22 2.08999 11.13"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.84998 4.47998C7.54998 3.14998 9.67997 2.35999 12 2.35999C14.27 2.35999 16.36 3.12997 18.04 4.40997"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.75 21.64C17.75 20.84 19.5 19.39 20.66 17.38C21.8 15.41 22.18 13.22 21.91 11.13"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
