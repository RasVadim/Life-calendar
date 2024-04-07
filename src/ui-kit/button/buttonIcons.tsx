import { ReactElement } from "react";

import { BackIcon, EventsIcon, LifeIcon, MenuIcon, PlansIcon } from "@/icons";

export type TIconName = "menu" | "back" | "life" | "events" | "plans";

export const BUTTON_ICONS: Record<TIconName, ReactElement> = {
  menu: <MenuIcon />,
  back: <BackIcon />,
  life: <LifeIcon />,
  events: <EventsIcon />,
  plans: <PlansIcon />,
};
