import { FC } from "react";

import { USER_AGE } from "@/constants";

import { Year } from "./year/Year";
import type { TYear } from "./types";

import s from "./s.module.styl";

type PropsType = {
  years: TYear[];
};

export const LifeCalendar: FC<PropsType> = ({ years }) => {
  return (
    <div className={s.calendar}>
      {years.map((year) => (
        <Year
          key={year.id}
          id={year.id}
          weeks={year.weeks}
          isLast={year.id === "y" + USER_AGE}
        />
      ))}
    </div>
  );
};
