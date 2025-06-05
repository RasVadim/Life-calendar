import React from 'react';

import { useTranslation } from 'react-i18next';

const Premium: React.FC = () => {
  const { t } = useTranslation();
  return <div>{t('layout.lcPremium')}</div>;
};

export default Premium;
