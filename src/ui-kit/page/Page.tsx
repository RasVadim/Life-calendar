import { Suspense, FC, ReactNode } from 'react';

import KeepAlive from 'react-activation';

import { PageLoadingHolder } from '../pageLoadingHolder/PageLoadingHolder';

import s from './s.module.styl';

type PropsType = {
  children?: ReactNode;
  name?: string;
};

export const Page: FC<PropsType> = ({ children, name = 'page' }) => {
  return (
    <KeepAlive name={name} cacheKey={name} id={name} autoFreeze>
      <Suspense fallback={<PageLoadingHolder />}>
        <div className={s.page}>{children}</div>
      </Suspense>
    </KeepAlive>
  );
};
