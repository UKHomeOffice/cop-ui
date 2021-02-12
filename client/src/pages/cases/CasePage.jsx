import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-navi';
import { useTranslation } from 'react-i18next';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import { debounce } from 'lodash';
import { useAxios } from '../../utils/hooks';
import CasesResultsPanel from './CasesResultsPanel';
import CaseDetailsPanel from './CaseDetailsPanel';
import './CasesPage.scss';

const CasePage = (caseId) => {
  const { t } = useTranslation();
  const { trackPageView } = useMatomo();

  useEffect(() => {
    trackPageView();
  }, []);

  const axiosInstance = useAxios();
  const history = useHistory();
  const [caseSearchResults, setCaseSearchResults] = useState(null);
  const [caseArray, setCaseArray] = useState(null);
  const [searching, setSearching] = useState(false);
  const [caseSelected, setCaseSelected] = useState(null);
  const [caseLoading, setCaseLoading] = useState(false);
  const [nextUrl, setNextUrl] = useState('');
  const [processInstances, setProcessInstances] = useState([]);

  const findCases = debounce(async (input) => {
    if (!input || input.length < 3) {
      setCaseSearchResults(null);
      setCaseSelected(null);
      setNextUrl('');
      return;
    }
    try {
      setSearching(true);
      setCaseSelected(null);
      const resp = await axiosInstance.get(`/camunda/cases?query=${input}`);
      setCaseSearchResults(resp.data);
      setCaseArray(resp.data._embedded ? resp.data._embedded.cases : null);
      setNextUrl(resp.data._links.next ? resp.data._links.next.href : '');
    } catch (err) {
      setCaseSearchResults(null);
    } finally {
      setSearching(false);
    }
  }, 500);

  const loadMoreCases = async (nextQuery) => {
    try {
      setCaseSelected(null);
      const resp = await axiosInstance.get(`/camunda/cases${nextQuery}`);
      // Below line catches the case where the API is returning more cases than are actually present
      if (!resp.data._embedded) {
        return;
      }
      setCaseArray(caseArray.concat(resp.data._embedded ? resp.data._embedded.cases : null));
      setCaseSearchResults(resp.data);
      setNextUrl(resp.data._links.next ? resp.data._links.next.href : '');
    } catch (err) {
      setCaseSearchResults(null);
    }
  };

  const getCaseDetails = async (businessKey) => {
    try {
      setCaseLoading(true);
      const resp = await axiosInstance.get(`/camunda/cases/${businessKey}`);
      setCaseSelected(resp.data);
      setProcessInstances(resp.data.processInstances);
    } catch (err) {
      setCaseSelected(null);
      setProcessInstances([]);
    } finally {
      setCaseLoading(false);
      history.push(businessKey);
    }
  };

  useEffect(() => {
    if (axiosInstance) {
      getCaseDetails(caseId.caseId);
    }
  }, [axiosInstance]);

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
          {searching && <h4 className="govuk-heading-s">{t('pages.cases.search-message')}</h4>}
          {!searching && caseSearchResults && (
            <CasesResultsPanel
              totalElements={caseSearchResults.page.totalElements}
              caseArray={caseArray}
              getCaseDetails={getCaseDetails}
              loadMoreCases={loadMoreCases}
              nextUrl={nextUrl}
            />
          )}
        </div>
        <div className="govuk-grid-column-three-quarters">
          {caseLoading && <h4 className="govuk-heading-s">{t('pages.cases.loading-case')}</h4>}
          {!caseLoading && caseSelected && (
            <CaseDetailsPanel
              businessKey={caseSelected.businessKey}
              processInstances={processInstances}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default CasePage;
