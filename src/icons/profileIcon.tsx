import { FC } from 'react';

type PropsType = {
  size?: string;
  color?: string;
  secondaryColor?: string;
  isActive?: boolean;
};

export const ProfileIcon: FC<PropsType> = ({
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
        d="M12 12.5C14.7614 12.5 17 10.2614 17 7.5C17 4.73858 14.7614 2.5 12 2.5C9.23858 2.5 7 4.73858 7 7.5C7 10.2614 9.23858 12.5 12 12.5Z"
        fill={secondaryColor}
      />
      <path
        d="M12 15C6.98997 15 2.90997 18.36 2.90997 22.5C2.90997 22.78 3.12997 23 3.40997 23H20.59C20.87 23 21.09 22.78 21.09 22.5C21.09 18.36 17.01 15 12 15Z"
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
        d="M12.5 12.5C15.2614 12.5 17.5 10.2614 17.5 7.5C17.5 4.73858 15.2614 2.5 12.5 2.5C9.73858 2.5 7.5 4.73858 7.5 7.5C7.5 10.2614 9.73858 12.5 12.5 12.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.09 22.5C21.09 18.63 17.24 15.5 12.5 15.5C7.76003 15.5 3.91003 18.63 3.91003 22.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
