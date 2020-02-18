import { createSandbox } from 'sinon';

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

it('gets new light colors', () => {
  const newColors = { light: 'foo', dark: 'bar' };
  getColor.returns(newColors);

  const result = assets.getNewColors();

  expect(result).toEqual({
    bgColor: newColors.light,
    fgColor: newColors.dark,
    isDark: false,
  });
});

it('gets new dark colors', () => {
  const newColors = { light: 'foo', dark: 'bar' };
  getColor.returns(newColors);
  rand.returns(0.9);

  const result = assets.getNewColors();

  expect(result).toEqual({
    bgColor: newColors.dark,
    fgColor: newColors.light,
    isDark: true,
  });
});
