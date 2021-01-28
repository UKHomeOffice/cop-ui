import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import { debounce } from 'lodash';
import { useAxios } from '../../utils/hooks';
import CasesResultsPanel from './CasesResultsPanel';
import CaseDetailsPanel from './CaseDetailsPanel';
import './CasesPage.scss';

const CasePage = () => {
  const { t } = useTranslation();
  const { trackPageView } = useMatomo();

  useEffect(() => {
    trackPageView();
  }, []);
  
  const axiosInstance = useAxios();
  const [caseSearchResults, setCaseSearchResults] = useState(null);
  const [caseArray, setCaseArray] = useState(null);
  const [searching, setSearching] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const [caseSelected, setCaseSelected] = useState(null);
  const [caseLoading, setCaseLoading] = useState(false);
  const [nextUrl, setNextUrl] = useState('');

  const findCases = debounce(async (input) => {
    if (!input || input.length < 3) {
      setCaseSearchResults(null);
      setCaseSelected(null);
      setNextUrl(null);
      return;
    }
    try {
      setSearching(true);
      setCaseSelected(null);
      const resp = await axiosInstance.get(`/camunda/cases?query=${input}`);
      setCaseSearchResults(resp.data);
      setCaseArray(resp.data._embedded ? resp.data._embedded.cases : null);
      setNextUrl(resp.data._links.next ? resp.data._links.next.href : null);
    } catch (err) {
      setError(err);
    } finally {
      setSearching(false);
    }
  }, 500);

  const loadMoreCases = async (nextQuery) => {
    try {
      setCaseSelected(null);
      const resp = await axiosInstance.get(`/camunda/cases${nextQuery}`);
      setCaseArray(caseArray.concat(resp.data._embedded ? resp.data._embedded.cases : null));
      setCaseSearchResults(resp.data);
      setNextUrl(resp.data._links.next ? resp.data._links.next.href : null);
    } catch (err) {
      setError(err);
    }
  };

  const getCaseDetails = async (businessKey) => {
    try {
      setCaseLoading(true);
      const resp = await axiosInstance.get(`/camunda/cases/${businessKey}`);
      setCaseSelected(resp.data);
    } catch (err) {
      setError(err);
    } finally {
      setCaseLoading(false);
    }
  };

  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <span className="govuk-caption-l">{t('pages.cases.caption')}</span>
          <h1 className="govuk-heading-l">{t('pages.cases.heading')}</h1>
          <div className="govuk-inset-text">
            <p>{t('pages.cases.heading-help')}</p>
            <p className="govuk-!-font-weight-bold">{t('pages.cases.heading-warning')}</p>
          </div>
        </div>
        <div className="govuk-grid-column-one-third">
          <div className="govuk-form-group">
            <input
              onChange={(e) => {
                findCases(e.target.value);
              }}
              spellCheck="false"
              className="govuk-input search__input"
              placeholder={t('pages.cases.search-placeholder')}
              id="caseSearchInput"
              name="search"
              type="text"
            />
          </div>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-quarter">
          {searching && <h4 className="govuk-heading-s">Searching for cases...</h4>}
          {!searching && caseSearchResults && (
            <CasesResultsPanel
              caseSearchResults={caseSearchResults}
              caseArray={caseArray}
              getCaseDetails={getCaseDetails}
              loadMoreCases={loadMoreCases}
              nextUrl={nextUrl}
            />
          )}
        </div>
        <div className="govuk-grid-column-three-quarters">
          {caseLoading && <h4 className="govuk-heading-s">Loading case details</h4>}
          {!caseLoading && caseSelected && <CaseDetailsPanel caseSelected={caseSelected} />}
        </div>
      </div>
    </>
  );
};

export default CasePage;
