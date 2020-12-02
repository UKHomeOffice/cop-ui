import { models } from 'powerbi-client';
import embedReport from './embedReport';
import powerBIService from './powerBIService';

jest.mock('./powerBIService', () => {
  return {
    embed: jest.fn((target, embedConfig) => {
      return {
        on: jest.fn(),
        mobileLayout: embedConfig.settings.layoutType,
      };
    }),
    reset: jest.fn(),
  };
});

describe('embedReport', () => {
  let resetSpy;
  let embedSpy;

  const args = {
    accessToken: 'xxx',
    branchName: 'My branch',
    embedUrl: 'http://www.testembedurl/',
    id: 'xyz',
    mobileLayout: false,
    reportContainer: {
      current: document.createElement('div'),
    },
    visitedPages: { current: [] },
  };

  beforeEach(() => {
    resetSpy = jest.spyOn(powerBIService, 'reset');
    embedSpy = jest.spyOn(powerBIService, 'embed');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('embeds report if there is a reportContainer', () => {
    const report = embedReport(args);
    expect(resetSpy).toHaveBeenCalledTimes(1);
    expect(embedSpy).toHaveBeenCalledTimes(1);
    expect(report).not.toEqual(undefined);
  });

  it('sets embedConfig as expected if mobileLayout is true', () => {
    const report = embedReport({ ...args, mobileLayout: true });
    expect(report.mobileLayout).toEqual(models.LayoutType.MobilePortrait);
  });

  it('does nothing if there is no reportContainer', () => {
    const report = embedReport({
      ...args,
      reportContainer: null,
    });
    expect(resetSpy).not.toHaveBeenCalled();
    expect(embedSpy).not.toHaveBeenCalled();
    expect(report).toEqual(undefined);
  });

  it("adds pageChange handler if user's branch is among Power BI branches", () => {
    const report = embedReport({
      ...args,
      branchName: 'Central',
    });
    expect(report.on).toHaveBeenCalledTimes(1);
  });
});
