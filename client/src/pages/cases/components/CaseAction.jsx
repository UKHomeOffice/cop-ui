import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Formio, Form } from 'react-formio';
import { useHistory } from 'react-navi';
import gds from '@digitalpatterns/formio-gds-template';
import { useKeycloak } from '@react-keycloak/web';
import _ from 'lodash';
import { interpolate } from '../../../utils/formioSupport';
import { useAxios, useIsMounted } from '../../../utils/hooks';
import { TeamContext } from '../../../utils/TeamContext';
import { StaffIdContext } from '../../../utils/StaffIdContext';
import FileService from '../../../utils/FileService';

Formio.use(gds);

const CaseAction = ({
  selectedAction,
  businessKey,
  existingSubmission,
  selectedActionId,
  selectedActionCompletionMessage,
}) => {
  const history = useHistory();
  const axiosInstance = useAxios();
  const isMounted = useIsMounted();
  const [submitting, setSubmitting] = useState(false);
  const [submissionConfirmation, showSubmissionConfirmation] = useState(false);
  const [form, setForm] = useState({
    isLoading: false,
    data: null,
  });

  const fetchForm = async (formKey) => {
    try {
      setForm({
        isLoading: true,
      });
      const { data } = await axiosInstance.get(`/form/name/${formKey}`);
      if (isMounted.current) {
        setForm({
          isLoading: false,
          data,
        });
      }
    } catch (e) {
      if (isMounted.current) {
        setForm({
          isLoading: false,
          data: null,
        });
      }
    }
  };

  const [keycloak] = useKeycloak();

  const {
    authServerUrl: url,
    realm,
    refreshToken,
    subject,
    token: accessToken,
    tokenParsed: {
      adelphi_number: adelphi,
      dateofleaving,
      delegate_email: delegateEmails,
      email,
      family_name: familyName,
      given_name: givenName,
      grade_id: gradeId,
      groups,
      line_manager_email: linemanagerEmail,
      location_id: defaultlocationid,
      name,
      phone,
      realm_access: { roles },
      team_id: teamid,
      session_state: sessionId,
    },
  } = keycloak;

  const fileService = new FileService(keycloak);

  const { team } = useContext(TeamContext);
  const { staffId: staffid } = useContext(StaffIdContext);

  const contexts = {
    data: {
      environmentContext: {
        attachmentServiceUrl: '/files',
        operationalDataUrl: '/opdata',
        privateUiUrl: window.location.origin,
        referenceDataUrl: '/refdata',
        workflowUrl: '/camunda',
      },
      extendedStaffDetailsContext: {
        delegateEmails,
        email,
        linemanagerEmail,
        name,
      },
      keycloakContext: {
        accessToken,
        adelphi,
        email,
        familyName,
        givenName,
        gradeId,
        groups,
        locationId: defaultlocationid,
        phone,
        realm,
        refreshToken,
        roles,
        sessionId,
        subject,
        url,
      },
      shiftDetailsContext: {
        email,
        locationid: defaultlocationid,
        phone,
        roles,
        team,
        teamid,
      },
      staffDetailsDataContext: {
        adelphi,
        dateofleaving,
        defaultlocationid,
        defaultteam: team,
        defaultteamid: teamid,
        email,
        firstname: givenName,
        gradeid: gradeId,
        locationid: defaultlocationid,
        phone,
        staffid,
        surname: familyName,
        teamid,
      },
      businessKey,
    },
  };

  const [augmentedSubmission] = useState(_.merge(existingSubmission, contexts));

  const handleOnSubmit = async (dataToSubmit, formToSubmit) => {
    const variables = {
      [formToSubmit.name]: {
        value: JSON.stringify(dataToSubmit.data),
        type: 'json',
      },
      initiatedBy: {
        value: dataToSubmit.data.form.submittedBy,
        type: 'string',
      },
    };
    try {
      const actionResponse = await axiosInstance.post(
        `/camunda/engine-rest/process-definition/key/${selectedActionId}/submit-form`,
        {
          variables,
          businessKey,
        }
      );
      console.log(actionResponse);
      setForm({
        isLoading: false,
        data: null,
      });
      showSubmissionConfirmation(true);
      setTimeout(() => {
        history.push(`/cases/${businessKey}`);
        showSubmissionConfirmation(false);
      }, 5000);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchForm(selectedAction);
  }, [axiosInstance, selectedAction]);

  interpolate(form, {
    keycloakContext: {
      accessToken: keycloak.token,
      refreshToken: keycloak.refreshToken,
      sessionId: keycloak.tokenParsed.session_state,
      email: keycloak.tokenParsed.email,
      givenName: keycloak.tokenParsed.given_name,
      familyName: keycloak.tokenParsed.family_name,
      subject: keycloak.subject,
      url: keycloak.authServerUrl,
      realm: keycloak.realm,
      roles: keycloak.tokenParsed.realm_access.roles,
      groups: keycloak.tokenParsed.groups,
    },
    ...contexts.data,
  });

  console.log(selectedActionCompletionMessage);
  return (
    <>
      {submissionConfirmation ? <div>{selectedActionCompletionMessage}</div> : null}
      {!form.isLoading && form.data && (
        <Form
          form={form.data}
          submitting={submitting}
          submission={augmentedSubmission}
          onSubmit={(submissionData) => {
            setSubmitting(true);
            handleOnSubmit(submissionData, form.data);
          }}
          options={{
            noAlerts: true,
            breadcrumbSettings: {
              clickable: false,
            },
            fileService,
            hooks: {
              beforeSubmit: (submissionData, next) => {
                /* eslint-disable no-param-reassign, no-shadow */
                const { versionId, id, title, name } = form.data;
                submissionData.data.form = {
                  formVersionId: versionId,
                  formId: id,
                  title,
                  name,
                  submissionDate: new Date(),
                  submittedBy: keycloak.tokenParsed.email,
                };
                // processContext, taskContext, keycloakContext and staffDetailsDataContext not needed in request payload
                delete submissionData.data.processContext;
                delete submissionData.data.taskContext;
                delete submissionData.data.keycloakContext;
                delete submissionData.data.staffDetailsDataContext;
                /* eslint-enable no-param-reassign, no-shadow */
                next();
              },
            },
          }}
        />
      )}
    </>
  );
};

CaseAction.defaultProps = {
  existingSubmission: {},
};

CaseAction.propTypes = {
  selectedAction: PropTypes.string.isRequired,
  selectedActionId: PropTypes.string.isRequired,
  selectedActionCompletionMessage: PropTypes.string.isRequired,
  businessKey: PropTypes.string.isRequired,
  existingSubmission: PropTypes.shape({ root: PropTypes.shape() }),
};

export default CaseAction;
