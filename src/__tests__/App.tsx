// tslint:disable:file-name-casing

import React from 'react';
import renderer from 'react-test-renderer';

import App from '../App';

it('renders correctly', async (): Promise<any> => {
  jest.useFakeTimers();

  const tree = renderer.create(<App />);
  expect(tree.toJSON()).toBeTruthy();

  jest.clearAllTimers();
});

// tslint:enable:file-name-casing
