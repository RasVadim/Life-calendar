import React from 'react';

import { useTranslation } from 'react-i18next';

const Appearance: React.FC = () => {
  const { t } = useTranslation();
  return <div>{t('layout.appearance')}</div>;
};

export default Appearance;
