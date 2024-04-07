import { FC, ReactNode } from "react";

import { Page } from "@/ui-kit";

import { Content } from "@/components";


type PropsType = {
  children?: ReactNode;
};

export const Life: FC<PropsType> = () => {
  return (
    <Page>
      <Content />
    </Page>
  );
};