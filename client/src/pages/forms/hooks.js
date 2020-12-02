import { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from 'react-navi';
import { useAxios } from '../../utils/hooks';
import { AlertContext } from '../../utils/AlertContext';

export default () => {
  const axiosInstance = useAxios();
  const { t } = useTranslation();
  const { setAlertContext } = useContext(AlertContext);
  const navigation = useNavigation();

  const submitForm = useCallback(
    (submission, formInfo, id, handleOnFailure) => {
      if (formInfo) {
        const variables = {
          [formInfo.name]: {
            value: JSON.stringify(submission.data),
            type: 'json',
          },
          initiatedBy: {
            value: submission.data.form.submittedBy,
            type: 'string',
          },
        };
        axiosInstance
          .post(`/camunda/engine-rest/process-definition/key/${id}/submit-form`, {
            variables,
            businessKey: submission.data.businessKey,
          })
          .then(async (results) => {
              // retrieve result data
              console.log('r', results);
              console.log('k', submission.data.businessKey)
              // get the businessKey DP-20201201-10 results.data.businessKey : is this the same as submission.data.businessKey above?
              // check for tasks
              axiosInstance
                .get(`/camunda/engine-rest/task?processInstanceBusinessKey=DP-20201201-10`, {
                  variables,
                  businessKey: 'DP-20201201-10',
                })
                .then(async (results) => {
                  console.log('secondres', results)
                })
              // if YES

                // load form for task
              // ELSE if NO
                // setAlertContext




            
            // setAlertContext({
            //   type: 'form-submission',
            //   status: 'successful',
            //   message: t('pages.form.submission.success-message'),
            //   reference: `${submission.data.businessKey}`,
            // });
            // await navigation.navigate('/');
          })
          .catch(() => {
            handleOnFailure();
          });
      }
    },
    [axiosInstance, navigation, setAlertContext, t]
  );

  return {
    submitForm,
  };
};
