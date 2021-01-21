import { useCallback, useContext } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { useTranslation } from 'react-i18next';
import { useNavigation } from 'react-navi';
import { useAxios } from '../../utils/hooks';
import { AlertContext } from '../../utils/AlertContext';

export default () => {
  const axiosInstance = useAxios();
  const { t } = useTranslation();
  const { setAlertContext } = useContext(AlertContext);
  const navigation = useNavigation();
  const [keycloak] = useKeycloak();
  const currentUser = keycloak.tokenParsed.email;

  const submitForm = useCallback(
    ({ submission, form, id, businessKey, handleOnFailure, handleOnRepeat, submitPath }) => {
      if (form) {
        const variables = {
          [form.name]: {
            value: JSON.stringify(submission.data),
            type: 'json',
          },
          initiatedBy: {
            value: submission.data.form.submittedBy,
            type: 'string',
          },
        };

        axiosInstance
          .post(`/camunda/engine-rest/${submitPath}/${id}/submit-form`, {
            variables,
            businessKey,
          })
          .then(async () => {
            axiosInstance
              .get(`/camunda/engine-rest/task?processInstanceBusinessKey=${businessKey}`)
              .then((response) => {
                // This will automatically open the next form available (if one exists for this user)
                // We can only ever open one task in this manner and so always take the first available
                if (response.data.length > 0 && response.data[0].assignee === currentUser) {
                  navigation.navigate(`/tasks/${response.data[0].id}`);
                } else if (submission.data.submitAgain === true) {
                  handleOnRepeat();
                } else {
                  setAlertContext({
                    type: 'form-submission',
                    status: 'successful',
                    message: t('pages.task.submission.success-message'),
                    reference: `${businessKey}`,
                  });
                  navigation.navigate('/');
                }
              })
              .catch(() => {
                handleOnFailure();
              });
          })
          .catch(() => {
            handleOnFailure();
          });
      }
    },
    [axiosInstance, navigation, setAlertContext, t, currentUser]
  );

  return {
    submitForm,
  };
};
