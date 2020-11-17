import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-navi';
import { useTranslation } from 'react-i18next';
import './LogoBar.scss';

const LogoBar = ({ setFullscreen }) => {
  const { t } = useTranslation();

  return (
    <div className="logo-bar">
      <p>
        {t('pages.reports.logo-bar.intro')}{' '}
        <Link href="/reports/">{t('pages.reports.logo-bar.link')}</Link>{' '}
        {t('pages.reports.logo-bar.outro')}
      </p>
      <button type="button" onClick={setFullscreen}>
        {t('pages.reports.logo-bar.fullscreen')}
      </button>
    </div>
  );
};

LogoBar.propTypes = {
  setFullscreen: PropTypes.func.isRequired,
};

export default LogoBar;
