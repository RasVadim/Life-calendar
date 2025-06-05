import React from 'react';

import { useTranslation } from 'react-i18next';

const Account: React.FC = () => {
  const { t } = useTranslation();
  return <div>{t('layout.myProfile')}</div>;
};

export default Account;
