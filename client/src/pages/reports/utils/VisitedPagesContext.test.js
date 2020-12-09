import React from 'react';
import { mount } from 'enzyme';
import { VisitedPagesContextProvider } from './VisitedPagesContext';

describe('VisitedPagesContext', () => {
  it('can render components without crashing', async () => {
    const wrapper = await mount(
      <VisitedPagesContextProvider>
        <div>Hello</div>
      </VisitedPagesContextProvider>
    );
    expect(wrapper).toBeDefined();
  });
});
