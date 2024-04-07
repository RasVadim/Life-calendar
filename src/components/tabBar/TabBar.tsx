import { FC } from "react";

import { NavigationButton } from "@/ui-kit";

import s from "./s.module.styl";

type PropsType = {};

export const TabBar: FC<PropsType> = () => {
  return (
    <div className={s.tabBar}>
      <NavigationButton icon="life" label="life" to='/'/>
      <NavigationButton icon="events" label="events" to='/events' />
      <NavigationButton icon="plans" label="plans" to='/plans'/>
    </div>
  );
};
