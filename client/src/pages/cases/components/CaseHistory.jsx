import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import dayjs from 'dayjs';
import { Accordion } from 'govuk-frontend';
import FormDetails from './FormDetails';

const CaseHistory = ({ businessKey, processInstances }) => {
  const { t } = useTranslation();
  const [orderedArray, setOrderedArray] = useState(processInstances);

  const clearAccordionStorage = () => {
    _.forIn(window.sessionStorage, (value, key) => {
      if (_.startsWith(key, 'caseSelected-') === true) {
        window.sessionStorage.removeItem(key);
      }
    });
  };

  const orderProcessInstances = (order) => {
    setOrderedArray(_.orderBy(orderedArray, ['startDate'], [order]));
  };

  useEffect(() => {
    clearAccordionStorage();
    new Accordion(document.getElementById(`caseSelected-${businessKey}`)).init();
    orderProcessInstances('desc');
  }, []);

  return (
    <>
      <div className="govuk-grid-column-full">
        <h3 className="govuk-heading-m">{t('pages.cases.details-panel.case-history.heading')}</h3>
        <div className="govuk-form-group">
          <label className="govuk-label" htmlFor="sort">
            {t('pages.cases.details-panel.case-history.select-input-order')}
            <select
              className="govuk-select govuk-!-display-block govuk-!-margin-top-1"
              id="sort"
              name="sort"
              onChange={(e) => {
                orderProcessInstances(e.target.value);
              }}
            >
              <option value="desc">
                {t('pages.cases.details-panel.case-history.select-input-latest')}
              </option>
              <option value="asc">
                {t('pages.cases.details-panel.case-history.select-input-earliest')}
              </option>
            </select>
          </label>
        </div>

        <div
          id={`caseSelected-${businessKey}`}
          className="govuk-accordion"
          data-module="govuk-accordion"
        >
          {orderedArray.map((processInstance) => {
            return (
              <div className="govuk-accordion__section" key={processInstance.id}>
                <div className="govuk-accordion__section-header">
                  <h4 className="govuk-accordion__section-heading">
                    <span
                      className="govuk-accordion__section-button"
                      id={`heading-${processInstance.id}`}
                    >
                      {processInstance.name}
                    </span>
                  </h4>
                </div>
                <div
                  id={`accordion-with-summary-sections-content-${processInstance.id}`}
                  className="govuk-accordion__section-content"
                  aria-labelledby={`accordion-with-summary-sections-heading-${processInstance.id}`}
                >
                  <div className="govuk-grid-row govuk-!-margin-bottom-2">
                    <div className="govuk-grid-column-full">
                      <div className="govuk-grid-row">
                        <div className="govuk-grid-column-one-half">
                          <span className="govuk-caption-m">Status</span>
                          <h3 className="govuk-heading-s">
                            <span className="govuk-tag">
                              {processInstance.endDate ? 'Completed' : 'Active'}
                            </span>
                          </h3>
                        </div>
                        <div className="govuk-grid-column-one-half">
                          <span className="govuk-caption-m">Forms</span>
                          <h3 className="govuk-heading-s">
                            {processInstance.formReferences.length} completed
                          </h3>
                        </div>
                        <div className="govuk-grid-column-one-half">
                          <span className="govuk-caption-m">Start date</span>
                          <h3 className="govuk-heading-s">
                            {dayjs(processInstance.startDate).format('DD/MM/YYYY HH:mm')}
                          </h3>
                        </div>
                        <div className="govuk-grid-column-one-half">
                          <span className="govuk-caption-m">End date</span>

                          <h3 className="govuk-heading-s">
                            {processInstance.endDate
                              ? dayjs(processInstance.endDate).format('DD/MM/YYYY HH:mm')
                              : 'Active'}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  {processInstance.formReferences.length ? (
                    <FormDetails
                      businessKey={businessKey}
                      formReferences={processInstance.formReferences}
                    />
                  ) : (
                    <h4 className="govuk-heading-s">No forms available</h4>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

CaseHistory.propTypes = {
  businessKey: PropTypes.string.isRequired,
  processInstances: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CaseHistory;
