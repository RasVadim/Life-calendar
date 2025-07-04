import { FC } from 'react';

type PropsType = {
  size?: string;
  color?: string;
  secondaryColor?: string;
  isActive?: boolean;
};

export const HouseIcon: FC<PropsType> = ({
  size = '20',
  color = '#9DB2CE',
  secondaryColor = '#FFFFFF',
  isActive = false,
}) => {
  return isActive ? (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.04 7.31994L14.28 3.28994C12.71 2.18994 10.3 2.24994 8.78999 3.41994L3.77999 7.32994C2.77999 8.10994 1.98999 9.70994 1.98999 10.9699V17.8699C1.98999 20.4199 4.05999 22.4999 6.60999 22.4999H17.39C19.94 22.4999 22.01 20.4299 22.01 17.8799V11.0999C22.01 9.74994 21.14 8.08994 20.04 7.31994ZM12.75 18.4999C12.75 18.9099 12.41 19.2499 12 19.2499C11.59 19.2499 11.25 18.9099 11.25 18.4999V15.4999C11.25 15.0899 11.59 14.7499 12 14.7499C12.41 14.7499 12.75 15.0899 12.75 15.4999V18.4999Z"
        fill={secondaryColor}
      />
    </svg>
  ) : (
    <svg
      width={size}
      height={size}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.52 3.33992L4.13 7.53992C3.23 8.23992 2.5 9.72992 2.5 10.8599V18.2699C2.5 20.5899 4.39 22.4899 6.71 22.4899H18.29C20.61 22.4899 22.5 20.5899 22.5 18.2799V10.9999C22.5 9.78992 21.69 8.23992 20.7 7.54992L14.52 3.21992C13.12 2.23992 10.87 2.28992 9.52 3.33992Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 18.49V15.49"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
