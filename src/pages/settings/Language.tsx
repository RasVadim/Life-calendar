import React from 'react';

import { useTranslation } from 'react-i18next';

const Language: React.FC = () => {
  const { t } = useTranslation();
  return <div>{t('layout.language')}</div>;
};

export default Language;
