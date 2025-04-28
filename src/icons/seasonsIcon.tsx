import { FC } from 'react';

type PropsType = {
  size?: string;
  color?: string;
  secondaryColor?: string;
  isActive?: boolean;
};

export const SeasonsIcon: FC<PropsType> = ({
  size = '24',
  color = '#9DB2CE',
  secondaryColor = '#FFFFFF',
  isActive = false,
}) => {
  return isActive ? (
    <svg
      width={size}
      height={size}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.17 7.4499C21.53 5.2799 19.72 3.4699 17.55 2.8299C15.9 2.3499 14.76 2.3899 13.97 2.9799C13.02 3.6899 12.91 4.9699 12.91 5.8799V8.3699C12.91 10.8299 14.03 12.0799 16.23 12.0799H19.1C20 12.0799 21.29 11.9699 22 11.0199C22.61 10.2399 22.66 9.0999 22.17 7.4499Z"
        fill={secondaryColor}
      />
      <path
        d="M19.41 13.8599C19.15 13.5599 18.77 13.3899 18.38 13.3899H14.8C13.04 13.3899 11.61 11.9599 11.61 10.1999V6.61991C11.61 6.22991 11.44 5.84991 11.14 5.58991C10.85 5.32991 10.45 5.20991 10.07 5.25991C7.71999 5.55991 5.55999 6.84991 4.14999 8.78991C2.72999 10.7399 2.20999 13.1199 2.65999 15.4999C3.30999 18.9399 6.05999 21.6899 9.50999 22.3399C10.06 22.4499 10.61 22.4999 11.16 22.4999C12.97 22.4999 14.72 21.9399 16.21 20.8499C18.15 19.4399 19.44 17.2799 19.74 14.9299C19.79 14.5399 19.67 14.1499 19.41 13.8599Z"
        fill={secondaryColor}
      />
    </svg>
  ) : (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.32 12.4999C20.92 12.4999 22 11.4999 21.04 8.21994C20.39 6.00994 18.49 4.10994 16.28 3.45994C13 2.49994 12 3.57994 12 6.17994V9.05994C12 11.4999 13 12.4999 15 12.4999H18.32Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 15.2C19.07 19.83 14.63 23.19 9.57999 22.37C5.78999 21.76 2.73999 18.71 2.11999 14.92C1.30999 9.89001 4.64999 5.45001 9.25999 4.51001"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
