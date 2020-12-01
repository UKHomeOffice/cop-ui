import React from 'react';
import { mount } from 'enzyme';
import { StaffIdContextProvider } from './StaffIdContext';

describe('StaffIdContext', () => {
  it('can render components without crashing', async () => {
    const wrapper = await mount(
      <StaffIdContextProvider>
        <div>Hello</div>
      </StaffIdContextProvider>
    );
    expect(wrapper).toBeDefined();
  });
});
