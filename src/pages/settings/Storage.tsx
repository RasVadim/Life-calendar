import React from 'react';

import { useTranslation } from 'react-i18next';

const Storage: React.FC = () => {
  const { t } = useTranslation();
  return <div>{t('layout.dataAndStorage')}</div>;
};

export default Storage;
