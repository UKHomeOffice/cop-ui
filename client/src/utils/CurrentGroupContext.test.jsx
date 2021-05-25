import React from 'react';
import { mount } from 'enzyme';
import { CurrentGroupContextProvider } from './CurrentGroupContext';

describe('CurrentGroupContext', () => {
  it('can render components without crashing', async () => {
    const wrapper = await mount(
      <CurrentGroupContextProvider>
        <div>Hello</div>
      </CurrentGroupContextProvider>
    );
    expect(wrapper).toBeDefined();
  });
});
