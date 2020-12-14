import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from 'react-navi';
import config from 'react-global-configuration';
import SkipLink from '../SkipLink';
import './index.scss';

const Header = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = (e) => {
    e.preventDefault();
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <header className="govuk-header" role="banner" data-module="govuk-header">
        <SkipLink />
        <div className="govuk-header__container govuk-width-container">
          <div className="govuk-header__logo">
            <a
              href="/"
              id="home"
              onClick={async (e) => {
                e.preventDefault();
                await navigation.navigate('/');
              }}
              className="govuk-header__link govuk-header__link--service-name"
            >
              {t('header.service-name')}
            </a>
          </div>
          <div className="govuk-header__content">
            <button
              type="button"
              className={
                mobileMenuOpen
                  ? 'govuk-header__menu-button govuk-js-header-toggle govuk-header__menu-button--open'
                  : 'govuk-header__menu-button govuk-js-header-toggle'
              }
              aria-controls="navigation"
              aria-label="Show or hide navigation menu"
              onClick={(e) => {
                toggleMenu(e);
              }}
            >
              Menu
            </button>
            <nav id="globalNav">
              <ul
                id="navigation"
                className={
                  mobileMenuOpen
                    ? 'govuk-header__navigation govuk-header__navigation--open'
                    : 'govuk-header__navigation'
                }
                aria-label="Navigation menu"
              >
                <li className="govuk-header__navigation-item">
                  <a
                    href="/forms/edit-your-profile"
                    id="myprofile"
                    className="govuk-header__link"
                    onClick={async (e) => {
                      e.preventDefault();
                      toggleMenu(e);
                      await navigation.navigate('/forms/edit-your-profile');
                    }}
                  >
                    {t('header.my-profile')}
                  </a>
                </li>
                <li className="govuk-header__navigation-item">
                  <a
                    id="support"
                    className="govuk-header__link"
                    href={config.get('supportUrl')}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('header.support')}
                  </a>
                </li>
                <li className="govuk-header__navigation-item">
                  <a
                    className="govuk-header__link"
                    href="/logout"
                    id="logout"
                    onClick={async (e) => {
                      e.preventDefault();
                      await navigation.navigate('/logout');
                    }}
                  >
                    {t('header.sign-out')}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
