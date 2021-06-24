import latestFormDataPath from './LatestFormDataPath';

describe('latestFormDataPath', () => {
  it('sets the latest form data path if there is a single form and a single process instance', async () => {
    const processInstances = [
      {
        formReferences: [
          {
            name: 'form1',
            dataPath: 'form1DataPath1',
            submissionDate: '2021-06-24T11:26:00.000Z',
          },
        ],
      },
    ];
    const path = latestFormDataPath(processInstances, 'form1');
    expect(path).toEqual('form1DataPath1');
  });

  it('sets the latest form data path with multiple forms and multiple process instances and out of order', async () => {
    const processInstances = [
      {
        formReferences: [
          {
            name: 'form1',
            dataPath: 'form1DataPath1',
            submissionDate: '2021-06-24T11:26:00.000Z',
          },
          {
            name: 'form2',
            dataPath: 'form2DataPath1',
            submissionDate: '2021-06-22T15:49:00.000Z',
          },
        ],
      },
      {
        formReferences: [
          {
            name: 'form1',
            dataPath: 'form1DataPath3',
            submissionDate: '2021-06-25T11:26:00.000Z',
          },
          {
            name: 'form1',
            dataPath: 'form1DataPath2',
            submissionDate: '2021-06-25T09:09:00.000Z',
          },
          {
            name: 'form2',
            dataPath: 'form2DataPath2',
            submissionDate: '2021-06-22T18:12:00.000Z',
          },
        ],
      },
    ];
    const path = latestFormDataPath(processInstances, 'form1');
    expect(path).toEqual('form1DataPath3');
  });
});
