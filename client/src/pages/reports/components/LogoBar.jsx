import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import './LogoBar.scss';

export const fullscreen = (report) => report.fullscreen();
export const reload = (report) => report.reload();

const LogoBar = ({ report, visitedPages }) => {
  const { t } = useTranslation();
  return (
    <div className="logo-bar">
      <button
        id="reload"
        type="button"
        onClick={() => {
          // eslint-disable-next-line no-param-reassign
          visitedPages.current = [];
          reload(report);
        }}
      >
        {t('pages.report.logo-bar.reload')}
      </button>
      <button
        id="fullscreen"
        type="button"
        onClick={() => {
          fullscreen(report);
        }}
      >
        {t('pages.report.logo-bar.fullscreen')}
      </button>
    </div>
  );
};

LogoBar.propTypes = {
  report: PropTypes.shape({
    fullscreen: PropTypes.func.isRequired,
  }).isRequired,
  visitedPages: PropTypes.shape({
    current: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default LogoBar;
