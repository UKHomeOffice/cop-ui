const latestFormDataPath = (processInstances, formKey) => {
  return processInstances
    .map(({ formReferences }) => formReferences)
    .reduce((acc, val) => acc.concat(val), [])
    .sort((a, b) => (a.submissionDate < b.submissionDate ? -1 : 1))
    .reduce((acc, { name: formName, dataPath }) => (formName === formKey ? dataPath : acc), '');
};

export default latestFormDataPath;
