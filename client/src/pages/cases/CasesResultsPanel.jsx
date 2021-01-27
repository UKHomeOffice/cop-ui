import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import _ from 'lodash';

const CaseResultsPanel = ({
  caseSearchResults,
  caseArray,
  getCaseDetails,
  loadMoreCases,
  nextUrl,
}) => {
  const { t } = useTranslation();
  // Check if caseSearchResults.links has property 'next'
  const hasMoreData = _.has(caseSearchResults._links, 'next');

  return (
    <>
      <h2 className="govuk-heading-m">{t('pages.cases.results-panel.title')}</h2>
      <p className="govuk-body govuk-!-margin-bottom-1">{t('pages.cases.results-panel.caption')}</p>
      <p className="govuk-body govuk-!-font-weight-bold">{caseSearchResults.page.totalElements}</p>
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
      {hasMoreData ? (
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
  caseSearchResults: null,
};

CaseResultsPanel.propTypes = {
  caseSearchResults: PropTypes.shape(PropTypes.object),
  caseArray: PropTypes.arrayOf(PropTypes.object),
  getCaseDetails: PropTypes.func.isRequired,
  loadMoreCases: PropTypes.func.isRequired,
  nextUrl: PropTypes.string.isRequired,
};

export default CaseResultsPanel;
