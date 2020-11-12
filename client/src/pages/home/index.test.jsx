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

  it('renders forms, tasks, cases and reports panels', async () => {
    mockAxios.onPost('/camunda/engine-rest/task/count').reply(200, {
      count: 10,
    });

    const wrapper = mount(<Home />);

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    expect(wrapper.find(Card).length).toBe(4);
    const tasksCard = wrapper.find(Card).at(0);
    const formsCard = wrapper.find(Card).at(1);
    const casesCard = wrapper.find(Card).at(2);
    const reportsCard = wrapper.find(Card).at(3);

    expect(formsCard.find('h2').text()).toBe('pages.home.card.forms.title');
    expect(tasksCard.find('h2').text()).toBe('10');
    expect(reportsCard.find('h2').text()).toBe('pages.home.card.reports.title');
    expect(casesCard.find('h2').text()).toBe('pages.home.card.cases.title');
  });

  it('handles errors and sets it to zero', async () => {
    mockAxios.onPost('/camunda/engine-rest/task/count').reply(500, {});

    const wrapper = mount(<Home />);

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    expect(wrapper.find(Card).length).toBe(4);
    const tasksCard = wrapper.find(Card).at(0);
    const formsCard = wrapper.find(Card).at(1);
    const casesCard = wrapper.find(Card).at(2);
    const reportsCard = wrapper.find(Card).at(3);

    expect(formsCard.find('h2').text()).toBe('pages.home.card.forms.title');
    expect(tasksCard.find('h2').text()).toBe('0');
    expect(reportsCard.find('h2').text()).toBe('pages.home.card.reports.title');
    expect(casesCard.find('h2').text()).toBe('pages.home.card.cases.title');
  });

  it('can handle onClick', async () => {
    mockAxios.onPost('/camunda/engine-rest/task/count').reply(200, {
      count: 10,
    });
    const wrapper = await mount(<Home />);

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    expect(wrapper.find(Card).length).toBe(4);
    const tasksCard = wrapper.find(Card).at(0);
    const formsCard = wrapper.find(Card).at(1);
    const casesCard = wrapper.find(Card).at(2);
    const reportsCard = wrapper.find(Card).at(3);

    formsCard.props().handleClick();
    expect(mockNavigate).toBeCalledWith('/forms');

    tasksCard.props().handleClick();
    expect(mockNavigate).toBeCalledWith('/tasks');

    reportsCard.props().handleClick();
    expect(mockNavigate).toBeCalledWith('/reports');

    casesCard.props().handleClick();
    expect(mockNavigate).toBeCalledWith('/cases');
  });
});
