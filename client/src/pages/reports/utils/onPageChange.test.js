import onPageChange from './onPageChange';

describe('onPageChange', () => {
  const visuals = [];
  for (let index = 0; index < 6; index += 1) {
    visuals.push({
      setSlicerState: jest.fn(() => ({
        catch: jest.fn(),
      })),
    });
  }
  const getVisuals = jest.fn(() => Promise.resolve(visuals));

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('adds new pages to visitedPages', () => {
    const branchName = 'Central';
    const event = {
      detail: {
        newPage: {
          displayName: 'Test Page',
          getVisuals,
        },
      },
    };
    const visitedPages = { current: [] };
    onPageChange(branchName, event, visitedPages);
    expect(visitedPages).toEqual({ current: ['Test Page'] });
    expect(event.detail.newPage.getVisuals).not.toHaveBeenCalled();
  });

  it('sets visuals on displayName match', () => {
    const branchName = 'Central';
    let event = {
      detail: {
        newPage: {
          displayName: 'Command Brief - OAR',
          getVisuals,
        },
      },
    };
    const visitedPages = { current: [] };
    onPageChange(branchName, event, visitedPages);
    expect(visitedPages).toEqual({ current: ['Command Brief - OAR'] });
    expect(event.detail.newPage.getVisuals).toHaveBeenCalledTimes(1);

    event = {
      detail: {
        newPage: {
          displayName: 'Command Brief - IEN',
          getVisuals,
        },
      },
    };
    onPageChange(branchName, event, visitedPages);
    expect(visitedPages).toEqual({ current: ['Command Brief - OAR', 'Command Brief - IEN'] });
    expect(event.detail.newPage.getVisuals).toHaveBeenCalledTimes(2);
  });

  it('does not set visuals for other displayNames', () => {
    const branchName = 'Central';
    const event = {
      detail: {
        newPage: {
          displayName: 'Test Page',
          getVisuals,
        },
      },
    };
    const visitedPages = { current: [] };
    onPageChange(branchName, event, visitedPages);
    expect(event.detail.newPage.getVisuals).not.toHaveBeenCalled();
  });

  it('does not add existing pages to visitedPages', () => {
    const branchName = 'My branch';
    const event = {
      detail: {
        newPage: {
          displayName: 'Test Page',
        },
      },
    };
    const visitedPages = { current: ['Test Page'] };
    onPageChange(branchName, event, visitedPages);
    expect(visitedPages).toEqual({ current: ['Test Page'] });
  });
});
