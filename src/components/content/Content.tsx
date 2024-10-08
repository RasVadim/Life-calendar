import { FC, useMemo } from "react";

import { LifeCalendar } from "@/components";
import { USER_AGE, WEEKS_PER_YEAR } from "@/constants";

import s from "./s.module.styl";

type PropsType = {};

export const Content: FC<PropsType> = ({}) => {
  const years = useMemo(() => {
    return [...Array(USER_AGE)].map((_, index) => ({
      id: "y" + (index + 1),
      weeks: [...Array(WEEKS_PER_YEAR)].map((_, i) => ({
        id: "w" + (i + 1 + index * WEEKS_PER_YEAR),
      })),
    }));
  }, []);

  return (
    <div className={s.content}>
      <LifeCalendar years={years} />
    </div>
  );
};

export default Content