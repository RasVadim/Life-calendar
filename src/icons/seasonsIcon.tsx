import { FC } from "react";

type PropsType = {
  size?: string;
  color?: string;
  isActive?: boolean;
};

export const SeasonsIcon: FC<PropsType> = ({
  size = "34",
  color = "#747474",
  isActive = false,
}) => {
  const iconColor = isActive ? "#95cbc9" : color;
  return (
    <svg
      fill={iconColor}
      height={size}
      width={size}
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 430 430"
    >
      <g id="XMLID_1082_">
        <path
          id="XMLID_1083_"
          d="M253.84,221.832c-2.221-2.814-4.887-5.152-8.002-7.013c-3.119-1.856-6.535-3.146-10.25-3.866
		c3.355-0.598,6.443-1.766,9.262-3.506c2.814-1.736,5.242-3.924,7.281-6.563c2.037-2.635,3.625-5.574,4.766-8.811
		c1.137-3.236,1.707-6.652,1.707-10.249c0-4.794-1.019-9.139-3.057-13.035c-2.039-3.895-4.916-7.253-8.631-10.07
		c-3.717-2.814-8.211-4.973-13.484-6.473c-5.277-1.498-11.09-2.247-17.441-2.247c-4.797,0-9.471,0.421-14.025,1.258
		c-4.559,0.84-8.813,2.008-12.768,3.506c-3.955,1.5-7.492,3.326-10.609,5.484c-3.117,2.158-5.635,4.494-7.551,7.014l18.16,20.857
		c2.756-4.316,6.143-7.643,10.16-9.979c4.014-2.338,8.479-3.508,13.395-3.508c4.555,0,8.209,1.02,10.969,3.058
		c2.756,2.039,4.135,5.034,4.135,8.989c0,4.558-1.887,8.212-5.664,10.969c-3.775,2.76-9.02,4.136-15.732,4.136h-5.934v20.677h5.395
		c8.631,0,14.953,1.379,18.971,4.137c4.014,2.759,6.023,6.832,6.023,12.227c0,9.951-6.773,14.924-20.32,14.924
		c-5.752,0-10.697-0.868-14.834-2.607c-4.135-1.736-7.82-4.285-11.057-7.642l-15.465,20.497
		C179.547,274.665,193.811,280,212.033,280c7.432,0,14.143-0.871,20.139-2.607c5.992-1.738,11.117-4.197,15.373-7.373
		c4.254-3.176,7.521-7.012,9.799-11.506c2.277-4.496,3.418-9.559,3.418-15.193c0-4.195-0.602-8.12-1.799-11.777
		C257.764,227.888,256.055,224.65,253.84,221.832z"
        />
        <path
          id="XMLID_1084_"
          d="M430,200h-90.903C332.254,143.041,286.959,97.746,230,90.903V60.716
		c35.717,3.408,68.855,18.956,94.56,44.642l21.205-21.221C314.391,52.785,273.735,34.094,230,30.606V0h-30v30.61
		C109.928,37.873,37.873,109.928,30.61,200H0v30h30.61c7.263,90.072,79.317,162.127,169.39,169.39V430h30v-30.61
		c90.072-7.263,162.127-79.317,169.39-169.39H430V200z M215,310c-52.383,0-95-42.617-95-95s42.617-95,95-95s95,42.617,95,95
		S267.383,310,215,310z M200,60.729v30.175C143.041,97.746,97.746,143.041,90.903,200H60.729
		C67.821,126.482,126.482,67.821,200,60.729z M60.729,230h30.175C97.746,286.959,143.041,332.254,200,339.097v30.175
		C126.482,362.179,67.821,303.518,60.729,230z M230,369.272v-30.175c56.959-6.843,102.254-52.138,109.097-109.097h30.175
		C362.179,303.518,303.518,362.179,230,369.272z"
        />
      </g>
    </svg>
  );
};
