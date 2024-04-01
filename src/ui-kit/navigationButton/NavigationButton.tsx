import { FC } from "react";

import { MenuIcon, BackIcon, LifeIcon, EventsIcon, PlansIcon } from "@/icons";

import s from "./s.module.styl";

type PropsType = {
  type: "menu" | "back" | "life" | "events" | "plans";
  label?: string;
};

export const NavigationButton: FC<PropsType> = ({ type = "", label }) => {
  const icon = {
    menu: <MenuIcon />,
    back: <BackIcon />,
    life: <LifeIcon />,
    events: <EventsIcon />,
    plans: <PlansIcon />,
  }[type];

  return (
    <div className={s.wrap}>
      <button className={s.button}>{icon}</button>
      {label && <p className={s.label}>{label}</p>}
    </div>
  );
};
