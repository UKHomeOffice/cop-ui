import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const CaseResultsPanel = ({ totalElements, caseArray, getCaseDetails, loadMoreCases, nextUrl }) => {
  const { t } = useTranslation();

  return (
    <>
      <h2 className="govuk-heading-m">{t('pages.cases.results-panel.title')}</h2>
      <p className="govuk-body govuk-!-margin-bottom-1">{t('pages.cases.results-panel.caption')}</p>
      <p className="govuk-body govuk-!-font-weight-bold">{totalElements}</p>
      <ul className="govuk-list">
        {caseArray &&
          caseArray.map((item) => {
            return (
              <li key={item.businessKey}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                  href=""
                  className="govuk-link"
                  onClick={(e) => {
                    e.preventDefault();
                    getCaseDetails(item.businessKey);
                  }}
                >
                  {item.businessKey}
                </a>
              </li>
            );
          })}
      </ul>
      {nextUrl ? (
        <button
          type="button"
          className="govuk-button"
          onClick={(e) => {
            e.preventDefault();
            loadMoreCases(nextUrl.slice(nextUrl.indexOf('?')));
          }}
        >
          Load more
        </button>
      ) : null}
    </>
  );
};

CaseResultsPanel.defaultProps = {
  caseArray: null,
  totalElements: null,
};

CaseResultsPanel.propTypes = {
  totalElements: PropTypes.number,
  caseArray: PropTypes.arrayOf(PropTypes.object),
  getCaseDetails: PropTypes.func.isRequired,
  loadMoreCases: PropTypes.func.isRequired,
  nextUrl: PropTypes.string.isRequired,
};

export default CaseResultsPanel;
