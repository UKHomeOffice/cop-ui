import { shallow, mount } from 'enzyme';
import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { act } from '@testing-library/react';
import Home from './index';
import Card from './components/Card';
import { mockNavigate } from '../../setupTests';

describe('Home', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  const mockAxios = new MockAdapter(axios);
  it('renders without crashing', () => {
    shallow(<Home />);
  });

  it('renders panels that have a count', async () => {
    mockAxios.onPost('/camunda/engine-rest/task/count').reply(200, {
      count: 10,
    });

    const wrapper = mount(<Home />);

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    expect(wrapper.find(Card).length).toBe(3);
    const tasksCard = wrapper.find(Card).at(0);

    expect(tasksCard.find('span[id="count"]').text()).toBe('10');
  });

  it('renders panels that do not have a count', async () => {
    const wrapper = mount(<Home />);

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    const formsCard = wrapper.find(Card).at(1);
    const casesCard = wrapper.find(Card).at(2);

    expect(formsCard.find('span[id="title"]').text()).toBe('pages.home.card.forms.title');
    expect(casesCard.find('span[id="title"]').text()).toBe('pages.home.card.cases.title');
  });

  it('handles errors and sets it to zero', async () => {
    mockAxios.onPost('/camunda/engine-rest/task/count').reply(500, {});

    const wrapper = mount(<Home />);

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    expect(wrapper.find(Card).length).toBe(3);
    const tasksCard = wrapper.find(Card).at(0);

    expect(tasksCard.find('span[id="count"]').text()).toBe('0');
  });

  it('can handle onlick', async () => {
    mockAxios.onPost('/camunda/engine-rest/task/count').reply(200, {
      count: 10,
    });
    const wrapper = await mount(<Home />);

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    const casesCard = wrapper.find(Card).at(2);
    const formsCard = wrapper.find(Card).at(1);
    const tasksCard = wrapper.find(Card).at(0);

    casesCard.props().handleClick();
    expect(mockNavigate).toBeCalledWith('/cases');

    formsCard.props().handleClick();
    expect(mockNavigate).toBeCalledWith('/forms');

    tasksCard.props().handleClick();
    expect(mockNavigate).toBeCalledWith('/tasks');
  });
});
