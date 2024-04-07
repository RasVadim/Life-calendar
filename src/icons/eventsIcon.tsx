import { FC } from "react";

type PropsType = {
  size?: string;
  color?: string;
  secondaryColor?: string;
  isActive?: boolean;
};

export const EventsIcon: FC<PropsType> = ({
  size = "34",
  color = "#747474",
  secondaryColor = "#95cbc9",
  isActive = false,
}) => {
  const iconColor = isActive ? "#95cbc9" : color;
  return (
    <svg
      fill={iconColor}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      id="fencing-2"
      data-name="Line Color"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        id="secondary"
        x1="6"
        y1="9"
        x2="8"
        y2="7"
        fill="none"
        stroke={secondaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></line>
      <line
        id="secondary-2"
        data-name="secondary"
        x1="3"
        y1="4"
        x2="9"
        y2="10"
        fill="none"
        stroke={secondaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></line>
      <path
        id="primary"
        d="M21,21l-3.74-6.54a2,2,0,0,1-.26-1V8H13v5.17a2,2,0,0,1-.59,1.42l-1.82,1.82A2,2,0,0,0,10,17.83V21"
        fill="none"
        stroke={iconColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></path>
      <path
        id="primary-2"
        data-name="primary"
        d="M9,10l4-2h4l3.51,2.11A1,1,0,0,1,21,11v1"
        fill="none"
        stroke={iconColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></path>
      <circle
        id="primary-3"
        data-name="primary"
        cx="15"
        cy="5"
        r="2"
        fill="none"
        stroke={iconColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></circle>
    </svg>
  );
};
