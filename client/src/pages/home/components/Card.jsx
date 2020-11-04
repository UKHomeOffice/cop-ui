import React from 'react';
import PropTypes from 'prop-types';
import './_card.scss';
import { useTranslation } from 'react-i18next';

const Card = ({ count, footer, handleClick, href, isLoading, title }) => {
  const { t } = useTranslation();
  const heading = count === 1 ? title.slice(0, -1) : title;
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full __card">
        <a
          href={href}
          onClick={(e) => {
            e.preventDefault();
            handleClick();
          }}
          className="card__body"
        >
          {isLoading ? (
            <span className="govuk-!-font-size-19 govuk-!-font-weight-bold">{t('loading')}</span>
          ) : (
            <h2 className="govuk-!-font-size-36 govuk-!-font-weight-bold">
              {count === null ? heading : `${count} ${heading}`}
            </h2>
          )}
        </a>
        <div className="card__footer">
          <p className="govuk-body">{footer}</p>
        </div>
      </div>
    </div>
  );
};

Card.defaultProps = {
  count: null,
};

Card.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  count: PropTypes.number,
  href: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  footer: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Card;
