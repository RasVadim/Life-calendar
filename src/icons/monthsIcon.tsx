import { FC } from 'react';

type PropsType = {
  size?: string;
  color?: string;
  secondaryColor?: string;
  isActive?: boolean;
};

export const MonthsIcon: FC<PropsType> = ({
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
        id="svg_1"
        fill={secondaryColor}
        d="m17.71245,9.28755c1.6569,0 3,-1.34315 3,-3c0,-1.65685 -1.3431,-3 -3,-3c-1.6569,0 -3,1.34315 -3,3c0,1.65685 1.3431,3 3,3z"
      />
      <path
        stroke="null"
        id="svg_2"
        fill={secondaryColor}
        d="m17.14775,10.52605c-2.06401,0 -3.74518,-1.68117 -3.74518,-3.74518c0,-0.75736 0.22471,-1.45646 0.61587,-2.03904c-0.84891,-0.29129 -1.75607,-0.45774 -2.69653,-0.45774c-4.58577,0 -8.32263,3.73686 -8.32263,8.32263c0,4.58577 3.73686,8.32263 8.32263,8.32263c4.58577,0 8.32263,-3.73686 8.32263,-8.32263c0,-0.94046 -0.16645,-1.84762 -0.45774,-2.69653c-0.58258,0.39116 -1.28168,0.61587 -2.03904,0.61587z"
      />
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
        d="M19 8C20.6569 8 22 6.65685 22 5C22 3.34315 20.6569 2 19 2C17.3431 2 16 3.34315 16 5C16 6.65685 17.3431 8 19 8Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.02 2.2C13.36 2.07 12.69 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 11.32 21.93 10.65 21.8 10.01"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
