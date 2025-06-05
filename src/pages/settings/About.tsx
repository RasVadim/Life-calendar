import React from 'react';

import { useTranslation } from 'react-i18next';

const About: React.FC = () => {
  const { t } = useTranslation();
  return <div>{t('layout.lcAbout')}</div>;
};

export default About;
