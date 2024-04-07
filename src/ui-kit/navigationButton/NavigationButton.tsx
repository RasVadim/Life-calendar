import { FC } from "react";
import { Link, useMatch } from "react-router-dom";

import { Button, type TIconName } from "@/ui-kit";

import s from "./s.module.styl";

type PropsType = {
  icon: TIconName;
  label?: string;
  to: string;
};

export const NavigationButton: FC<PropsType> = ({ to, icon, label }) => {
  const match = useMatch(to);

  return (
    <Link to={to} className={match ? s.active : ""}>
      <Button icon={icon} isActive={!!match} />
      {label && <p className={s.label}>{label}</p>}
    </Link>
  );
};
