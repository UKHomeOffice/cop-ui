import React from 'react';
import { mount } from 'enzyme';
import Header from './index';
import { mockNavigate } from '../../setupTests';

describe('Header', () => {
  it('renders without crashing', () => {
    const wrapper = mount(<Header />);
    expect(wrapper.text()).toEqual(
      'Skip to main content' +
        'header.service-name' +
        'Menu' +
        'header.my-profile' +
        'header.sign-out' +
        'header.new-service-1 ' +
        'header.new-service-2 ' +
        'header.new-service-3'
    );
  });

  it('has correct href for "My profile" link', () => {
    const wrapper = mount(<Header />);
    expect(wrapper.find('a[id="myprofile"]').prop('href')).toBe('/forms/edit-your-profile');
  });
  it('can click logout', () => {
    const wrapper = mount(<Header />);
    wrapper.find('a[id="logout"]').at(0).simulate('click');
    expect(mockNavigate).toBeCalledWith('/logout');
  });
  it('can click home', () => {
    const wrapper = mount(<Header />);
    wrapper.find('a[id="home"]').at(0).simulate('click');
    expect(mockNavigate).toBeCalledWith('/');
  });
});
