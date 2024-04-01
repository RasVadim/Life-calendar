import { FC } from "react";

import { NavigationButton } from "@/ui-kit";

import s from "./s.module.styl";

type PropsType = {};

export const TabBar: FC<PropsType> = ({}) => {
  return (
    <div className={s.tabBar}>
      <NavigationButton type="life" label="life" />
      <NavigationButton type="events" label="events" />
      <NavigationButton type="plans" label="plans" />
    </div>
  );
};
