import { FC, ReactNode } from "react";

import { Header, Content, TabBar } from "@/components";

import s from "./s.module.styl";

type PropsType = {
  children?: ReactNode;
};

export const MainPage: FC<PropsType> = () => {
  return (
    <div className={s.page}>
      <Header />
      <Content />
      <TabBar />
    </div>
  );
};
