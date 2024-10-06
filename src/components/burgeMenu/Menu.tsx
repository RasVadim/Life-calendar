import { FC, useState } from "react";
import {} from "../../styles/colors.styl";
import cx from "classnames";

import { LanguageSwitcher, ThemeSwitcher } from "@/features";
import { Button } from "@/ui-kit";

import s from "./s.module.styl";

type PropsType = {
  isOpen: boolean;
};

export const Menu: FC<PropsType> = ({ isOpen }) => {
  const [testProp, setTestProp] = useState();
  const [count, setCount] = useState(0);

//every second changed testProp setTestProp()

  if (count % 2 === 0)
    return (
      <div className={cx(s.menu, { [s.hidden]: !isOpen })}>
        <ThemeSwitcher testProp={testProp} />
        <Button label="button" icon="life" />
        <br />
        <Button label="button" icon="life" active/>
        {count}
      </div>
    );

  return (
    <div className={cx(s.menu, { [s.hidden]: !isOpen })}>
      <LanguageSwitcher />
      <ThemeSwitcher testProp={testProp} />
      <Button label="button"  icon="settings"/>
      <br />
      <Button label="button"  icon="settings" active/>
      {count}
    </div>
  );
};
