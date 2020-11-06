import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from 'react-navi';
import styled from 'styled-components';
import config from 'react-global-configuration';
import SkipLink from '../SkipLink';

const Header = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <>
      <header className="govuk-header" role="banner" data-module="govuk-header">
        <SkipLink />
        <div className="govuk-header__container govuk-width-container">
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-one-half">
              <a
                href="/dashboard"
                id="home"
                onClick={async (e) => {
                  e.preventDefault();
                  await navigation.navigate('/dashboard');
                }}
                className="govuk-header__link govuk-header__link--service-name"
              >
                {t('header.service-name')}
              </a>
            </div>
            <div className="govuk-grid-column-one-half">
              <StyledCol>
                <NavLink
                  id="myprofile"
                  className="govuk-header__link"
                  onClick={async (e) => {
                    e.preventDefault();
                    await navigation.navigate('/forms/edit-your-profile');
                  }}
                >
                  {t('header.my-profile')}
                </NavLink>
                <NavLink
                  id="support"
                  className="govuk-header__link"
                  href={config.get('supportUrl')}
                  target="_blank"
                >
                  {t('header.support')}
                </NavLink>
                <NavLink
                  className="govuk-header__link"
                  href="/logout"
                  id="logout"
                  onClick={async (e) => {
                    e.preventDefault();
                    await navigation.navigate('/logout');
                  }}
                >
                  {t('header.sign-out')}
                </NavLink>
              </StyledCol>
            </div>
          </div>
        </div>
      </header>
      <div className="govuk-phase-banner govuk-width-container">
        <p className="govuk-phase-banner__content">
          <strong className="govuk-tag govuk-phase-banner__content__tag ">
            {config.get('uiVersion')}
          </strong>
          <span>
            <strong className="govuk-tag govuk-phase-banner__content__tag ">
              {config.get('uiEnvironment')}
            </strong>
          </span>
          <span className="govuk-phase-banner__text">
            {t('header.new-service-1')}{' '}
            <a
              className="govuk-link"
              href={`${config.get('serviceDeskUrl')}/create/54`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('header.new-service-2')}
            </a>{' '}
            {t('header.new-service-3')}
          </span>
        </p>
      </div>
    </>
  );
};

const StyledCol = styled.div`
  margin-top: 5px;
  text-align: right;
  font-weight: bold;
`;
const NavLink = styled.a`
  margin-left: 20px;
`;

export default Header;
