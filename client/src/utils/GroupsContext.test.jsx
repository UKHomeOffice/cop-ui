import React from 'react';
import { mount } from 'enzyme';
import { GroupsContextProvider } from './GroupsContext';

describe('GroupsContext', () => {
  it('can render components without crashing', async () => {
    const wrapper = await mount(
      <GroupsContextProvider>
        <div>Hello</div>
      </GroupsContextProvider>
    );
    expect(wrapper).toBeDefined();
  });
});
