import { powerBiSchema as $schema } from '../../../utils/constants';

const onPageChange = (branchName, event, visitedPages) => {
  let target;
  let visualNumber;
  const {
    newPage,
    newPage: { displayName },
  } = event.detail;

  if (visitedPages.current.includes(displayName)) return;

  visitedPages.current.push(displayName);

  if (displayName === 'Command Brief - OAR') {
    visualNumber = 5;
    target = { table: 'OAR', column: 'Branch Name' };
  } else if (displayName === 'Command Brief - IEN') {
    visualNumber = 4;
    target = { table: 'IEN', column: 'Branch' };
  } else {
    return;
  }

  newPage.getVisuals().then((visuals) => {
    const targetVisual = visuals[visualNumber];
    targetVisual
      .setSlicerState({
        filters: [
          {
            $schema,
            target,
            operator: 'In',
            values: [branchName],
          },
        ],
      })
      .catch((errors) => {
        // eslint-disable-next-line no-console
        console.log('Errors loading visuals:', errors);
      });
  });
};

export default onPageChange;
