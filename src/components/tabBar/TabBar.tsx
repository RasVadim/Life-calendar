import { FC } from "react";
import { useTranslation } from "react-i18next";

import { NavigationButton } from "@/ui-kit";
import { PATHS } from "@/constants";

import s from "./s.module.styl";

type PropsType = {};

export const TabBar: FC<PropsType> = () => {
  const { t } = useTranslation();

  return (
    <div className={s.tabBar}>
      <NavigationButton icon="life" label={t("layout.life")} to={PATHS.MAIN} />
      <NavigationButton
        icon="events"
        label={t("layout.events")}
        to={PATHS.EVENTS}
      />
      <NavigationButton
        icon="plans"
        label={t("layout.plans")}
        to={PATHS.PLANS}
      />
    </div>
  );
};
