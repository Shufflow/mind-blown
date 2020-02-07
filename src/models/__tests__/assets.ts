import { createSandbox } from 'sinon';
import { renderHook, act } from '@testing-library/react-hooks';

import * as assets from '../assets';

const sandbox = createSandbox();
afterEach(sandbox.restore);

const color = { light: 'light', dark: 'dark' };
let getColor: sinon.SinonStub;
let rand: sinon.SinonStub;

beforeEach(() => {
  getColor = sandbox.stub(assets, 'getColor').returns(color);
  rand = sandbox.stub(Math, 'random').returns(0.1);
});

it('can start with light colors', () => {
  const {
    result: { current },
  } = renderHook(assets.useColors);

  expect(current.colors).toEqual({
    bgColor: color.light,
    fgColor: color.dark,
    isDark: false,
  });
});

it('can start with dark colors', () => {
  rand.returns(0.9);
  const {
    result: { current },
  } = renderHook(assets.useColors);

  expect(current.colors).toEqual({
    bgColor: color.dark,
    fgColor: color.light,
    isDark: true,
  });
});

it('gets new light colors', () => {
  const newColors = { light: 'foo', dark: 'bar' };
  getColor.onSecondCall().returns(newColors);

  const { result } = renderHook(assets.useColors);

  expect(result.current.colors.fgColor).toEqual(color.dark);

  act(() => {
    result.current.getNewColors();
  });

  expect(result.current.colors).toEqual({
    bgColor: newColors.light,
    fgColor: newColors.dark,
    isDark: false,
  });
});

it('gets new dark colors', () => {
  const newColors = { light: 'foo', dark: 'bar' };
  getColor.onSecondCall().returns(newColors);
  rand.onSecondCall().returns(0.9);

  const { result } = renderHook(assets.useColors);

  expect(result.current.colors.fgColor).toEqual(color.dark);

  act(() => {
    result.current.getNewColors();
  });

  expect(result.current.colors).toEqual({
    bgColor: newColors.dark,
    fgColor: newColors.light,
    isDark: true,
  });
});
