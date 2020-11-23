import React from 'react';
import { mount } from 'enzyme';
import { TeamContextProvider } from './TeamContext';

describe('Team', () => {
  it('can render components without crashing', async () => {
    const wrapper = await mount(
      <TeamContextProvider>
        <div>Hello</div>
      </TeamContextProvider>
    );
    expect(wrapper).toBeDefined();
  });
});
