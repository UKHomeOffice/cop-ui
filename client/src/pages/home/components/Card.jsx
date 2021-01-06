import React from 'react';
import PropTypes from 'prop-types';
import './_card.scss';
import { useTranslation } from 'react-i18next';

const Card = ({ count, footer, handleClick, href, isLoading, title }) => {
  const { t } = useTranslation();
  const renderTitle = () => {
    if (count === null) {
      return <h2 className="govuk-!-font-size-36 govuk-!-font-weight-bold">{title}</h2>;
    }
    return (
      <>
        <h2 className="govuk-!-font-size-48 govuk-!-font-weight-bold">{count}</h2>
        <span className="govuk-!-font-size-19 govuk-!-font-weight-bold">{title}</span>
      </>
    );
  };
  return (
    <div className="__card govuk-grid-column-one-third">
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
          renderTitle()
        )}
      </a>
      <div className="card__footer">
        <p className="govuk-!-font-size-19">{footer}</p>
      </div>
    </div>
  );
};

Card.defaultProps = {
  count: null,
  isLoading: false,
};

Card.propTypes = {
  isLoading: PropTypes.bool,
  count: PropTypes.number,
  href: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  footer: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Card;
