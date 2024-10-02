import { FC } from "react";

type PropsType = {
  size?: string;
  color?: string;
  isActive?: boolean;
};

export const MenuIcon: FC<PropsType> = ({
  size = "26",
  color = "#747474",
  isActive = false,
}) => {
  const iconColor = isActive ? "#95cbc9" : color;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M5 7H19" stroke={iconColor} strokeLinecap="round" />
      <path d="M5 12H19" stroke={iconColor} strokeLinecap="round" />
      <path d="M5 17H19" stroke={iconColor} strokeLinecap="round" />
    </svg>
  );
};
