import { FC, cloneElement } from "react";

import { BUTTON_ICONS, type TIconName } from "./buttonIcons";

import s from "./s.module.styl";

type PropsType = {
  icon: TIconName;
  label?: string;
  isActive?: boolean;
};

export const Button: FC<PropsType> = ({
  icon = "menu",
  label,
  isActive = false,
}) => {
  const buttonIcon = BUTTON_ICONS[icon];

  const iconWithProps = buttonIcon
    ? cloneElement(buttonIcon, { isActive })
    : "";

  return (
    <button className={s.button}>
      {iconWithProps}
      {label && <p className={s.label}>{label}</p>}
    </button>
  );
};
