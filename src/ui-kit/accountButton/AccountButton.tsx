import { FC } from "react";

import { DefaultUserIcon } from "@/icons";

import s from "./s.module.styl";

type PropsType = {
  imageUrl?: string;
};

export const AccountButton: FC<PropsType> = ({ imageUrl = "" }) => {
  return (
    <button className={s.button}>
      {imageUrl ? (
        <img className={s.image} alt="user image" src={imageUrl} />
      ) : (
        <DefaultUserIcon />
      )}
    </button>
  );
};
